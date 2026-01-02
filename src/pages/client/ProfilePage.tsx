import React from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonAvatar,
    IonButton,
    IonCard,
    IonCardContent,
    IonToggle
} from '@ionic/react';
import {
    personOutline,
    mailOutline,
    callOutline,
    heartOutline,
    settingsOutline,
    helpCircleOutline,
    shieldCheckmarkOutline,
    logOutOutline,
    chevronForward,
    moonOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
    const history = useHistory();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        history.push('/auth/login');
    };

    if (!isAuthenticated || !user) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Profile</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="profile-content">
                    <div className="login-prompt">
                        <div className="avatar-placeholder">
                            <IonIcon icon={personOutline} />
                        </div>
                        <h2>Welcome to ResortBook</h2>
                        <p>Sign in to manage your bookings and profile</p>
                        <IonButton expand="block" onClick={() => history.push('/auth/login')}>
                            Sign In
                        </IonButton>
                        <IonButton expand="block" fill="outline" onClick={() => history.push('/auth/signup')}>
                            Create Account
                        </IonButton>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Profile</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="profile-content">
                {/* Profile Header */}
                <div className="profile-header">
                    <IonAvatar className="profile-avatar">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=667eea&color=fff&size=128`}
                            alt={user.name}
                        />
                    </IonAvatar>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <IonButton fill="outline" size="small">Edit Profile</IonButton>
                </div>

                {/* Quick Stats */}
                <IonCard className="stats-card">
                    <IonCardContent>
                        <div className="stats-grid">
                            <div className="stat">
                                <span className="stat-value">3</span>
                                <span className="stat-label">Bookings</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">2</span>
                                <span className="stat-label">Favorites</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">1</span>
                                <span className="stat-label">Reviews</span>
                            </div>
                        </div>
                    </IonCardContent>
                </IonCard>

                {/* Menu Items */}
                <IonList lines="none" className="profile-menu">
                    <IonItem button detail>
                        <IonIcon icon={personOutline} slot="start" color="primary" />
                        <IonLabel>Personal Information</IonLabel>
                    </IonItem>
                    <IonItem button detail>
                        <IonIcon icon={heartOutline} slot="start" color="danger" />
                        <IonLabel>Saved Resorts</IonLabel>
                    </IonItem>
                    <IonItem button detail>
                        <IonIcon icon={shieldCheckmarkOutline} slot="start" color="success" />
                        <IonLabel>Security & Privacy</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonIcon icon={moonOutline} slot="start" color="medium" />
                        <IonLabel>Dark Mode</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                </IonList>

                <IonList lines="none" className="profile-menu">
                    <IonItem button detail>
                        <IonIcon icon={helpCircleOutline} slot="start" color="tertiary" />
                        <IonLabel>Help & Support</IonLabel>
                    </IonItem>
                    <IonItem button detail>
                        <IonIcon icon={settingsOutline} slot="start" color="medium" />
                        <IonLabel>Settings</IonLabel>
                    </IonItem>
                </IonList>

                <div className="logout-section">
                    <IonButton expand="block" fill="outline" color="danger" onClick={handleLogout}>
                        <IonIcon icon={logOutOutline} slot="start" />
                        Sign Out
                    </IonButton>
                </div>

                <div className="app-version">
                    <p>ResortBook v1.0.0</p>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ProfilePage;
