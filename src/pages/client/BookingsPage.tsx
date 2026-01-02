import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardContent,
    IonChip,
    IonIcon,
    IonButton,
    IonBadge,
    IonRefresher,
    IonRefresherContent
} from '@ionic/react';
import {
    calendarOutline,
    locationOutline,
    peopleOutline,
    timeOutline,
    checkmarkCircle,
    closeCircle,
    alertCircle,
    downloadOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { dataService } from '../../services/MockDataService';
import { useAuth } from '../../context/AuthContext';
import { Booking, BookingStatus } from '../../types';
import './BookingsPage.css';

const statusColors: Record<BookingStatus, string> = {
    pending: 'warning',
    confirmed: 'primary',
    'checked-in': 'success',
    completed: 'medium',
    cancelled: 'danger'
};

const statusIcons: Record<BookingStatus, string> = {
    pending: alertCircle,
    confirmed: checkmarkCircle,
    'checked-in': checkmarkCircle,
    completed: checkmarkCircle,
    cancelled: closeCircle
};

const BookingsPage: React.FC = () => {
    const history = useHistory();
    const { user, isAuthenticated } = useAuth();
    const [segment, setSegment] = useState<'upcoming' | 'past'>('upcoming');
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        if (user) {
            loadBookings();
        }
    }, [user]);

    const loadBookings = () => {
        if (user) {
            const userBookings = dataService.getBookings({ userId: user.id });
            setBookings(userBookings);
        }
    };

    const handleRefresh = (event: CustomEvent) => {
        loadBookings();
        setTimeout(() => event.detail.complete(), 500);
    };

    const today = new Date().toISOString().split('T')[0];

    const upcomingBookings = bookings.filter(b =>
        b.checkInDate >= today && b.status !== 'cancelled' && b.status !== 'completed'
    );

    const pastBookings = bookings.filter(b =>
        b.checkOutDate < today || b.status === 'completed' || b.status === 'cancelled'
    );

    const displayedBookings = segment === 'upcoming' ? upcomingBookings : pastBookings;

    const getResortInfo = (resortId: string) => {
        return dataService.getResort(resortId);
    };

    const getRoomInfo = (roomId: string) => {
        return dataService.getRoomType(roomId);
    };

    if (!isAuthenticated) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>My Bookings</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <div className="login-prompt">
                        <h2>Sign in to view your bookings</h2>
                        <p>Keep track of your reservations and travel plans</p>
                        <IonButton onClick={() => history.push('/auth/login')}>Sign In</IonButton>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My Bookings</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSegment value={segment} onIonChange={e => setSegment(e.detail.value as 'upcoming' | 'past')}>
                        <IonSegmentButton value="upcoming">
                            <IonLabel>Upcoming ({upcomingBookings.length})</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="past">
                            <IonLabel>Past ({pastBookings.length})</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
            </IonHeader>

            <IonContent className="bookings-content">
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent />
                </IonRefresher>

                {displayedBookings.length === 0 ? (
                    <div className="empty-state">
                        <IonIcon icon={calendarOutline} />
                        <h3>No {segment} bookings</h3>
                        <p>{segment === 'upcoming'
                            ? 'Start planning your next getaway!'
                            : 'Your past bookings will appear here'}</p>
                        {segment === 'upcoming' && (
                            <IonButton onClick={() => history.push('/client/explore')}>
                                Explore Resorts
                            </IonButton>
                        )}
                    </div>
                ) : (
                    <div className="bookings-list">
                        {displayedBookings.map(booking => {
                            const resort = getResortInfo(booking.resortId);
                            const room = getRoomInfo(booking.roomTypeId);

                            if (!resort || !room) return null;

                            return (
                                <IonCard key={booking.id} className="booking-card">
                                    <div className="booking-image">
                                        <img src={resort.images[0]} alt={resort.name} />
                                        <IonBadge color={statusColors[booking.status]} className="status-badge">
                                            <IonIcon icon={statusIcons[booking.status]} />
                                            {booking.status.replace('-', ' ')}
                                        </IonBadge>
                                    </div>
                                    <IonCardContent>
                                        <h3>{resort.name}</h3>
                                        <p className="room-name">{room.name}</p>

                                        <div className="booking-details">
                                            <div className="detail">
                                                <IonIcon icon={calendarOutline} />
                                                <span>
                                                    {new Date(booking.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    {' - '}
                                                    {new Date(booking.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="detail">
                                                <IonIcon icon={peopleOutline} />
                                                <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="detail">
                                                <IonIcon icon={locationOutline} />
                                                <span>{resort.location.city}</span>
                                            </div>
                                        </div>

                                        <div className="booking-footer">
                                            <div className="price">
                                                <span className="label">Total</span>
                                                <span className="amount">₱{booking.totalPrice.toLocaleString()}</span>
                                            </div>
                                            <div className="actions">
                                                {booking.status === 'confirmed' && (
                                                    <IonButton size="small" fill="outline">
                                                        <IonIcon icon={downloadOutline} slot="start" />
                                                        Receipt
                                                    </IonButton>
                                                )}
                                                <IonButton size="small" onClick={() => history.push(`/client/resort/${booking.resortId}`)}>
                                                    View Resort
                                                </IonButton>
                                            </div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            );
                        })}
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default BookingsPage;
