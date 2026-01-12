import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonNote,
    IonIcon,
    useIonToast,
    IonFooter
} from '@ionic/react';
import { calendarOutline, personOutline, cashOutline, bedOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { dataService } from '../../services/MockDataService';
import { useAuth } from '../../context/AuthContext';
import { Resort, RoomType } from '../../types';
import './WalkInPage.css';

const WalkInPage: React.FC = () => {
    const history = useHistory();
    const { user } = useAuth();
    const [present] = useIonToast();

    // Form State
    const [guestName, setGuestName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedResortId, setSelectedResortId] = useState('');
    const [checkInDate, setCheckInDate] = useState(new Date().toISOString());
    const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 86400000).toISOString()); // Tomorrow
    const [guests, setGuests] = useState(2);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    // Data State
    const [resorts, setResorts] = useState<Resort[]>([]);
    const [availableRooms, setAvailableRooms] = useState<RoomType[]>([]);

    useEffect(() => {
        setResorts(dataService.getResorts());
    }, []);

    // Update available rooms when criteria change
    useEffect(() => {
        if (selectedResortId) {
            const rooms = dataService.getRoomTypes(selectedResortId);
            const available = rooms.filter(room => {
                const isAvailable = dataService.checkAvailability(
                    room.id,
                    checkInDate.split('T')[0],
                    checkOutDate.split('T')[0]
                );
                return isAvailable && room.capacity >= guests;
            });
            setAvailableRooms(available);
        } else {
            setAvailableRooms([]);
        }
    }, [selectedResortId, checkInDate, checkOutDate, guests]);

    const getDaysStay = () => {
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const diff = end.getTime() - start.getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    };

    const calculateTotal = () => {
        if (!selectedRoomId) return 0;
        const room = availableRooms.find(r => r.id === selectedRoomId);
        if (!room) return 0;
        return room.pricePerNight * getDaysStay();
    };

    const handleProcessWalkIn = () => {
        if (!guestName || !selectedRoomId || !selectedResortId) {
            present({
                message: 'Please fill in all required fields',
                duration: 2000,
                color: 'warning'
            });
            return;
        }

        try {
            // 1. Create Guest User
            const walkInUserId = `guest-${Date.now()}`;
            const newGuestUser = {
                id: walkInUserId,
                name: guestName,
                email: email || `guest-${Date.now()}@walkin.com`, // Fallback email
                phone: phone,
                role: 'guest' as const,
                status: 'active' as const,
                createdAt: new Date().toISOString()
            };

            // Save user to mock data
            dataService.saveUser(newGuestUser);

            // 2. Create Booking
            const newBooking = dataService.createBooking({
                resortId: selectedResortId,
                roomTypeId: selectedRoomId,
                userId: walkInUserId,
                checkInDate: checkInDate.split('T')[0],
                checkOutDate: checkOutDate.split('T')[0],
                guests: guests,
                totalPrice: calculateTotal(),
                status: 'checked-in', // Immediate check-in
                paymentStatus: 'paid', // Walk-ins usually pay upfront
                notes: `Walk-in Guest. Name: ${guestName}, Phone: ${phone}, Email: ${email}`,
                confirmedBy: user?.id,
                checkedInBy: user?.id
            });

            present({
                message: 'Walk-in processed successfully! Booking ID: ' + newBooking.id,
                duration: 3000,
                color: 'success'
            });

            history.replace('/employee/dashboard');

        } catch (error) {
            console.error(error);
            present({
                message: 'Failed to process walk-in',
                duration: 2000,
                color: 'danger'
            });
        }
    };

    return (
        <IonPage className="walkin-page">
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/employee/dashboard" />
                    </IonButtons>
                    <IonTitle>Process Walk-in</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <IonGrid>
                        <IonRow>
                            <IonCol sizeMd="6" size="12">
                                {/* Guest Details */}
                                <IonCard>
                                    <IonCardHeader>
                                        <IonCardTitle>Guest Information</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonItem>
                                            <IonIcon icon={personOutline} slot="start" />
                                            <IonLabel position="stacked">Guest Name *</IonLabel>
                                            <IonInput
                                                value={guestName}
                                                onIonChange={e => setGuestName(e.detail.value!)}
                                                placeholder="Enter full name"
                                            />
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="stacked">Contact Number</IonLabel>
                                            <IonInput
                                                value={phone}
                                                onIonChange={e => setPhone(e.detail.value!)}
                                                placeholder="+63 900 000 0000"
                                            />
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="stacked">Email Address</IonLabel>
                                            <IonInput
                                                value={email}
                                                onIonChange={e => setEmail(e.detail.value!)}
                                                placeholder="guest@example.com"
                                            />
                                        </IonItem>
                                    </IonCardContent>
                                </IonCard>

                                {/* Stay Details */}
                                <IonCard>
                                    <IonCardHeader>
                                        <IonCardTitle>Stay Details</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonItem>
                                            <IonLabel position="stacked">Resort *</IonLabel>
                                            <IonSelect
                                                value={selectedResortId}
                                                onIonChange={e => setSelectedResortId(e.detail.value)}
                                                placeholder="Select Resort"
                                            >
                                                {resorts.map(resort => (
                                                    <IonSelectOption key={resort.id} value={resort.id}>
                                                        {resort.name}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        </IonItem>

                                        <IonRow>
                                            <IonCol size="6">
                                                <IonItem>
                                                    <IonLabel position="stacked">Check-in</IonLabel>
                                                    <IonInput
                                                        type="date"
                                                        value={checkInDate.split('T')[0]}
                                                        onIonChange={e => setCheckInDate(e.detail.value!)}
                                                    />
                                                </IonItem>
                                            </IonCol>
                                            <IonCol size="6">
                                                <IonItem>
                                                    <IonLabel position="stacked">Check-out</IonLabel>
                                                    <IonInput
                                                        type="date"
                                                        value={checkOutDate.split('T')[0]}
                                                        onIonChange={e => setCheckOutDate(e.detail.value!)}
                                                        min={checkInDate}
                                                    />
                                                </IonItem>
                                            </IonCol>
                                        </IonRow>

                                        <IonItem>
                                            <IonLabel position="stacked">Guests</IonLabel>
                                            <IonInput
                                                type="number"
                                                value={guests}
                                                onIonChange={e => setGuests(parseInt(e.detail.value!, 10))}
                                                min="1"
                                            />
                                        </IonItem>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            <IonCol sizeMd="6" size="12">
                                {/* Room Selection */}
                                <IonCard>
                                    <IonCardHeader>
                                        <IonCardTitle>Select Room</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        {!selectedResortId ? (
                                            <IonNote>Please select a resort first.</IonNote>
                                        ) : availableRooms.length === 0 ? (
                                            <IonNote color="warning">No rooms available for these dates/capacity.</IonNote>
                                        ) : (
                                            availableRooms.map(room => (
                                                <div
                                                    key={room.id}
                                                    className={`room-selection-item ${selectedRoomId === room.id ? 'selected-room' : ''}`}
                                                    onClick={() => setSelectedRoomId(room.id)}
                                                >
                                                    <IonItem lines="none" style={{ '--background': 'transparent' }}>
                                                        <IonLabel>
                                                            <h2>{room.name}</h2>
                                                            <p>Capacity: {room.capacity} pax</p>
                                                        </IonLabel>
                                                        <div slot="end" className="room-price">
                                                            ₱{room.pricePerNight.toLocaleString()}
                                                        </div>
                                                    </IonItem>
                                                </div>
                                            ))
                                        )}
                                    </IonCardContent>
                                </IonCard>

                                {/* Payment Summary */}
                                <IonCard>
                                    <IonCardContent>
                                        <div className="total-row">
                                            <span className="total-label">Nights</span>
                                            <span className="total-value">{getDaysStay()}</span>
                                        </div>
                                        <div className="total-row">
                                            <span className="total-label">Total Amount</span>
                                            <span className="total-amount">₱{calculateTotal().toLocaleString()}</span>
                                        </div>

                                        <IonButton
                                            expand="block"
                                            size="large"
                                            color="primary"
                                            onClick={handleProcessWalkIn}
                                            disabled={!selectedRoomId || !guestName}
                                        >
                                            <IonIcon icon={checkInDate === new Date().toISOString().split('T')[0] ? bedOutline : calendarOutline} slot="start" />
                                            {checkInDate === new Date().toISOString().split('T')[0] ? 'Check-In Now' : 'Process Booking'}
                                        </IonButton>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default WalkInPage;
