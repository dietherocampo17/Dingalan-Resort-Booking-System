import React from 'react';
import { IonContent, IonList, IonItem, IonAvatar, IonLabel, IonBadge, IonButton, IonIcon, IonSearchbar, IonFab, IonFabButton } from '@ionic/react';
import { addOutline, createOutline, trashOutline, shieldCheckmark } from 'ionicons/icons';
import './EmployeeManagement.css';

const EmployeeManagement: React.FC = () => {
    const employees = [
        { id: '1', name: 'Front Desk Staff', email: 'employee@resort.com', role: 'Front Desk', status: 'active' },
        { id: '2', name: 'Resort Manager', email: 'manager@resort.com', role: 'Manager', status: 'active' },
        { id: '3', name: 'Maintenance Staff', email: 'maintenance@resort.com', role: 'Maintenance', status: 'inactive' },
    ];

    return (
        <IonContent className="employee-management">
            <div className="page-header">
                <h1>Employee Management</h1>
                <p>Manage staff accounts and permissions</p>
            </div>

            <IonSearchbar placeholder="Search employees..." />

            <IonList lines="none" className="employee-list">
                {employees.map(emp => (
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
                            <IonBadge color={emp.status === 'active' ? 'success' : 'medium'}>{emp.status}</IonBadge>
                            <IonButton fill="clear" size="small">
                                <IonIcon icon={createOutline} />
                            </IonButton>
                        </div>
                    </IonItem>
                ))}
            </IonList>

            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton>
                    <IonIcon icon={addOutline} />
                </IonFabButton>
            </IonFab>
        </IonContent>
    );
};

export default EmployeeManagement;
