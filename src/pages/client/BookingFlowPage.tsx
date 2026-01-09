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
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
    IonModal,
    IonList,
    IonRadioGroup,
    IonRadio,
    IonCard,
    IonCardContent,
    IonText,
    IonProgressBar,
    IonFooter,
    IonNote
} from '@ionic/react';
import {
    calendarOutline,
    peopleOutline,
    cardOutline,
    checkmarkCircle,
    alertCircle
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { dataService } from '../../services/MockDataService';
import { useAuth } from '../../context/AuthContext';
import { Resort, RoomType } from '../../types';
import './BookingFlowPage.css';

type PaymentMethod = 'gcash' | 'card' | 'bank' | 'pay-later';

const BookingFlowPage: React.FC = () => {
    const { resortId, roomId } = useParams<{ resortId: string; roomId: string }>();
    const history = useHistory();
    const { user, isAuthenticated } = useAuth();

    const [step, setStep] = useState(1);
    const [resort, setResort] = useState<Resort | null>(null);
    const [room, setRoom] = useState<RoomType | null>(null);
    const [paymentConfigs, setPaymentConfigs] = useState<any[]>([]);

    useEffect(() => {
        setPaymentConfigs(dataService.getPaymentConfigs());
    }, []);

    // Booking details
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
    const [showDatePicker, setShowDatePicker] = useState<'checkIn' | 'checkOut' | null>(null);

    // Booking result
    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            history.replace('/auth/login');
            return;
        }

        const resortData = dataService.getResort(resortId);
        const roomData = dataService.getRoomType(roomId);

        if (resortData && roomData) {
            setResort(resortData);
            setRoom(roomData);

            // Default dates: tomorrow and day after
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dayAfter = new Date();
            dayAfter.setDate(dayAfter.getDate() + 2);

            setCheckIn(tomorrow.toISOString().split('T')[0]);
            setCheckOut(dayAfter.toISOString().split('T')[0]);
        }
    }, [resortId, roomId, isAuthenticated, history]);

    if (!resort || !room) {
        return (
            <IonPage>
                <IonContent className="ion-padding">
                    <p>Loading...</p>
                </IonContent>
            </IonPage>
        );
    }

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = end.getTime() - start.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const nights = calculateNights();
    const basePrice = room.pricePerNight * nights;
    const extraGuestFee = guests > room.capacity ? (guests - room.capacity) * 500 * nights : 0;
    const serviceFee = Math.round(basePrice * 0.1);
    const totalPrice = basePrice + extraGuestFee + serviceFee;

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleConfirmBooking = async () => {
        setIsProcessing(true);
        setBookingError('');

        try {
            // Check availability
            const isAvailable = dataService.checkAvailability(roomId, checkIn, checkOut);
            if (!isAvailable) {
                setBookingError('Sorry, this room is no longer available for the selected dates.');
                setIsProcessing(false);
                return;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Create booking
            dataService.createBooking({
                resortId,
                roomTypeId: roomId,
                userId: user!.id,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                guests,
                totalPrice,
                status: paymentMethod === 'pay-later' ? 'pending' : 'confirmed',
                paymentStatus: paymentMethod === 'pay-later' ? 'pending' : 'paid'
            });

            setBookingComplete(true);
        } catch (error) {
            setBookingError('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (bookingComplete) {
        return (
            <IonPage>
                <IonContent className="booking-success">
                    <div className="success-content">
                        <div className="success-icon">
                            <IonIcon icon={checkmarkCircle} />
                        </div>
                        <h1>Booking Confirmed!</h1>
                        <p>Your reservation at {resort.name} has been confirmed.</p>

                        <IonCard className="booking-summary-card">
                            <IonCardContent>
                                <div className="summary-row">
                                    <span>Check-in</span>
                                    <strong>{new Date(checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                                </div>
                                <div className="summary-row">
                                    <span>Check-out</span>
                                    <strong>{new Date(checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                                </div>
                                <div className="summary-row">
                                    <span>Room</span>
                                    <strong>{room.name}</strong>
                                </div>
                                <div className="summary-row total">
                                    <span>Total Paid</span>
                                    <strong>₱{totalPrice.toLocaleString()}</strong>
                                </div>
                            </IonCardContent>
                        </IonCard>

                        <IonButton expand="block" onClick={() => history.push('/client/bookings')}>
                            View My Bookings
                        </IonButton>
                        <IonButton expand="block" fill="outline" onClick={() => history.push('/client/home')}>
                            Back to Home
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
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={`/client/resort/${resortId}`} />
                    </IonButtons>
                    <IonTitle>Book {room.name}</IonTitle>
                </IonToolbar>
                <IonProgressBar value={step / 3} color="primary" />
            </IonHeader>

            <IonContent className="booking-content">
                {/* Step 1: Dates & Guests */}
                {step === 1 && (
                    <div className="step-content">
                        <h2>Select Dates & Guests</h2>

                        <IonCard>
                            <IonCardContent>
                                <IonItem button onClick={() => setShowDatePicker('checkIn')}>
                                    <IonIcon icon={calendarOutline} slot="start" />
                                    <IonLabel>
                                        <h3>Check-in</h3>
                                        <p>{checkIn ? new Date(checkIn).toLocaleDateString() : 'Select date'}</p>
                                    </IonLabel>
                                </IonItem>

                                <IonItem button onClick={() => setShowDatePicker('checkOut')}>
                                    <IonIcon icon={calendarOutline} slot="start" />
                                    <IonLabel>
                                        <h3>Check-out</h3>
                                        <p>{checkOut ? new Date(checkOut).toLocaleDateString() : 'Select date'}</p>
                                    </IonLabel>
                                </IonItem>

                                <IonItem>
                                    <IonIcon icon={peopleOutline} slot="start" />
                                    <IonLabel>
                                        <h3>Guests</h3>
                                    </IonLabel>
                                    <div className="guest-counter">
                                        <IonButton fill="outline" size="small" onClick={() => setGuests(Math.max(1, guests - 1))}>-</IonButton>
                                        <span>{guests}</span>
                                        <IonButton fill="outline" size="small" onClick={() => setGuests(guests + 1)}>+</IonButton>
                                    </div>
                                </IonItem>

                                {guests > room.capacity && (
                                    <IonNote color="warning" className="capacity-warning">
                                        <IonIcon icon={alertCircle} /> Room capacity is {room.capacity}. Extra guest fees will apply.
                                    </IonNote>
                                )}
                            </IonCardContent>
                        </IonCard>

                        {nights > 0 && (
                            <div className="nights-info">
                                <span>{nights} night{nights > 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                    <div className="step-content">
                        <h2>Payment Method</h2>

                        <IonCard>
                            <IonCardContent>
                                <IonRadioGroup value={paymentMethod} onIonChange={e => setPaymentMethod(e.detail.value)}>
                                    {paymentConfigs.filter(c => c.isEnabled).map(config => (
                                        <div key={config.id}>
                                            <IonItem lines="none" className="payment-radio-item">
                                                <IonLabel>
                                                    <h3>{config.name}</h3>
                                                    <p>{config.description}</p>
                                                </IonLabel>
                                                <IonRadio slot="start" value={config.id} />
                                            </IonItem>

                                            {paymentMethod === config.id && (
                                                <div className="payment-instructions fade-in">
                                                    <div className="instruction-box">
                                                        <p className="instruction-text">{config.instructions}</p>
                                                        <div className="account-details">
                                                            <p><strong>Account Name:</strong> {config.accountName}</p>
                                                            <p><strong>Account Number:</strong> {config.accountNumber}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <IonItem lines="none" className="payment-radio-item">
                                        <IonLabel>
                                            <h3>Pay at Resort</h3>
                                            <p>Reserve now, pay upon arrival</p>
                                        </IonLabel>
                                        <IonRadio slot="start" value="pay-later" />
                                    </IonItem>
                                </IonRadioGroup>
                            </IonCardContent>
                        </IonCard>
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                    <div className="step-content">
                        <h2>Review Your Booking</h2>

                        <IonCard className="review-card">
                            <img src={room.images[0]} alt={room.name} />
                            <IonCardContent>
                                <h3>{resort.name}</h3>
                                <p className="room-name">{room.name}</p>

                                <div className="booking-details">
                                    <div className="detail-row">
                                        <span>Check-in</span>
                                        <strong>{new Date(checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Check-out</span>
                                        <strong>{new Date(checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Guests</span>
                                        <strong>{guests}</strong>
                                    </div>
                                </div>
                            </IonCardContent>
                        </IonCard>

                        <IonCard className="price-breakdown">
                            <IonCardContent>
                                <h4>Price Breakdown</h4>
                                <div className="price-row">
                                    <span>₱{room.pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                                    <span>₱{basePrice.toLocaleString()}</span>
                                </div>
                                {extraGuestFee > 0 && (
                                    <div className="price-row">
                                        <span>Extra guest fee</span>
                                        <span>₱{extraGuestFee.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="price-row">
                                    <span>Service fee</span>
                                    <span>₱{serviceFee.toLocaleString()}</span>
                                </div>
                                <div className="price-row total">
                                    <span>Total</span>
                                    <span>₱{totalPrice.toLocaleString()}</span>
                                </div>
                            </IonCardContent>
                        </IonCard>

                        {bookingError && (
                            <div className="error-message">
                                <IonIcon icon={alertCircle} />
                                <span>{bookingError}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Date Picker Modal */}
                <IonModal isOpen={showDatePicker !== null} onDidDismiss={() => setShowDatePicker(null)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{showDatePicker === 'checkIn' ? 'Check-in Date' : 'Check-out Date'}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowDatePicker(null)}>Done</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonDatetime
                            presentation="date"
                            min={new Date().toISOString()}
                            value={showDatePicker === 'checkIn' ? checkIn : checkOut}
                            onIonChange={e => {
                                const val = e.detail.value as string;
                                if (showDatePicker === 'checkIn') {
                                    setCheckIn(val.split('T')[0]);
                                    if (checkOut && val >= checkOut) {
                                        const next = new Date(val);
                                        next.setDate(next.getDate() + 1);
                                        setCheckOut(next.toISOString().split('T')[0]);
                                    }
                                } else {
                                    setCheckOut(val.split('T')[0]);
                                }
                            }}
                        />
                    </IonContent>
                </IonModal>
            </IonContent>

            <IonFooter className="booking-footer">
                <div className="footer-content">
                    <div className="footer-price">
                        <span className="total-label">Total</span>
                        <span className="total-amount">₱{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="footer-buttons">
                        {step > 1 && (
                            <IonButton fill="outline" onClick={handleBack}>Back</IonButton>
                        )}
                        {step < 3 ? (
                            <IonButton onClick={handleNext} disabled={!checkIn || !checkOut || nights === 0}>
                                Continue
                            </IonButton>
                        ) : (
                            <IonButton onClick={handleConfirmBooking} disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : 'Confirm Booking'}
                            </IonButton>
                        )}
                    </div>
                </div>
            </IonFooter>
        </IonPage>
    );
};

export default BookingFlowPage;
