import React from 'react';
import { IonContent, IonList, IonItem, IonAvatar, IonLabel, IonIcon, IonButton, IonBadge } from '@ionic/react';
import { star, trashOutline, chatbubbleOutline } from 'ionicons/icons';
import { dataService } from '../../services/MockDataService';
import './ReviewManagement.css';

const ReviewManagement: React.FC = () => {
    const reviews = dataService.getReviews().map(r => ({ ...r, resort: dataService.getResort(r.resortId) }));

    return (
        <IonContent className="review-management">
            <div className="page-header">
                <h1>Reviews & Ratings</h1>
                <p>Moderate and respond to reviews</p>
            </div>

            <IonList lines="none" className="review-list">
                {reviews.map(review => (
                    <IonItem key={review.id} className="review-item">
                        <IonAvatar slot="start">
                            <img src={`https://ui-avatars.com/api/?name=${review.userName}&background=667eea&color=fff`} alt={review.userName} />
                        </IonAvatar>
                        <IonLabel>
                            <h3>{review.userName}</h3>
                            <p className="resort">{review.resort?.name}</p>
                            <div className="rating">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <IonIcon key={i} icon={star} color={i <= review.rating ? 'warning' : 'medium'} />
                                ))}
                            </div>
                            <p className="comment">{review.comment}</p>
                            <p className="date">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </IonLabel>
                        <div slot="end" className="review-actions">
                            <IonButton fill="clear" size="small"><IonIcon icon={chatbubbleOutline} /></IonButton>
                            <IonButton fill="clear" size="small" color="danger"><IonIcon icon={trashOutline} /></IonButton>
                        </div>
                    </IonItem>
                ))}
            </IonList>
        </IonContent>
    );
};

export default ReviewManagement;
