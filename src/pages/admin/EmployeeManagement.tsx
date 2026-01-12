import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonBadge,
    IonModal,
    IonFab,
    IonFabButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    useIonAlert,
    useIonToast,
    IonGrid,
    IonRow,
    IonCol,
    IonAvatar
} from '@ionic/react';
import { add, create, trash, mail, call, shieldCheckmark, person } from 'ionicons/icons';
import { dataService } from '../../services/MockDataService';
import { User, UserRole } from '../../types';
import './EmployeeManagement.css';

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<User | undefined>(undefined);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'employee' as UserRole,
        phone: '',
        status: 'active'
    });
    const [password, setPassword] = useState('');
    const [showResetUI, setShowResetUI] = useState(false);

    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const users = await dataService.getUsers();
            // Filter to show only employees and admins usually, or all users for now
            // const staff = users.filter(u => u.role === 'admin' || u.role === 'employee');
            setEmployees(users);
        } catch (error) {
            console.error("Failed to load users", error);
        }
    };

    const handleOpenModal = (employee?: User) => {
        if (employee) {
            setSelectedEmployee(employee);
            setFormData({
                name: employee.name,
                email: employee.email,
                role: employee.role,
                phone: employee.phone || '',
                status: (employee.status || 'active') as 'active' | 'inactive'
            });
            setPassword('');
            setShowResetUI(false);
        } else {
            setSelectedEmployee(undefined);
            setFormData({
                name: '',
                email: '',
                role: 'employee',
                phone: '',
                status: 'active'
            });
            setPassword('');
            setShowResetUI(false);
        }
        setShowModal(true);
    };

    const generatePassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
        let pass = '';
        for (let i = 0; i < 10; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(pass);
    };

    const handleDelete = (id: string) => {
        if (id === 'admin-1') {
            presentToast({ message: 'Cannot delete main admin account', duration: 2000, color: 'warning' });
            return;
        }

        presentAlert({
            header: 'Confirm Delete',
            message: 'Are you sure you want to delete this user for real?',
            buttons: [
                'Cancel',
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: async () => {
                        try {
                            // Ideally await dataService.deleteUser(id);
                            // Optimistic update
                            setEmployees(employees.filter(e => e.id !== id));
                            dataService.deleteUser(id); // Fire and forget for now as it's mock/unimpl
                            presentToast({
                                message: 'User deleted successfully',
                                duration: 2000,
                                color: 'success'
                            });
                        } catch (error) {
                            console.error("Delete failed", error);
                        }
                    }
                }
            ]
        });
    };

    const handleSave = async () => {
        const userToSave: User = {
            id: selectedEmployee ? selectedEmployee.id : `user-${Date.now()}`,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            phone: formData.phone,
            status: formData.status as 'active' | 'inactive',
            createdAt: selectedEmployee ? selectedEmployee.createdAt : new Date().toISOString(),
            // Only update password if provided, or keep existing if editing
            password: password || (selectedEmployee ? selectedEmployee.password : undefined)
        };

        try {
            dataService.saveUser(userToSave);
            loadEmployees();
            setShowModal(false);
            presentToast({
                message: selectedEmployee ? 'Employee updated successfully' : 'Employee created successfully',
                duration: 2000,
                color: 'success'
            });
        } catch (error) {
            console.error("Save failed", error);
            presentToast({
                message: 'Failed to save employee',
                duration: 2000,
                color: 'danger'
            });
        }
    };

    const handleResetPassword = () => {
        if (selectedEmployee && password) {
            const updatedUser: User = {
                ...selectedEmployee,
                password: password
            };
            dataService.saveUser(updatedUser);
            loadEmployees(); // Refresh list/state
            setPassword('');
            setShowResetUI(false);
            presentToast({
                message: 'Password reset successfully',
                duration: 2000,
                color: 'success'
            });
        }
    };

    return (
        <IonPage>
            <IonContent className="employee-management">
                <div className="page-header">
                    <h1>Staff Directory</h1>
                    <p>Manage access and roles for resort staff.</p>
                </div>

                <IonGrid>
                    <IonRow>
                        {employees.map(employee => (
                            <IonCol size="12" sizeMd="6" sizeLg="4" key={employee.id}>
                                <IonCard className="employee-card">
                                    <IonCardHeader>
                                        <div className="employee-avatar">
                                            {employee.avatar ? (
                                                <img src={employee.avatar} alt={employee.name} />
                                            ) : (
                                                <IonAvatar>
                                                    <div className="fallback-avatar">{employee.name.charAt(0)}</div>
                                                </IonAvatar>
                                            )}
                                        </div>
                                        <IonCardTitle>{employee.name}</IonCardTitle>
                                        <IonCardSubtitle>{employee.role}</IonCardSubtitle>
                                        <IonBadge color={employee.status === 'active' ? 'success' : 'medium'}>
                                            {employee.status}
                                        </IonBadge>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <div className="contact-info">
                                            <p><IonIcon icon={mail} /> {employee.email}</p>
                                            {employee.phone && <p><IonIcon icon={call} /> {employee.phone}</p>}
                                        </div>

                                        <div className="card-actions">
                                            <IonButton fill="clear" onClick={() => handleOpenModal(employee)}>
                                                <IonIcon slot="icon-only" icon={create} />
                                            </IonButton>
                                            <IonButton fill="clear" color="danger" onClick={() => handleDelete(employee.id)}>
                                                <IonIcon slot="icon-only" icon={trash} />
                                            </IonButton>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => handleOpenModal()}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>

                <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="employee-modal">
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{selectedEmployee ? 'Edit Employee' : 'Add New Employee'}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonList>
                            <IonItem>
                                <IonLabel position="stacked">Full Name</IonLabel>
                                <IonInput
                                    value={formData.name}
                                    onIonChange={e => setFormData({ ...formData, name: e.detail.value! })}
                                    placeholder="Enter full name"
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Email</IonLabel>
                                <IonInput
                                    value={formData.email}
                                    onIonChange={e => setFormData({ ...formData, email: e.detail.value! })}
                                    placeholder="Enter email address"
                                    type="email"
                                    disabled={!!selectedEmployee} // Prevent changing email for simplicity
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Role</IonLabel>
                                <IonSelect
                                    value={formData.role}
                                    onIonChange={e => setFormData({ ...formData, role: e.detail.value! })}
                                >
                                    <IonSelectOption value="admin">Admin</IonSelectOption>
                                    <IonSelectOption value="employee">Employee</IonSelectOption>
                                    <IonSelectOption value="client">Client</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Phone</IonLabel>
                                <IonInput
                                    value={formData.phone}
                                    onIonChange={e => setFormData({ ...formData, phone: e.detail.value! })}
                                    placeholder="+63..."
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Status</IonLabel>
                                <IonSelect
                                    value={formData.status}
                                    onIonChange={e => setFormData({ ...formData, status: e.detail.value! })}
                                >
                                    <IonSelectOption value="active">Active</IonSelectOption>
                                    <IonSelectOption value="inactive">Inactive</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            {/* Password Section */}
                            {!selectedEmployee ? (
                                <div className="password-section">
                                    <IonItem>
                                        <IonLabel position="stacked">Password</IonLabel>
                                        <IonInput
                                            type="password"
                                            value={password}
                                            onIonChange={e => setPassword(e.detail.value!)}
                                            placeholder="Enter initial password"
                                        />
                                        <IonButton slot="end" fill="clear" onClick={generatePassword}>
                                            Generate
                                        </IonButton>
                                    </IonItem>
                                </div>
                            ) : (
                                <div className="password-reset-section ion-margin-top">
                                    {!showResetUI ? (
                                        <IonButton expand="block" fill="outline" color="medium" onClick={() => setShowResetUI(true)}>
                                            <IonIcon slot="start" icon={shieldCheckmark} />
                                            Reset Password
                                        </IonButton>
                                    ) : (
                                        <div className="reset-ui">
                                            <IonItem>
                                                <IonLabel position="stacked">New Password</IonLabel>
                                                <IonInput
                                                    type="password"
                                                    value={password}
                                                    onIonChange={e => setPassword(e.detail.value!)}
                                                    placeholder="Enter new password"
                                                />
                                                <IonButton slot="end" fill="clear" onClick={generatePassword}>
                                                    Generate
                                                </IonButton>
                                            </IonItem>
                                            <div className="reset-actions ion-margin-top">
                                                <IonButton expand="block" onClick={handleResetPassword}>
                                                    Confirm Reset
                                                </IonButton>
                                                <IonButton expand="block" fill="clear" color="medium" onClick={() => { setShowResetUI(false); setPassword(''); }}>
                                                    Cancel
                                                </IonButton>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </IonList>

                        <div className="modal-actions ion-margin-top">
                            <IonButton expand="block" onClick={handleSave}>
                                <IonIcon slot="start" icon={person} />
                                {selectedEmployee ? 'Save Changes' : 'Create Account'}
                            </IonButton>
                        </div>

                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default EmployeeManagement;
