import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonChip,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonBadge,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonList,
    IonAvatar,
    IonText,
    IonFooter
} from '@ionic/react';
import {
    star,
    location,
    heart,
    heartOutline,
    share,
    wifi,
    water,
    restaurant,
    fitness,
    time,
    checkmarkCircle,
    informationCircle,
    people,
    bed
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { dataService } from '../../services/MockDataService';
import { Resort, RoomType, Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import './ResortDetailPage.css';

const ResortDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const { isAuthenticated } = useAuth();

    const [resort, setResort] = useState<Resort | null>(null);
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [activeTab, setActiveTab] = useState('rooms');
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const resortData = dataService.getResort(id);
        if (resortData) {
            setResort(resortData);
            setRooms(dataService.getRoomTypes(id));
            setReviews(dataService.getReviews(id));
        }
    }, [id]);

    if (!resort) {
        return (
            <IonPage>
                <IonContent className="ion-padding">
                    <p>Loading...</p>
                </IonContent>
            </IonPage>
        );
    }

    const handleBookRoom = (roomId: string) => {
        if (!isAuthenticated) {
            history.push('/auth/login?redirect=' + encodeURIComponent(`/client/book/${resort.id}/${roomId}`));
            return;
        }
        history.push(`/client/book/${resort.id}/${roomId}`);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/client/explore" />
                    </IonButtons>
                    <IonTitle>{resort.name}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setIsFavorite(!isFavorite)}>
                            <IonIcon icon={isFavorite ? heart : heartOutline} color={isFavorite ? 'danger' : undefined} />
                        </IonButton>
                        <IonButton>
                            <IonIcon icon={share} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="resort-detail-content">
                {/* Image Gallery */}
                <div className="image-gallery">
                    <img src={resort.images[currentImageIndex]} alt={resort.name} className="main-image" />
                    <div className="image-thumbnails">
                        {resort.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`${resort.name} ${idx + 1}`}
                                className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(idx)}
                            />
                        ))}
                    </div>
                    {resort.isVerified && (
                        <IonBadge className="verified-badge">
                            <IonIcon icon={checkmarkCircle} /> Verified
                        </IonBadge>
                    )}
                </div>

                {/* Resort Info */}
                <div className="resort-info">
                    <h1>{resort.name}</h1>
                    <div className="location-rating">
                        <span className="location">
                            <IonIcon icon={location} /> {resort.location.city}, {resort.location.province}
                        </span>
                        <span className="rating">
                            <IonIcon icon={star} color="warning" /> {resort.rating}
                            <span className="review-count">({resort.reviewCount} reviews)</span>
                        </span>
                    </div>
                    <p className="description">{resort.description}</p>
                </div>

                {/* Amenities */}
                <div className="section amenities-section">
                    <h2>Amenities</h2>
                    <div className="amenities-grid">
                        {resort.amenities.map((amenity) => (
                            <IonChip key={amenity} color="primary" outline>
                                {amenity}
                            </IonChip>
                        ))}
                    </div>
                </div>

                {/* Policies */}
                <div className="section policies-section">
                    <h2>Policies</h2>
                    <IonList lines="none">
                        <IonItem>
                            <IonIcon icon={time} slot="start" color="primary" />
                            <IonLabel>
                                <h3>Check-in / Check-out</h3>
                                <p>{resort.policies.checkIn} - {resort.policies.checkOut}</p>
                            </IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonIcon icon={informationCircle} slot="start" color="primary" />
                            <IonLabel>
                                <h3>Cancellation</h3>
                                <p>{resort.policies.cancellation}</p>
                            </IonLabel>
                        </IonItem>
                    </IonList>
                    <div className="rules">
                        <h4>House Rules</h4>
                        <ul>
                            {resort.policies.rules.map((rule, idx) => (
                                <li key={idx}>{rule}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Tabs: Rooms / Reviews */}
                <IonSegment value={activeTab} onIonChange={e => setActiveTab(e.detail.value as string)}>
                    <IonSegmentButton value="rooms">
                        <IonLabel>Rooms & Cottages</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="reviews">
                        <IonLabel>Reviews ({reviews.length})</IonLabel>
                    </IonSegmentButton>
                </IonSegment>

                {/* Rooms Tab */}
                {activeTab === 'rooms' && (
                    <div className="rooms-section">
                        {rooms.map(room => (
                            <IonCard key={room.id} className="room-card">
                                <img src={room.images[0]} alt={room.name} />
                                <IonCardHeader>
                                    <IonCardTitle>{room.name}</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <p className="room-description">{room.description}</p>
                                    <div className="room-details">
                                        <span><IonIcon icon={people} /> Up to {room.capacity} guests</span>
                                        <span><IonIcon icon={bed} /> {room.quantity} available</span>
                                    </div>
                                    <div className="room-amenities">
                                        {room.amenities.slice(0, 4).map(a => (
                                            <IonChip key={a} color="light">{a}</IonChip>
                                        ))}
                                    </div>
                                    <div className="inclusions">
                                        <h5>Inclusions:</h5>
                                        <ul>
                                            {room.inclusions.map((inc, idx) => (
                                                <li key={idx}><IonIcon icon={checkmarkCircle} color="success" /> {inc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="room-footer">
                                        <div className="price">
                                            <span className="amount">₱{room.pricePerNight.toLocaleString()}</span>
                                            <span className="per">/night</span>
                                        </div>
                                        <IonButton onClick={() => handleBookRoom(room.id)}>
                                            Book Now
                                        </IonButton>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        ))}
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div className="reviews-section">
                        {reviews.length === 0 ? (
                            <div className="no-reviews">
                                <p>No reviews yet. Be the first to review!</p>
                            </div>
                        ) : (
                            reviews.map(review => (
                                <div key={review.id} className="review-card">
                                    <div className="review-header">
                                        <IonAvatar>
                                            <img src={`https://ui-avatars.com/api/?name=${review.userName}&background=667eea&color=fff`} alt={review.userName} />
                                        </IonAvatar>
                                        <div className="review-meta">
                                            <h4>{review.userName}</h4>
                                            <span className="date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="review-rating">
                                            <IonIcon icon={star} color="warning" />
                                            <span>{review.rating}</span>
                                        </div>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default ResortDetailPage;
