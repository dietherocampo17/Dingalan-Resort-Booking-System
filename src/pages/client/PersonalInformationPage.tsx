import React, { useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonLoading,
    IonToast
} from '@ionic/react';
import { saveOutline, personOutline, mailOutline, callOutline } from 'ionicons/icons';
import { useAuth } from '../../context/AuthContext';

const PersonalInformationPage: React.FC = () => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateProfile({ name, phone }); // Email usually immutable or requires verification
            setShowToast(true);
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/client/profile" />
                    </IonButtons>
                    <IonTitle>Personal Information</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <IonItem lines="full" className="ion-margin-bottom">
                        <IonIcon icon={personOutline} slot="start" color="primary" />
                        <IonLabel position="stacked">Full Name</IonLabel>
                        <IonInput
                            value={name}
                            onIonInput={e => setName(e.detail.value!)}
                            placeholder="Enter your full name"
                        />
                    </IonItem>

                    <IonItem lines="full" className="ion-margin-bottom">
                        <IonIcon icon={mailOutline} slot="start" color="primary" />
                        <IonLabel position="stacked">Email Address</IonLabel>
                        <IonInput
                            value={email}
                            readonly
                            color="medium"
                            title="Email cannot be changed"
                        />
                    </IonItem>

                    <IonItem lines="full" className="ion-margin-bottom">
                        <IonIcon icon={callOutline} slot="start" color="primary" />
                        <IonLabel position="stacked">Phone Number</IonLabel>
                        <IonInput
                            value={phone}
                            onIonInput={e => setPhone(e.detail.value!)}
                            placeholder="Enter your phone number"
                            type="tel"
                        />
                    </IonItem>

                    <IonButton
                        expand="block"
                        className="ion-margin-top"
                        onClick={handleSave}
                        shape="round"
                    >
                        <IonIcon icon={saveOutline} slot="start" />
                        Save Changes
                    </IonButton>
                </div>

                <IonLoading isOpen={isLoading} message="Saving changes..." />
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="Profile updated successfully"
                    duration={2000}
                    color="success"
                    position="top"
                />
            </IonContent>
        </IonPage>
    );
};

export default PersonalInformationPage;
