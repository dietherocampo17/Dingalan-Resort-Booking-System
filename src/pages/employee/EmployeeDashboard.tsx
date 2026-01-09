import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonBadge,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonChip,
    IonRefresher,
    IonRefresherContent
} from '@ionic/react';
import {
    calendarOutline,
    cashOutline,
    trendingUpOutline,
    peopleOutline,
    logInOutline,
    logOutOutline,
    alertCircleOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { dataService } from '../../services/MockDataService';
import './EmployeeDashboard.css';

const EmployeeDashboard: React.FC = () => {
    const history = useHistory();
    const [stats, setStats] = useState({
        todayCheckIns: 0,
        todayCheckOuts: 0,
        pendingBookings: 0,
        totalBookings: 0
    });
    const [recentBookings, setRecentBookings] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const analytics = dataService.getAnalytics();
        const bookings = dataService.getBookings();
        const today = new Date().toISOString().split('T')[0];

        setStats({
            todayCheckIns: bookings.filter(b => b.checkInDate === today && b.status === 'confirmed').length,
            todayCheckOuts: bookings.filter(b => b.checkOutDate === today && b.status === 'checked-in').length,
            pendingBookings: analytics.pendingBookings,
            totalBookings: analytics.totalBookings
        });

        // Get recent bookings with resort info
        const recent = bookings.slice(0, 5).map(b => ({
            ...b,
            resort: dataService.getResort(b.resortId),
            room: dataService.getRoomType(b.roomTypeId)
        }));
        setRecentBookings(recent);
    };

    const handleRefresh = (event: CustomEvent) => {
        loadData();
        setTimeout(() => event.detail.complete(), 500);
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

    return (
        <IonContent className="employee-dashboard">
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent />
            </IonRefresher>

            <div className="dashboard-header">
                <h1>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!</h1>
                <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Quick Stats */}
            <IonGrid>
                <IonRow>
                    <IonCol size="6">
                        <IonCard className="stat-card check-in" onClick={() => history.push('/employee/bookings')} style={{ cursor: 'pointer' }}>
                            <IonCardContent>
                                <IonIcon icon={logInOutline} />
                                <div className="stat-info">
                                    <span className="stat-value">{stats.todayCheckIns}</span>
                                    <span className="stat-label">Check-ins Today</span>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                    <IonCol size="6">
                        <IonCard className="stat-card check-out" onClick={() => history.push('/employee/bookings')} style={{ cursor: 'pointer' }}>
                            <IonCardContent>
                                <IonIcon icon={logOutOutline} />
                                <div className="stat-info">
                                    <span className="stat-value">{stats.todayCheckOuts}</span>
                                    <span className="stat-label">Check-outs Today</span>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                    <IonCol size="6">
                        <IonCard className="stat-card pending" onClick={() => history.push('/employee/bookings')} style={{ cursor: 'pointer' }}>
                            <IonCardContent>
                                <IonIcon icon={alertCircleOutline} />
                                <div className="stat-info">
                                    <span className="stat-value">{stats.pendingBookings}</span>
                                    <span className="stat-label">Pending</span>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                    <IonCol size="6">
                        <IonCard className="stat-card total" onClick={() => history.push('/employee/bookings')} style={{ cursor: 'pointer' }}>
                            <IonCardContent>
                                <IonIcon icon={calendarOutline} />
                                <div className="stat-info">
                                    <span className="stat-value">{stats.totalBookings}</span>
                                    <span className="stat-label">Total Bookings</span>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
            </IonGrid>

            {/* Recent Bookings */}
            <div className="section">
                <h2>Recent Bookings</h2>
                <IonList lines="none" className="booking-list">
                    {recentBookings.map(booking => (
                        <IonItem
                            key={booking.id}
                            className="booking-item"
                            button
                            detail
                            onClick={() => history.push('/employee/bookings', { bookingId: booking.id })}
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
                                </p>
                            </IonLabel>
                            <IonBadge color={getStatusColor(booking.status)} slot="end">
                                {booking.status}
                            </IonBadge>
                        </IonItem>
                    ))}
                </IonList>
            </div>

            {/* Quick Actions */}
            <div className="section">
                <h2>Quick Actions</h2>
                <IonGrid>
                    <IonRow>
                        <IonCol size="4">
                            <div className="quick-action" onClick={() => history.push('/employee/bookings')}>
                                <IonIcon icon={logInOutline} />
                                <span>Check In</span>
                            </div>
                        </IonCol>
                        <IonCol size="4">
                            <div className="quick-action" onClick={() => history.push('/employee/bookings')}>
                                <IonIcon icon={logOutOutline} />
                                <span>Check Out</span>
                            </div>
                        </IonCol>
                        <IonCol size="4">
                            <div className="quick-action" onClick={() => history.push('/employee/availability')}>
                                <IonIcon icon={peopleOutline} />
                                <span>Walk-in</span>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </div>
        </IonContent>
    );
};

export default EmployeeDashboard;
