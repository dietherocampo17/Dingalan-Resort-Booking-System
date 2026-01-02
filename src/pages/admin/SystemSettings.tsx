import React from 'react';
import { IonContent, IonList, IonItem, IonLabel, IonToggle, IonInput, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { saveOutline } from 'ionicons/icons';
import './SystemSettings.css';

const SystemSettings: React.FC = () => {
    return (
        <IonContent className="system-settings">
            <div className="page-header">
                <h1>System Settings</h1>
                <p>Configure app-wide settings</p>
            </div>

            <IonCard className="settings-card">
                <IonCardHeader><IonCardTitle>Booking Settings</IonCardTitle></IonCardHeader>
                <IonCardContent>
                    <IonList lines="none">
                        <IonItem><IonLabel>Enable Online Booking</IonLabel><IonToggle slot="end" checked /></IonItem>
                        <IonItem><IonLabel>Require ID Verification</IonLabel><IonToggle slot="end" /></IonItem>
                        <IonItem><IonLabel>Allow Walk-in Bookings</IonLabel><IonToggle slot="end" checked /></IonItem>
                    </IonList>
                </IonCardContent>
            </IonCard>

            <IonCard className="settings-card">
                <IonCardHeader><IonCardTitle>Payment Settings</IonCardTitle></IonCardHeader>
                <IonCardContent>
                    <IonList lines="none">
                        <IonItem><IonLabel>Service Fee (%)</IonLabel><IonInput type="number" value="10" className="input-end" /></IonItem>
                        <IonItem><IonLabel>Tax Rate (%)</IonLabel><IonInput type="number" value="12" className="input-end" /></IonItem>
                        <IonItem><IonLabel>Enable Partial Payment</IonLabel><IonToggle slot="end" checked /></IonItem>
                    </IonList>
                </IonCardContent>
            </IonCard>

            <IonCard className="settings-card">
                <IonCardHeader><IonCardTitle>Cancellation Policy</IonCardTitle></IonCardHeader>
                <IonCardContent>
                    <IonList lines="none">
                        <IonItem><IonLabel>Free Cancellation (hours before)</IonLabel><IonInput type="number" value="48" className="input-end" /></IonItem>
                        <IonItem><IonLabel>Cancellation Fee (%)</IonLabel><IonInput type="number" value="20" className="input-end" /></IonItem>
                    </IonList>
                </IonCardContent>
            </IonCard>

            <div className="save-section">
                <IonButton expand="block"><IonIcon icon={saveOutline} slot="start" />Save Settings</IonButton>
            </div>
        </IonContent>
    );
};

export default SystemSettings;
