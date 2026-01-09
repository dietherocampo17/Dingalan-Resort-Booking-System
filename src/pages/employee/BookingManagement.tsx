import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonAvatar,
    IonBadge,
    IonButton,
    IonIcon,
    IonActionSheet,
    IonRefresher,
    IonRefresherContent,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonCard,
    IonCardContent
} from '@ionic/react';
import {
    checkmarkCircle,
    closeCircle,
    ellipsisVertical,
    logInOutline,
    logOutOutline,
    close
} from 'ionicons/icons';
import { dataService } from '../../services/MockDataService';
import { Booking } from '../../types';
import { useAuth } from '../../context/AuthContext';
import './BookingManagement.css';

import { useLocation } from 'react-router-dom';

const BookingManagement: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation<{ bookingId?: string }>();
    const [bookings, setBookings] = useState<any[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [searchText, setSearchText] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [showActions, setShowActions] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        loadBookings();
    }, [filter]);

    // Check for passed bookingId from dashboard
    useEffect(() => {
        if (location.state?.bookingId && bookings.length > 0) {
            const booking = bookings.find(b => b.id === location.state.bookingId);
            if (booking) {
                setSelectedBooking(booking);
                setShowDetails(true);
                // Clean up state to prevent reopening on reload (optional but good practice)
                // history.replace({ ...location, state: undefined }); 
            }
        }
    }, [location.state, bookings]);

    const loadBookings = () => {
        // ... existing loadBookings logic ...
        let allBookings = dataService.getBookings();

        if (filter !== 'all') {
            allBookings = allBookings.filter(b => b.status === filter);
        }

        const enrichedBookings = allBookings.map(b => ({
            ...b,
            resort: dataService.getResort(b.resortId),
            room: dataService.getRoomType(b.roomTypeId),
            guest: dataService.getUser(b.userId)
        }));

        setBookings(enrichedBookings);
    };

    const handleRefresh = (event: CustomEvent) => {
        loadBookings();
        setTimeout(() => event.detail.complete(), 500);
    };

    const handleStatusChange = (bookingId: string, newStatus: string) => {
        const updates: Partial<Booking> = { status: newStatus as any };

        if (user) {
            if (newStatus === 'confirmed') {
                updates.confirmedBy = user.name;
            } else if (newStatus === 'checked-in') {
                updates.checkedInBy = user.name;
            } else if (newStatus === 'completed') {
                updates.checkedOutBy = user.name;
            }
        }

        const updated = dataService.updateBooking(bookingId, updates);
        loadBookings();
        setShowActions(false);

        if (showDetails && updated) {
            const enriched = {
                ...updated,
                resort: dataService.getResort(updated!.resortId),
                room: dataService.getRoomType(updated!.roomTypeId),
                guest: dataService.getUser(updated!.userId)
            };
            setSelectedBooking(enriched);
        } else {
            setSelectedBooking(null);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'warning',
            confirmed: 'primary',
            'checked-in': 'success',
            completed: 'medium',
            cancelled: 'danger'
        };
        return colors[status] || 'medium';
    };

    const filteredBookings = bookings.filter(b =>
        b.resort?.name.toLowerCase().includes(searchText.toLowerCase()) ||
        b.room?.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <IonContent className="booking-management">
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent />
            </IonRefresher>

            <div className="management-header">
                <IonSearchbar
                    value={searchText}
                    onIonInput={e => setSearchText(e.detail.value!)}
                    placeholder="Search bookings..."
                />
                <IonSegment
                    value={filter}
                    onIonChange={e => setFilter(e.detail.value as string)}
                    scrollable
                >
                    <IonSegmentButton value="all">
                        <IonLabel>All</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="pending">
                        <IonLabel>Pending</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="confirmed">
                        <IonLabel>Confirmed</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="checked-in">
                        <IonLabel>Checked In</IonLabel>
                    </IonSegmentButton>
                </IonSegment>
            </div>

            <IonList lines="none" className="booking-list">
                {filteredBookings.map(booking => (
                    <IonItem
                        key={booking.id}
                        className="booking-item"
                        onClick={() => { setSelectedBooking(booking); setShowDetails(true); }}
                    >
                        <IonAvatar slot="start">
                            <img src={booking.resort?.images[0] || 'https://via.placeholder.com/100'} alt="Resort" />
                        </IonAvatar>
                        <IonLabel>
                            <h3>{booking.resort?.name}</h3>
                            <p>{booking.room?.name}</p>
                            <p className="booking-dates">
                                {new Date(booking.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                {' - '}
                                {new Date(booking.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                {' · '}{booking.guests} guests
                            </p>
                        </IonLabel>
                        <div className="item-end" slot="end">
                            <IonBadge color={getStatusColor(booking.status)}>
                                {booking.status}
                            </IonBadge>
                            <IonButton
                                fill="clear"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBooking(booking);
                                    setShowActions(true);
                                }}
                            >
                                <IonIcon icon={ellipsisVertical} />
                            </IonButton>
                        </div>
                    </IonItem>
                ))}
            </IonList>

            {filteredBookings.length === 0 && (
                <div className="empty-state">
                    <p>No bookings found</p>
                </div>
            )}

            {/* Action Sheet */}
            <IonActionSheet
                isOpen={showActions}
                onDidDismiss={() => setShowActions(false)}
                header="Update Booking Status"
                buttons={[
                    {
                        text: 'Confirm Booking',
                        icon: checkmarkCircle,
                        handler: () => handleStatusChange(selectedBooking?.id, 'confirmed')
                    },
                    {
                        text: 'Check In',
                        icon: logInOutline,
                        handler: () => handleStatusChange(selectedBooking?.id, 'checked-in')
                    },
                    {
                        text: 'Check Out',
                        icon: logOutOutline,
                        handler: () => handleStatusChange(selectedBooking?.id, 'completed')
                    },
                    {
                        text: 'Cancel Booking',
                        icon: closeCircle,
                        role: 'destructive',
                        handler: () => handleStatusChange(selectedBooking?.id, 'cancelled')
                    },
                    {
                        text: 'Close',
                        role: 'cancel'
                    }
                ]}
            />

            {/* Booking Details Modal */}
            <IonModal isOpen={showDetails} onDidDismiss={() => setShowDetails(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Booking Details</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowDetails(false)}>
                                <IonIcon icon={close} />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="booking-details-modal">
                    {selectedBooking && (
                        <>
                            <IonCard>
                                <img src={selectedBooking.resort?.images[0]} alt="Resort" />
                                <IonCardContent>
                                    <h2>{selectedBooking.resort?.name}</h2>
                                    <p>{selectedBooking.room?.name}</p>
                                    <IonBadge color={getStatusColor(selectedBooking.status)}>
                                        {selectedBooking.status}
                                    </IonBadge>
                                </IonCardContent>
                            </IonCard>

                            <div className="details-section">
                                <h3>Booking Information</h3>
                                <div className="detail-row">
                                    <span>Check-in</span>
                                    <strong>{new Date(selectedBooking.checkInDate).toLocaleDateString()}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Check-out</span>
                                    <strong>{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Guests</span>
                                    <strong>{selectedBooking.guests}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Total Amount</span>
                                    <strong>₱{selectedBooking.totalPrice.toLocaleString()}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Payment Status</span>
                                    <IonBadge color={selectedBooking.paymentStatus === 'paid' ? 'success' : 'warning'}>
                                        {selectedBooking.paymentStatus}
                                    </IonBadge>
                                </div>

                                <div className="details-section">
                                    <h3>Guest Information</h3>
                                    <div className="detail-row">
                                        <span>Name</span>
                                        <strong>{selectedBooking.guest?.name || 'Unknown'}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Email</span>
                                        <strong>{selectedBooking.guest?.email || 'N/A'}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Phone</span>
                                        <strong>{selectedBooking.guest?.phone || 'N/A'}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="action-buttons">
                                {selectedBooking.status === 'pending' && (
                                    <IonButton expand="block" onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}>
                                        Confirm Booking
                                    </IonButton>
                                )}
                                {selectedBooking.status === 'confirmed' && (
                                    <IonButton expand="block" onClick={() => handleStatusChange(selectedBooking.id, 'checked-in')}>
                                        Check In Guest
                                    </IonButton>
                                )}
                                {selectedBooking.status === 'checked-in' && (
                                    <IonButton expand="block" onClick={() => handleStatusChange(selectedBooking.id, 'completed')}>
                                        Check Out Guest
                                    </IonButton>
                                )}
                            </div>
                        </>
                    )}
                </IonContent>
            </IonModal>
        </IonContent>
    );
};

export default BookingManagement;
