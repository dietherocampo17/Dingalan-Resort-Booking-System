import React, { useState, useMemo } from 'react';
import {
    IonContent,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonSearchbar,
    IonProgressBar,
    IonChip,
    IonLabel
} from '@ionic/react';
import {
    bedOutline,
    cashOutline,
    warningOutline,
    peopleOutline,
    homeOutline,
    alertCircleOutline,
    checkmarkCircleOutline
} from 'ionicons/icons';
import { dataService } from '../../services/MockDataService';
import './AvailabilityManagement.css';

const AvailabilityManagement: React.FC = () => {
    const [resorts] = useState(dataService.getResorts());
    const [rooms] = useState(dataService.getRoomTypes());
    const [searchText, setSearchText] = useState('');

    // Calculate Dashboard Stats
    const stats = useMemo(() => {
        const totalRooms = rooms.length;
        const totalCapacity = rooms.reduce((acc, room) => acc + (room.capacity * room.quantity), 0);
        const lowStock = rooms.filter(r => r.quantity < 3).length;
        return { totalRooms, totalCapacity, lowStock };
    }, [rooms]);

    // Filter Logic
    const filteredResorts = useMemo(() => {
        if (!searchText) return resorts;
        const lowerText = searchText.toLowerCase();

        return resorts.filter(resort => {
            // Check if resort name matches
            if (resort.name.toLowerCase().includes(lowerText)) return true;

            // Check if any of its rooms match
            const resortRooms = rooms.filter(r => r.resortId === resort.id);
            return resortRooms.some(r => r.name.toLowerCase().includes(lowerText));
        });
    }, [resorts, rooms, searchText]);

    return (
        <IonContent className="availability-management">
            <div className="page-header">
                <div>
                    <h1>Availability Overview</h1>
                    <p>Real-time room occupancy and status</p>
                </div>
                <div className="header-search">
                    <IonSearchbar
                        value={searchText}
                        onIonInput={e => setSearchText(e.detail.value!)}
                        placeholder="Search..."
                        className="custom-search"
                    />
                </div>
            </div>

            {/* Dashboard Summary Cards */}
            <IonGrid className="stats-grid">
                <IonRow>
                    <IonCol size="12" sizeMd="4">
                        <div className="avail-stat-card primary">
                            <div className="stat-icon">
                                <IonIcon icon={homeOutline} />
                            </div>
                            <div className="stat-details">
                                <h3>Total Rooms</h3>
                                <h2>{stats.totalRooms}</h2>
                                <span>Across all resorts</span>
                            </div>
                        </div>
                    </IonCol>
                    <IonCol size="12" sizeMd="4">
                        <div className="avail-stat-card secondary">
                            <div className="stat-icon">
                                <IonIcon icon={peopleOutline} />
                            </div>
                            <div className="stat-details">
                                <h3>Total Capacity</h3>
                                <h2>{stats.totalCapacity}</h2>
                                <span>Max guests capacity</span>
                            </div>
                        </div>
                    </IonCol>
                    <IonCol size="12" sizeMd="4">
                        <div className={`avail-stat-card ${stats.lowStock > 0 ? 'danger' : 'success'}`}>
                            <div className="stat-icon">
                                <IonIcon icon={warningOutline} />
                            </div>
                            <div className="stat-details">
                                <h3>Critical Stock</h3>
                                <h2>{stats.lowStock}</h2>
                                <span>Rooms with &lt; 3 left</span>
                            </div>
                        </div>
                    </IonCol>
                </IonRow>
            </IonGrid>

            <div className="resorts-container">
                {filteredResorts.map(resort => {
                    const isResortMatch = resort.name.toLowerCase().includes(searchText.toLowerCase());
                    const resortRooms = rooms.filter(r =>
                        r.resortId === resort.id &&
                        (isResortMatch || !searchText || r.name.toLowerCase().includes(searchText.toLowerCase()))
                    );

                    if (resortRooms.length === 0) return null;

                    return (
                        <div key={resort.id} className="resort-section">
                            <div className="resort-header">
                                <h2>{resort.name}</h2>
                                <span className="room-count-badge">{resortRooms.length} Room Types</span>
                            </div>

                            <div className="room-grid">
                                {resortRooms.map(room => {
                                    // Mock total quantity for progress bar visualization (since we only have 'quantity' which is 'available')
                                    // Assuming total was quantity + 2 for demo purposes if quantity is low, or just using current quantity as max if high.
                                    // Converting 'quantity' field to be 'Available'. Let's assume a static Total for the visual.
                                    // For this demo, let's assume specific logic:
                                    // If available > 5, total is available + 2. If available <= 5, total is available + 5.
                                    const total = room.quantity > 5 ? room.quantity + 3 : room.quantity + 5;
                                    const progress = room.quantity / total;
                                    const isLow = room.quantity < 3;
                                    const isOut = room.quantity === 0;

                                    return (
                                        <div key={room.id} className={`room-card-modern ${isOut ? 'out-of-stock' : ''}`}>
                                            <div className="room-card-top">
                                                <div className="room-identity">
                                                    <h3>{room.name}</h3>
                                                    <div className="room-meta">
                                                        <IonChip outline color="medium" className="mini-chip">
                                                            <IonIcon icon={bedOutline} />
                                                            <IonLabel>{room.capacity} Pax</IonLabel>
                                                        </IonChip>
                                                        <IonChip outline color="primary" className="mini-chip">
                                                            <IonIcon icon={cashOutline} />
                                                            <IonLabel>₱{room.pricePerNight.toLocaleString()}</IonLabel>
                                                        </IonChip>
                                                    </div>
                                                </div>
                                                <div className={`status-indicator ${isOut ? 'red' : isLow ? 'orange' : 'green'}`}>
                                                    <IonIcon icon={isOut ? alertCircleOutline : checkmarkCircleOutline} />
                                                    <span>{isOut ? 'SOLD OUT' : isLow ? 'LOW STOCK' : 'AVAILABLE'}</span>
                                                </div>
                                            </div>

                                            <div className="room-availability-section">
                                                <div className="availability-labels">
                                                    <span className="label">Availability</span>
                                                    <span className="value">
                                                        <strong>{room.quantity}</strong> / {total} left
                                                    </span>
                                                </div>
                                                <IonProgressBar
                                                    value={progress}
                                                    color={isOut ? 'danger' : isLow ? 'warning' : 'success'}
                                                    className="custom-progress"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </IonContent>
    );
};

export default AvailabilityManagement;
