import React, { useState, useMemo } from 'react';
import {
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonBadge,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonInput,
    IonItemDivider,
    useIonToast,
    IonGrid,
    IonRow,
    IonCol,
    IonSearchbar
} from '@ionic/react';
import { bedOutline, cashOutline, close, statsChart, warningOutline, searchOutline, peopleOutline, homeOutline } from 'ionicons/icons';
import { dataService } from '../../services/MockDataService';
import { RoomType } from '../../types';
import './AvailabilityManagement.css';

const AvailabilityManagement: React.FC = () => {
    const [resorts] = useState(dataService.getResorts());
    const [rooms, setRooms] = useState(dataService.getRoomTypes());
    const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ price: 0, quantity: 0 });
    const [searchText, setSearchText] = useState('');
    const [present] = useIonToast();

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

    const handleEdit = (room: RoomType) => {
        setSelectedRoom(room);
        setEditForm({
            price: room.pricePerNight,
            quantity: room.quantity
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (selectedRoom) {
            const updatedRoom = {
                ...selectedRoom,
                pricePerNight: Number(editForm.price),
                quantity: Number(editForm.quantity)
            };

            dataService.saveRoomType(updatedRoom);

            // Update local state
            setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));

            setIsModalOpen(false);
            present({
                message: 'Room details updated successfully',
                duration: 2000,
                color: 'success'
            });
        }
    };

    return (
        <IonContent className="availability-management">
            <div className="page-header">
                <h1>Availability Management</h1>
                <p>Manage room availability and pricing</p>
            </div>

            {/* Dashboard Summary */}
            <IonGrid className="dashboard-grid">
                <IonRow>
                    <IonCol size="12" sizeMd="4">
                        <IonCard className="stat-card" color="primary">
                            <IonCardContent>
                                <div className="stat-icon-wrapper">
                                    <IonIcon icon={homeOutline} />
                                </div>
                                <div className="stat-info">
                                    <h3>Total Rooms</h3>
                                    <div className="stat-value">{stats.totalRooms}</div>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                    <IonCol size="12" sizeMd="4">
                        <IonCard className="stat-card" color="secondary">
                            <IonCardContent>
                                <div className="stat-icon-wrapper">
                                    <IonIcon icon={peopleOutline} />
                                </div>
                                <div className="stat-info">
                                    <h3>Total Capacity</h3>
                                    <div className="stat-value">{stats.totalCapacity}</div>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                    <IonCol size="12" sizeMd="4">
                        <IonCard className="stat-card" color={stats.lowStock > 0 ? "danger" : "success"}>
                            <IonCardContent>
                                <div className="stat-icon-wrapper">
                                    <IonIcon icon={warningOutline} />
                                </div>
                                <div className="stat-info">
                                    <h3>Low Stock Alert</h3>
                                    <div className="stat-value">{stats.lowStock}</div>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
            </IonGrid>

            {/* Search Bar */}
            <div className="search-container">
                <IonSearchbar
                    value={searchText}
                    onIonInput={e => setSearchText(e.detail.value!)}
                    placeholder="Search resorts or rooms..."
                    className="custom-search"
                />
            </div>

            <div className="resorts-container">
                {filteredResorts.map(resort => {
                    // If searching, only show matching rooms for this resort (or all if resort name matches)
                    const isResortMatch = resort.name.toLowerCase().includes(searchText.toLowerCase());
                    const resortRooms = rooms.filter(r =>
                        r.resortId === resort.id &&
                        (isResortMatch || !searchText || r.name.toLowerCase().includes(searchText.toLowerCase()))
                    );

                    if (resortRooms.length === 0) return null;

                    return (
                        <IonCard key={resort.id} className="resort-card">
                            <IonCardHeader>
                                <IonCardTitle>{resort.name}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="room-grid">
                                    {resortRooms.map(room => (
                                        <div key={room.id} className="room-card">
                                            <div className="room-header">
                                                <h3>{room.name}</h3>
                                            </div>

                                            <div className="room-details">
                                                <div className="info-badge capacity">
                                                    <IonIcon icon={bedOutline} />
                                                    <span>Cap: {room.capacity}</span>
                                                </div>
                                                <div className="info-badge price">
                                                    <IonIcon icon={cashOutline} />
                                                    <span>₱{room.pricePerNight.toLocaleString()} <small style={{ fontWeight: 400, color: '#64748b' }}>/night</small></span>
                                                </div>
                                            </div>

                                            <div className="room-footer">
                                                <div className={`status-badge ${room.quantity > 0 ? 'available' : 'out'}`}>
                                                    <div className="status-dot"></div>
                                                    <span>{room.quantity} Available</span>
                                                </div>
                                                <IonButton
                                                    className="action-btn"
                                                    color="primary"
                                                    fill="solid"
                                                    onClick={() => handleEdit(room)}
                                                >
                                                    Edit
                                                </IonButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </IonCardContent>
                        </IonCard>
                    );
                })}
            </div>

            {/* Edit Modal */}
            <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)} className="edit-room-modal">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Edit Room Details</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsModalOpen(false)}>
                                <IonIcon icon={close} />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <div className="ion-padding modal-content-container">
                    {selectedRoom && (
                        <div className="edit-form">
                            <h3>{selectedRoom.name}</h3>

                            <div className="form-group">
                                <IonInput
                                    label="Price per Night (₱)"
                                    labelPlacement="stacked"
                                    fill="outline"
                                    type="number"
                                    value={editForm.price}
                                    onIonInput={e => setEditForm(prev => ({ ...prev, price: Number(e.detail.value) }))}
                                    className="custom-input"
                                />
                            </div>

                            <div className="form-group">
                                <IonInput
                                    label="Total Quantity Available"
                                    labelPlacement="stacked"
                                    fill="outline"
                                    type="number"
                                    value={editForm.quantity}
                                    onIonInput={e => setEditForm(prev => ({ ...prev, quantity: Number(e.detail.value) }))}
                                    className="custom-input"
                                />
                            </div>

                            <IonButton expand="block" className="save-btn" onClick={handleSave}>
                                Save Changes
                            </IonButton>
                        </div>
                    )}
                </div>
            </IonModal>
        </IonContent>
    );
};

export default AvailabilityManagement;
