import React, { useState } from 'react';
import { IonContent, IonList, IonItem, IonLabel, IonBadge, IonSearchbar, IonSegment, IonSegmentButton, IonAvatar, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/react';
import { dataService } from '../../services/MockDataService';
import './AllBookings.css';

const AllBookings: React.FC = () => {
    const [filter, setFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    const bookings = dataService.getBookings().map(b => ({
        ...b,
        resort: dataService.getResort(b.resortId),
        room: dataService.getRoomType(b.roomTypeId),
        guest: dataService.getUser(b.userId)
    }));

    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = { pending: 'warning', confirmed: 'primary', 'checked-in': 'success', completed: 'medium', cancelled: 'danger' };
        return colors[status] || 'medium';
    };

    return (
        <IonContent className="all-bookings">
            <div className="page-header">
                <h1>All Bookings</h1>
                <p>{bookings.length} total bookings</p>
            </div>

            <IonSearchbar placeholder="Search bookings..." />

            <IonSegment value={filter} onIonChange={e => setFilter(e.detail.value as string)} scrollable className="status-segment">
                <IonSegmentButton value="all"><IonLabel>All</IonLabel></IonSegmentButton>
                <IonSegmentButton value="pending"><IonLabel>Pending</IonLabel></IonSegmentButton>
                <IonSegmentButton value="confirmed"><IonLabel>Confirmed</IonLabel></IonSegmentButton>
                <IonSegmentButton value="completed"><IonLabel>Completed</IonLabel></IonSegmentButton>
            </IonSegment>

            <IonList lines="none" className="booking-list">
                {filtered.map(booking => (
                    <IonItem
                        key={booking.id}
                        className="all-bookings-item"
                        button
                        detail
                        onClick={() => setSelectedBooking(booking)}
                    >
                        <IonAvatar slot="start">
                            <img src={booking.resort?.images[0]} alt="Resort" />
                        </IonAvatar>
                        <IonLabel>
                            <h3>{booking.resort?.name}</h3>
                            <p>{booking.room?.name} · {booking.guests} guests</p>
                            <p className="dates">{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                        </IonLabel>
                        <div slot="end" className="booking-end">
                            <span className="amount">₱{booking.totalPrice.toLocaleString()}</span>
                            <IonBadge color={getStatusColor(booking.status)}>{booking.status}</IonBadge>
                        </div>
                    </IonItem>
                ))}
            </IonList>

            {/* Booking Details Modal */}
            <IonModal isOpen={!!selectedBooking} onDidDismiss={() => setSelectedBooking(null)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Booking Details</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setSelectedBooking(null)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    {selectedBooking && (
                        <>
                            <div className="detail-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <img
                                    src={selectedBooking.resort?.images[0]}
                                    alt="Resort"
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
                                />
                                <h2 style={{ marginTop: '16px', marginBottom: '4px' }}>{selectedBooking.resort?.name}</h2>
                                <IonBadge color={getStatusColor(selectedBooking.status)}>{selectedBooking.status}</IonBadge>
                            </div>

                            <IonList>
                                <IonItem lines="full">
                                    <IonLabel>
                                        <p>Guest</p>
                                        <h3>{selectedBooking.guest?.name || 'Unknown'}</h3>
                                    </IonLabel>
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel>
                                        <p>Room Type</p>
                                        <h3>{selectedBooking.room?.name}</h3>
                                    </IonLabel>
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel>
                                        <p>Check-in</p>
                                        <h3>{new Date(selectedBooking.checkInDate).toLocaleDateString()}</h3>
                                    </IonLabel>
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel>
                                        <p>Check-out</p>
                                        <h3>{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</h3>
                                    </IonLabel>
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel>
                                        <p>Total Price</p>
                                        <h3>₱{selectedBooking.totalPrice.toLocaleString()}</h3>
                                    </IonLabel>
                                </IonItem>

                                {selectedBooking.confirmedBy && (
                                    <IonItem lines="full">
                                        <IonLabel>
                                            <p>Confirmed By</p>
                                            <h3>{selectedBooking.confirmedBy}</h3>
                                        </IonLabel>
                                    </IonItem>
                                )}
                                {selectedBooking.checkedInBy && (
                                    <IonItem lines="full">
                                        <IonLabel>
                                            <p>Checked In By</p>
                                            <h3>{selectedBooking.checkedInBy}</h3>
                                        </IonLabel>
                                    </IonItem>
                                )}
                                {selectedBooking.checkedOutBy && (
                                    <IonItem lines="full">
                                        <IonLabel>
                                            <p>Checked Out By</p>
                                            <h3>{selectedBooking.checkedOutBy}</h3>
                                        </IonLabel>
                                    </IonItem>
                                )}
                            </IonList>
                        </>
                    )}
                </IonContent>
            </IonModal >
        </IonContent >
    );
};

export default AllBookings;
