import React, { useState } from 'react';
import {
    IonContent,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonBadge,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonFab,
    IonFabButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonInput,
    IonSelect,
    IonSelectOption,
    useIonToast,
    useIonAlert
} from '@ionic/react';
import { addOutline, createOutline, trashOutline, shieldCheckmark, close } from 'ionicons/icons';
import { dataService } from '../../services/MockDataService';
import { User, UserRole } from '../../types';
import './EmployeeManagement.css';

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<User[]>(dataService.getUsers());
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'employee' as UserRole,
        status: 'active' as 'active' | 'inactive'
    });
    const [presentToast] = useIonToast();
    const [presentAlert] = useIonAlert();

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleAdd = () => {
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            role: 'employee',
            status: 'active'
        });
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status || 'active'
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        presentAlert({
            header: 'Confirm Delete',
            message: 'Are you sure you want to delete this employee?',
            buttons: [
                'Cancel',
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        dataService.deleteUser(id);
                        setEmployees(dataService.getUsers());
                        presentToast({
                            message: 'Employee deleted successfully',
                            duration: 2000,
                            color: 'danger'
                        });
                    }
                }
            ]
        });
    };

    const handleSave = () => {
        const userToSave: User = {
            id: editingUser ? editingUser.id : `user-${Date.now()}`,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status,
            createdAt: editingUser ? editingUser.createdAt : new Date().toISOString()
        };

        dataService.saveUser(userToSave);
        setEmployees(dataService.getUsers());
        setIsModalOpen(false);
        presentToast({
            message: editingUser ? 'Employee updated' : 'Employee created',
            duration: 2000,
            color: 'success'
        });
    };

    return (
        <IonContent className="employee-management">
            <div className="page-header">
                <h1>Employee Management</h1>
                <p>Manage staff accounts and permissions</p>
            </div>

            <IonSearchbar
                placeholder="Search employees..."
                value={searchText}
                onIonInput={e => setSearchText(e.detail.value!)}
                className="custom-search"
            />

            <IonList lines="none" className="employee-list">
                {filteredEmployees.map(emp => (
                    <IonItem key={emp.id} className="employee-item">
                        <IonAvatar slot="start">
                            <img src={`https://ui-avatars.com/api/?name=${emp.name}&background=6366f1&color=fff`} alt={emp.name} />
                        </IonAvatar>
                        <IonLabel>
                            <h3>{emp.name}</h3>
                            <p>{emp.email}</p>
                            <p className="role"><IonIcon icon={shieldCheckmark} /> {emp.role}</p>
                        </IonLabel>
                        <div slot="end" className="employee-actions">
                            <IonBadge
                                color={emp.status === 'active' ? 'success' : 'medium'}
                                style={{ marginRight: '10px' }}
                            >
                                {emp.status}
                            </IonBadge>
                            <IonButton fill="clear" size="small" onClick={() => handleEdit(emp)}>
                                <IonIcon icon={createOutline} />
                            </IonButton>
                            <IonButton fill="clear" size="small" color="danger" onClick={() => handleDelete(emp.id)}>
                                <IonIcon icon={trashOutline} />
                            </IonButton>
                        </div>
                    </IonItem>
                ))}
            </IonList>

            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton onClick={handleAdd}>
                    <IonIcon icon={addOutline} />
                </IonFabButton>
            </IonFab>

            <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)} className="employee-modal">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{editingUser ? 'Edit Employee' : 'Add Employee'}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsModalOpen(false)}>
                                <IonIcon icon={close} />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <div className="ion-padding modal-content-container">
                    <div className="form-group">
                        <IonInput
                            label="Full Name"
                            labelPlacement="stacked"
                            fill="outline"
                            value={formData.name}
                            onIonInput={e => setFormData({ ...formData, name: e.detail.value! })}
                            className="custom-input"
                        />
                    </div>
                    <div className="form-group">
                        <IonInput
                            label="Email Address"
                            labelPlacement="stacked"
                            fill="outline"
                            type="email"
                            value={formData.email}
                            onIonInput={e => setFormData({ ...formData, email: e.detail.value! })}
                            className="custom-input"
                        />
                    </div>
                    <div className="form-group">
                        <IonSelect
                            label="Role"
                            labelPlacement="stacked"
                            fill="outline"
                            value={formData.role}
                            onIonChange={e => setFormData({ ...formData, role: e.detail.value })}
                            className="custom-input"
                        >
                            <IonSelectOption value="employee">Employee</IonSelectOption>
                            <IonSelectOption value="admin">Admin</IonSelectOption>
                        </IonSelect>
                    </div>
                    <div className="form-group">
                        <IonSelect
                            label="Status"
                            labelPlacement="stacked"
                            fill="outline"
                            value={formData.status}
                            onIonChange={e => setFormData({ ...formData, status: e.detail.value })}
                            className="custom-input"
                        >
                            <IonSelectOption value="active">Active</IonSelectOption>
                            <IonSelectOption value="inactive">Inactive</IonSelectOption>
                        </IonSelect>
                    </div>
                    <IonButton expand="block" className="save-btn" onClick={handleSave}>
                        {editingUser ? 'Update Employee' : 'Create Account'}
                    </IonButton>
                </div>
            </IonModal>
        </IonContent>
    );
};

export default EmployeeManagement;
