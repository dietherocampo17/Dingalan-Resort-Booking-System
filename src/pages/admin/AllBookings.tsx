import React, { useState } from 'react';
import { IonContent, IonList, IonItem, IonLabel, IonBadge, IonSearchbar, IonSegment, IonSegmentButton } from '@ionic/react';
import { dataService } from '../../services/MockDataService';
import './AllBookings.css';

const AllBookings: React.FC = () => {
    const [filter, setFilter] = useState('all');
    const bookings = dataService.getBookings().map(b => ({
        ...b,
        resort: dataService.getResort(b.resortId),
        room: dataService.getRoomType(b.roomTypeId)
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
                    <IonItem key={booking.id} className="booking-item" button detail>
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
        </IonContent>
    );
};

export default AllBookings;
