import React from 'react';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonToggle, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { bedOutline, calendarOutline, cashOutline } from 'ionicons/icons';
import { dataService } from '../../services/MockDataService';
import './AvailabilityManagement.css';

const AvailabilityManagement: React.FC = () => {
    const rooms = dataService.getRoomTypes();
    const resorts = dataService.getResorts();

    return (
        <IonContent className="availability-management">
            <div className="page-header">
                <h1>Availability Management</h1>
                <p>Manage room availability and pricing</p>
            </div>

            {resorts.map(resort => {
                const resortRooms = rooms.filter(r => r.resortId === resort.id);

                return (
                    <IonCard key={resort.id} className="resort-card">
                        <IonCardHeader>
                            <IonCardTitle>{resort.name}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonList lines="none">
                                {resortRooms.map(room => (
                                    <IonItem key={room.id} className="room-item">
                                        <div className="room-info">
                                            <h3>{room.name}</h3>
                                            <p>
                                                <IonIcon icon={bedOutline} /> Capacity: {room.capacity}
                                                {' · '}
                                                <IonIcon icon={cashOutline} /> ₱{room.pricePerNight.toLocaleString()}/night
                                            </p>
                                        </div>
                                        <div className="room-actions" slot="end">
                                            <IonBadge color="success">{room.quantity} available</IonBadge>
                                            <IonButton size="small" fill="outline">Edit</IonButton>
                                        </div>
                                    </IonItem>
                                ))}
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                );
            })}
        </IonContent>
    );
};

export default AvailabilityManagement;
