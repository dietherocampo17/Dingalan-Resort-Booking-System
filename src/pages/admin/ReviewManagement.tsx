import React from 'react';
import { IonContent, IonList, IonItem, IonAvatar, IonLabel, IonIcon, IonButton, IonBadge, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/react';
import { star, trashOutline, chatbubbleOutline } from 'ionicons/icons';
import { dataService } from '../../services/MockDataService';
import { Review } from '../../types';
import './ReviewManagement.css';

const ReviewManagement: React.FC = () => {
    const [reviews, setReviews] = React.useState<Review[]>([]);
    const [isReplyModalOpen, setIsReplyModalOpen] = React.useState(false);
    const [selectedReview, setSelectedReview] = React.useState<Review | null>(null);
    const [replyText, setReplyText] = React.useState('');

    React.useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = () => {
        const data = dataService.getReviews().map(r => ({ ...r, resort: dataService.getResort(r.resortId) }));
        setReviews(data);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            dataService.deleteReview(id);
            loadReviews();
        }
    };

    const handleReplyClick = (review: any) => {
        setSelectedReview(review);
        setReplyText(review.reply?.comment || '');
        setIsReplyModalOpen(true);
    };

    const submitReply = () => {
        if (selectedReview && replyText.trim()) {
            dataService.updateReview(selectedReview.id, replyText);
            loadReviews();
            setIsReplyModalOpen(false);
            setReplyText('');
            setSelectedReview(null);
        }
    };

    return (
        <IonContent className="review-management">
            <div className="page-header">
                <h1>Reviews & Ratings</h1>
                <p>Moderate and respond to reviews</p>
            </div>

            <IonList lines="none" className="review-list">
                {reviews.map((review: any) => (
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
                            <IonButton
                                fill="clear"
                                size="small"
                                onClick={() => handleReplyClick(review)}
                                color={review.reply ? 'success' : 'primary'}
                            >
                                <IonIcon icon={chatbubbleOutline} />
                                {review.reply && <span style={{ marginLeft: '4px', fontSize: '0.8rem' }}>Replied</span>}
                            </IonButton>
                            <IonButton fill="clear" size="small" color="danger" onClick={() => handleDelete(review.id)}>
                                <IonIcon icon={trashOutline} />
                            </IonButton>
                        </div>
                        {review.reply && (
                            <div className="review-reply" style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid var(--ion-color-primary)' }}>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Your Reply:</p>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155' }}>{review.reply.comment}</p>
                            </div>
                        )}
                    </IonItem>
                ))}
            </IonList>

            <IonModal isOpen={isReplyModalOpen} onDidDismiss={() => setIsReplyModalOpen(false)} className="reply-modal">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Reply to {selectedReview?.userName}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsReplyModalOpen(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <div className="ion-padding">
                    {selectedReview && (
                        <>
                            <div className="review-context" style={{ marginBottom: '20px', padding: '12px', background: '#f1f5f9', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.9rem', color: '#475569', fontStyle: 'italic', margin: 0 }}>"{selectedReview.comment}"</p>
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Your Reply</label>
                                <textarea
                                    rows={5}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.95rem',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        backgroundColor: 'white',
                                        color: '#1e293b'
                                    }}
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder="Write your response here..."
                                />
                            </div>

                            <IonButton expand="block" onClick={submitReply} disabled={!replyText.trim()}>
                                Post Reply
                            </IonButton>
                        </>
                    )}
                </div>
            </IonModal>
        </IonContent>
    );
};

export default ReviewManagement;
