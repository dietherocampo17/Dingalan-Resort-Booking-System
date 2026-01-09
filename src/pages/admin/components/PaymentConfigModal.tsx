import React, { useState } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonToggle
} from '@ionic/react';
import { PaymentMethodConfig } from '../../../types';

interface PaymentConfigModalProps {
    isOpen: boolean;
    onDismiss: () => void;
    onSave: (config: PaymentMethodConfig) => void;
    config: PaymentMethodConfig;
}

const PaymentConfigModal: React.FC<PaymentConfigModalProps> = ({ isOpen, onDismiss, onSave, config }) => {
    const [editedConfig, setEditedConfig] = useState<PaymentMethodConfig>(config);

    // Update local state when config prop changes
    React.useEffect(() => {
        setEditedConfig(config);
    }, [config]);

    const handleSave = () => {
        onSave(editedConfig);
        onDismiss();
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Configure {config.name}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onDismiss}>Cancel</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    <IonItem>
                        <IonLabel position="stacked">Account Name</IonLabel>
                        <IonInput
                            value={editedConfig.accountName}
                            onIonChange={e => setEditedConfig({ ...editedConfig, accountName: e.detail.value! })}
                            placeholder="e.g. Dingalan Resort"
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Account Number</IonLabel>
                        <IonInput
                            value={editedConfig.accountNumber}
                            onIonChange={e => setEditedConfig({ ...editedConfig, accountNumber: e.detail.value! })}
                            placeholder="e.g. 0917 123 4567"
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Instructions</IonLabel>
                        <IonTextarea
                            rows={4}
                            value={editedConfig.instructions}
                            onIonChange={e => setEditedConfig({ ...editedConfig, instructions: e.detail.value! })}
                            placeholder="Payment instructions for the guest..."
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Enable Payment Method</IonLabel>
                        <IonToggle
                            slot="end"
                            checked={editedConfig.isEnabled}
                            onIonChange={e => setEditedConfig({ ...editedConfig, isEnabled: e.detail.checked })}
                        />
                    </IonItem>
                </IonList>
                <div className="ion-padding">
                    <IonButton expand="block" onClick={handleSave}>Save Configuration</IonButton>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default PaymentConfigModal;
