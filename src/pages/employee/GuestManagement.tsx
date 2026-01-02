import React from 'react';
import { IonContent, IonList, IonItem, IonAvatar, IonLabel, IonBadge, IonSearchbar, IonButton, IonIcon } from '@ionic/react';
import { addOutline, callOutline, mailOutline } from 'ionicons/icons';
import './GuestManagement.css';

const GuestManagement: React.FC = () => {
    // Mock guest data
    const guests = [
        { id: '1', name: 'John Traveler', email: 'guest@example.com', phone: '+1234567890', bookings: 3, status: 'checked-in' },
        { id: '2', name: 'Maria Santos', email: 'maria@email.com', phone: '+0987654321', bookings: 1, status: 'upcoming' },
        { id: '3', name: 'Carlos Reyes', email: 'carlos@email.com', phone: '+1122334455', bookings: 2, status: 'past' },
    ];

    return (
        <IonContent className="guest-management">
            <div className="page-header">
                <h1>Guest Management</h1>
                <IonButton size="small">
                    <IonIcon icon={addOutline} slot="start" />
                    Add Walk-in
                </IonButton>
            </div>

            <IonSearchbar placeholder="Search guests..." />

            <IonList lines="none" className="guest-list">
                {guests.map(guest => (
                    <IonItem key={guest.id} className="guest-item" button detail>
                        <IonAvatar slot="start">
                            <img src={`https://ui-avatars.com/api/?name=${guest.name}&background=3498db&color=fff`} alt={guest.name} />
                        </IonAvatar>
                        <IonLabel>
                            <h3>{guest.name}</h3>
                            <p><IonIcon icon={mailOutline} /> {guest.email}</p>
                            <p><IonIcon icon={callOutline} /> {guest.phone}</p>
                        </IonLabel>
                        <div slot="end" className="guest-stats">
                            <span>{guest.bookings} bookings</span>
                            <IonBadge color={guest.status === 'checked-in' ? 'success' : guest.status === 'upcoming' ? 'primary' : 'medium'}>
                                {guest.status}
                            </IonBadge>
                        </div>
                    </IonItem>
                ))}
            </IonList>
        </IonContent>
    );
};

export default GuestManagement;
