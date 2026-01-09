import React, { useState, useEffect } from 'react';
import { IonContent, IonList, IonItem, IonLabel, IonToggle, IonInput, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge } from '@ionic/react';
import { saveOutline, createOutline, settingsOutline } from 'ionicons/icons';
import { dataService } from '../../services/MockDataService';
import { PaymentMethodConfig } from '../../types';
import PaymentConfigModal from './components/PaymentConfigModal';
import './SystemSettings.css';

const SystemSettings: React.FC = () => {
    const [configs, setConfigs] = useState<PaymentMethodConfig[]>([]);
    const [selectedConfig, setSelectedConfig] = useState<PaymentMethodConfig | null>(null);

    useEffect(() => {
        loadConfigs();
    }, []);

    const loadConfigs = () => {
        setConfigs(dataService.getPaymentConfigs());
    };

    const handleSaveConfig = (config: PaymentMethodConfig) => {
        dataService.savePaymentConfig(config);
        loadConfigs();
    };

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
                <IonCardHeader><IonCardTitle>Payment Configuration</IonCardTitle></IonCardHeader>
                <IonCardContent>
                    <IonList lines="none">
                        {configs.map(config => (
                            <IonItem key={config.id} button onClick={() => setSelectedConfig(config)}>
                                <IonLabel>
                                    <h3>{config.name}</h3>
                                    <p>{config.accountName} - {config.accountNumber}</p>
                                </IonLabel>
                                <IonBadge slot="end" color={config.isEnabled ? 'success' : 'medium'}>
                                    {config.isEnabled ? 'Enabled' : 'Disabled'}
                                </IonBadge>
                                <IonIcon icon={settingsOutline} slot="end" color="medium" />
                            </IonItem>
                        ))}
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
                <IonButton expand="block"><IonIcon icon={saveOutline} slot="start" />Save Other Settings</IonButton>
            </div>

            {selectedConfig && (
                <PaymentConfigModal
                    isOpen={!!selectedConfig}
                    config={selectedConfig}
                    onDismiss={() => setSelectedConfig(null)}
                    onSave={handleSaveConfig}
                />
            )}
        </IonContent>
    );
};

export default SystemSettings;
