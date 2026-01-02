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
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonRefresher,
    IonRefresherContent
} from '@ionic/react';
import {
    cashOutline,
    calendarOutline,
    bedOutline,
    trendingUpOutline,
    arrowUpOutline,
    arrowDownOutline
} from 'ionicons/icons';
import { dataService } from '../../services/MockDataService';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const [analytics, setAnalytics] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        occupancyRate: 0,
        pendingBookings: 0,
        todayCheckIns: 0
    });
    const [recentBookings, setRecentBookings] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const data = dataService.getAnalytics();
        setAnalytics(data);

        const bookings = dataService.getBookings().slice(0, 5).map(b => ({
            ...b,
            resort: dataService.getResort(b.resortId),
            room: dataService.getRoomType(b.roomTypeId)
        }));
        setRecentBookings(bookings);
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
        <IonContent className="admin-dashboard">
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent />
            </IonRefresher>

            <div className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back, Admin</p>
            </div>

            {/* Stats Grid */}
            <IonGrid>
                <IonRow>
                    <IonCol size="6" sizeLg="3">
                        <IonCard className="stat-card revenue">
                            <IonCardContent>
                                <div className="stat-icon">
                                    <IonIcon icon={cashOutline} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Total Revenue</span>
                                    <span className="stat-value">₱{analytics.totalRevenue.toLocaleString()}</span>
                                    <span className="stat-change positive">
                                        <IonIcon icon={arrowUpOutline} /> 12.5%
                                    </span>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                    <IonCol size="6" sizeLg="3">
                        <IonCard className="stat-card bookings">
                            <IonCardContent>
                                <div className="stat-icon">
                                    <IonIcon icon={calendarOutline} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Total Bookings</span>
                                    <span className="stat-value">{analytics.totalBookings}</span>
                                    <span className="stat-change positive">
                                        <IonIcon icon={arrowUpOutline} /> 8.2%
                                    </span>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                    <IonCol size="6" sizeLg="3">
                        <IonCard className="stat-card occupancy">
                            <IonCardContent>
                                <div className="stat-icon">
                                    <IonIcon icon={bedOutline} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Occupancy Rate</span>
                                    <span className="stat-value">{analytics.occupancyRate}%</span>
                                    <span className="stat-change negative">
                                        <IonIcon icon={arrowDownOutline} /> 2.1%
                                    </span>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                    <IonCol size="6" sizeLg="3">
                        <IonCard className="stat-card pending">
                            <IonCardContent>
                                <div className="stat-icon">
                                    <IonIcon icon={trendingUpOutline} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Pending</span>
                                    <span className="stat-value">{analytics.pendingBookings}</span>
                                    <span className="stat-sublabel">Require action</span>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
            </IonGrid>

            {/* Charts Placeholder */}
            <IonCard className="chart-card">
                <IonCardHeader>
                    <IonCardTitle>Revenue Overview</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <div className="chart-placeholder">
                        <div className="bar" style={{ height: '60%' }}><span>Jan</span></div>
                        <div className="bar" style={{ height: '80%' }}><span>Feb</span></div>
                        <div className="bar" style={{ height: '45%' }}><span>Mar</span></div>
                        <div className="bar" style={{ height: '90%' }}><span>Apr</span></div>
                        <div className="bar" style={{ height: '75%' }}><span>May</span></div>
                        <div className="bar" style={{ height: '100%' }}><span>Jun</span></div>
                    </div>
                </IonCardContent>
            </IonCard>

            {/* Recent Bookings */}
            <IonCard className="bookings-card">
                <IonCardHeader>
                    <IonCardTitle>Recent Bookings</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonList lines="none">
                        {recentBookings.map(booking => (
                            <IonItem key={booking.id} className="booking-item">
                                <IonLabel>
                                    <h3>{booking.resort?.name}</h3>
                                    <p>{booking.room?.name} · {booking.guests} guests</p>
                                </IonLabel>
                                <div slot="end" className="booking-end">
                                    <span className="booking-amount">₱{booking.totalPrice.toLocaleString()}</span>
                                    <IonBadge color={getStatusColor(booking.status)}>{booking.status}</IonBadge>
                                </div>
                            </IonItem>
                        ))}
                    </IonList>
                </IonCardContent>
            </IonCard>
        </IonContent>
    );
};

export default AdminDashboard;
