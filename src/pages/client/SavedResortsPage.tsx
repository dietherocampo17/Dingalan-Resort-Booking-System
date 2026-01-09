import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
    IonChip,
    IonBadge,
    IonButton
} from '@ionic/react';
import { heart, heartOutline, star, location, mapOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/MockDataService';
import { Resort } from '../../types';
import './SavedResortsPage.css';

const SavedResortsPage: React.FC = () => {
    const history = useHistory();
    const { user, toggleFavorite } = useAuth();
    const [savedResorts, setSavedResorts] = useState<Resort[]>([]);

    useEffect(() => {
        loadSavedResorts();
    }, [user?.favorites]);

    const loadSavedResorts = () => {
        if (!user?.favorites || user.favorites.length === 0) {
            setSavedResorts([]);
            return;
        }

        // Fetch resorts that match IDs in favorites
        const allResorts = dataService.getResorts();
        const favorites = allResorts.filter(r => user.favorites?.includes(r.id));
        setSavedResorts(favorites);
    };

    const handleToggleFavorite = async (e: React.MouseEvent, resortId: string) => {
        e.stopPropagation();
        await toggleFavorite(resortId);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/client/profile" />
                    </IonButtons>
                    <IonTitle>Saved Resorts</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="saved-resorts-content ion-padding">
                {savedResorts.length === 0 ? (
                    <div className="no-favorites">
                        <IonIcon icon={heartOutline} />
                        <h3>No Saved Resorts Yet</h3>
                        <p>Start exploring and save your favorite resorts to access them quickly here.</p>
                        <IonButton routerLink="/client/explore" shape="round">
                            <IonIcon icon={mapOutline} slot="start" />
                            Explore Resorts
                        </IonButton>
                    </div>
                ) : (
                    <IonGrid>
                        <IonRow>
                            {savedResorts.map(resort => (
                                <IonCol key={resort.id} size="12" sizeMd="6" sizeLg="4">
                                    <IonCard
                                        className="resort-card"
                                        onClick={() => history.push(`/client/resort/${resort.id}`)}
                                    >
                                        <div className="card-image-container">
                                            <img src={resort.images[0]} alt={resort.name} />
                                            {resort.isVerified && (
                                                <IonBadge className="verified-badge">Verified</IonBadge>
                                            )}
                                            <button
                                                className="favorite-btn"
                                                onClick={(e) => handleToggleFavorite(e, resort.id)}
                                            >
                                                <IonIcon icon={heart} />
                                            </button>
                                        </div>
                                        <div className="card-body">
                                            <IonCardHeader>
                                                <IonCardTitle>{resort.name}</IonCardTitle>
                                                <IonCardSubtitle>
                                                    <IonIcon icon={location} /> {resort.location.city}, {resort.location.province}
                                                </IonCardSubtitle>
                                            </IonCardHeader>
                                            <IonCardContent>
                                                <div className="amenities-preview">
                                                    {resort.amenities.slice(0, 3).map(a => (
                                                        <IonChip key={a} color="light" className="amenity-chip">{a}</IonChip>
                                                    ))}
                                                </div>
                                                <div className="card-footer">
                                                    <div className="rating">
                                                        <IonIcon icon={star} color="warning" />
                                                        <span>{resort.rating}</span>
                                                        <span className="review-count">({resort.reviewCount})</span>
                                                    </div>
                                                    <div className="price">
                                                        <span className="amount">₱{resort.priceRange.min.toLocaleString()}</span>
                                                        <span className="per">/night</span>
                                                    </div>
                                                </div>
                                            </IonCardContent>
                                        </div>
                                    </IonCard>
                                </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>
                )}
            </IonContent>
        </IonPage>
    );
};

export default SavedResortsPage;
