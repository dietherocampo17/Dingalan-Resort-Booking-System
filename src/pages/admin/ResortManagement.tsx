import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonBadge,
    IonSearchbar,
    IonFab,
    IonFabButton,
    IonChip,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonAlert
} from '@ionic/react';
import { addOutline, createOutline, trashOutline, star, location, close, saveOutline, pencilOutline, bedOutline, wifiOutline } from 'ionicons/icons';
import { dataService } from '../../services/MockDataService';
import { Resort, RoomType } from '../../types';
import './ResortManagement.css';

const AMENITY_OPTIONS = [
    'Beach Access', 'Pool', 'Spa', 'Wi-Fi', 'Restaurant', 'Bar',
    'Gym', 'Water Sports', 'Mountain View', 'Lake View', 'Hiking Trails',
    'Fireplace', 'Garden', 'Kayaking', 'Snorkeling', 'Pet Friendly'
];

const emptyResort: Resort = {
    id: '',
    name: '',
    description: '',
    location: { address: '', city: '', province: '', lat: 0, lng: 0 },
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    amenities: [],
    rating: 0,
    reviewCount: 0,
    priceRange: { min: 0, max: 0 },
    policies: { checkIn: '2:00 PM', checkOut: '12:00 PM', cancellation: 'Free cancellation up to 24 hours before check-in', rules: [] },
    isVerified: false,
    status: 'active'
};

const emptyRoom: RoomType = {
    id: '',
    resortId: '',
    name: '',
    description: '',
    capacity: 2,
    pricePerNight: 0,
    inclusions: [],
    images: ['https://images.unsplash.com/photo-1590490360182-c583ca46fd08?w=800'],
    amenities: [],
    quantity: 1
};

const ResortManagement: React.FC = () => {
    const [resorts, setResorts] = useState<Resort[]>([]);
    const [searchText, setSearchText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingResort, setEditingResort] = useState<Resort>(emptyResort);
    const [isNew, setIsNew] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [resortToDelete, setResortToDelete] = useState<string>('');
    const [newAmenityText, setNewAmenityText] = useState('');

    // Room Management State
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [roomsToDelete, setRoomsToDelete] = useState<string[]>([]);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<RoomType>(emptyRoom);
    const [newInclusion, setNewInclusion] = useState('');
    const [newRoomAmenity, setNewRoomAmenity] = useState('');

    useEffect(() => {
        loadResorts();
    }, []);

    const loadResorts = () => {
        setResorts(dataService.getResorts());
    };

    const filtered = resorts.filter(r =>
        r.name.toLowerCase().includes(searchText.toLowerCase()) ||
        r.location.city.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleAddNew = () => {
        setEditingResort({ ...emptyResort, id: `resort-${Date.now()}` });
        setRooms([]);
        setRoomsToDelete([]);
        setIsNew(true);
        setShowModal(true);
    };

    const handleEdit = (resort: Resort) => {
        setEditingResort({ ...resort });
        setRooms(dataService.getRoomTypes(resort.id));
        setRoomsToDelete([]);
        setIsNew(false);
        setShowModal(true);
    };

    const handleSave = () => {
        // Save resort
        dataService.saveResort(editingResort);

        // Delete removed rooms
        roomsToDelete.forEach(id => {
            if (!id.startsWith('temp-')) { // Only delete real backend IDs
                dataService.deleteRoomType(id);
            }
        });

        // Save/Update rooms
        rooms.forEach(room => {
            dataService.saveRoomType({ ...room, resortId: editingResort.id });
        });

        loadResorts();
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        setResortToDelete(id);
        setShowDeleteAlert(true);
    };

    const confirmDelete = () => {
        dataService.deleteResort(resortToDelete);
        loadResorts();
        setShowDeleteAlert(false);
    };

    const updateField = (field: string, value: any) => {
        setEditingResort(prev => {
            const keys = field.split('.');
            if (keys.length === 1) {
                return { ...prev, [field]: value };
            } else if (keys.length === 2) {
                return {
                    ...prev,
                    [keys[0]]: { ...(prev as any)[keys[0]], [keys[1]]: value }
                };
            }
            return prev;
        });
    };

    // Room Management Handlers
    const handleAddNewRoom = () => {
        setEditingRoom({ ...emptyRoom, id: `temp-${Date.now()}`, resortId: editingResort.id });
        setNewInclusion('');
        setNewRoomAmenity('');
        setShowRoomModal(true);
    };

    const handleEditRoom = (room: RoomType) => {
        setEditingRoom({ ...room });
        setNewInclusion('');
        setNewRoomAmenity('');
        setShowRoomModal(true);
    };

    const handleSaveRoom = () => {
        const updatedRooms = [...rooms];
        const idx = updatedRooms.findIndex(r => r.id === editingRoom.id);
        if (idx >= 0) {
            updatedRooms[idx] = editingRoom;
        } else {
            updatedRooms.push(editingRoom);
        }
        setRooms(updatedRooms);
        setShowRoomModal(false);
    };

    const handleDeleteRoom = (id: string) => {
        const updatedRooms = rooms.filter(r => r.id !== id);
        setRooms(updatedRooms);
        setRoomsToDelete(prev => [...prev, id]);
    };

    const updateRoomField = (field: keyof RoomType, value: any) => {
        setEditingRoom(prev => ({ ...prev, [field]: value }));
    };

    return (
        <IonPage>
            <IonContent className="resort-management">
                <div className="page-header">
                    <h1>Resort Management</h1>
                    <p>Manage all resorts in the system</p>
                </div>

                <IonSearchbar
                    value={searchText}
                    onIonInput={e => setSearchText(e.detail.value!)}
                    placeholder="Search resorts..."
                />

                <div className="resorts-grid">
                    {filtered.map(resort => (
                        <IonCard key={resort.id} className="resort-card">
                            <img src={resort.images[0]} alt={resort.name} />
                            <IonCardContent>
                                <div className="card-header">
                                    <h3>{resort.name}</h3>
                                    {resort.isVerified && <IonBadge color="success">Verified</IonBadge>}
                                </div>
                                <p className="location">
                                    <IonIcon icon={location} /> {resort.location.city}, {resort.location.province}
                                </p>
                                <div className="rating">
                                    <IonIcon icon={star} color="warning" /> {resort.rating} ({resort.reviewCount} reviews)
                                </div>
                                <div className="price-range">
                                    ₱{resort.priceRange.min.toLocaleString()} - ₱{resort.priceRange.max.toLocaleString()}/night
                                </div>
                                <div className="amenities">
                                    {resort.amenities.slice(0, 3).map(a => (
                                        <IonChip key={a} color="primary" outline>{a}</IonChip>
                                    ))}
                                </div>
                                <div className="card-actions">
                                    <IonButton fill="outline" size="small" onClick={() => handleEdit(resort)}>
                                        <IonIcon icon={createOutline} slot="start" /> Edit
                                    </IonButton>
                                    <IonButton fill="outline" color="danger" size="small" onClick={() => handleDelete(resort.id)}>
                                        <IonIcon icon={trashOutline} slot="start" /> Delete
                                    </IonButton>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    ))}
                </div>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={handleAddNew}>
                        <IonIcon icon={addOutline} />
                    </IonFabButton>
                </IonFab>
            </IonContent>

            {/* Edit/Add Resort Modal */}
            <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start">
                            <IonButton onClick={() => setShowModal(false)}>
                                <IonIcon icon={close} />
                            </IonButton>
                        </IonButtons>
                        <IonTitle>{isNew ? 'Add New Resort' : 'Edit Resort'}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={handleSave}>
                                <IonIcon icon={saveOutline} slot="start" /> Save
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="edit-modal-content">
                    <div className="form-section">
                        <h3>Basic Information</h3>
                        <IonList>
                            <IonItem>
                                <IonLabel position="stacked">Resort Name *</IonLabel>
                                <IonInput
                                    value={editingResort.name}
                                    onIonInput={e => updateField('name', e.detail.value)}
                                    placeholder="Enter resort name"
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Description</IonLabel>
                                <IonTextarea
                                    value={editingResort.description}
                                    onIonInput={e => updateField('description', e.detail.value)}
                                    placeholder="Enter description"
                                    rows={4}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Image URL</IonLabel>
                                <IonInput
                                    value={editingResort.images[0]}
                                    onIonInput={e => updateField('images', [e.detail.value])}
                                    placeholder="https://..."
                                />
                            </IonItem>
                        </IonList>
                    </div>

                    <div className="form-section">
                        <h3>Location</h3>
                        <IonList>
                            <IonItem>
                                <IonLabel position="stacked">Street Address</IonLabel>
                                <IonInput
                                    value={editingResort.location.address}
                                    onIonInput={e => updateField('location.address', e.detail.value)}
                                    placeholder="123 Main Street"
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">City *</IonLabel>
                                <IonInput
                                    value={editingResort.location.city}
                                    onIonInput={e => updateField('location.city', e.detail.value)}
                                    placeholder="e.g., Boracay"
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Province *</IonLabel>
                                <IonInput
                                    value={editingResort.location.province}
                                    onIonInput={e => updateField('location.province', e.detail.value)}
                                    placeholder="e.g., Aklan"
                                />
                            </IonItem>
                        </IonList>
                    </div>

                    <div className="form-section">
                        <h3>Pricing</h3>
                        <IonList>
                            <IonItem>
                                <IonLabel position="stacked">Minimum Price (₱/night)</IonLabel>
                                <IonInput
                                    type="number"
                                    value={editingResort.priceRange.min}
                                    onIonInput={e => updateField('priceRange.min', Number(e.detail.value))}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Maximum Price (₱/night)</IonLabel>
                                <IonInput
                                    type="number"
                                    value={editingResort.priceRange.max}
                                    onIonInput={e => updateField('priceRange.max', Number(e.detail.value))}
                                />
                            </IonItem>
                        </IonList>
                    </div>

                    <div className="form-section">
                        <h3>Amenities</h3>
                        <IonItem>
                            <IonLabel position="stacked">Amenities</IonLabel>
                            <div className="amenity-input-container" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <IonInput
                                    placeholder="Add amenity (e.g. Helipad)"
                                    value={newAmenityText}
                                    onIonInput={e => setNewAmenityText(e.detail.value!)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            if (newAmenityText.trim()) {
                                                const newAmenity = newAmenityText.trim();
                                                if (!editingResort.amenities.includes(newAmenity)) {
                                                    updateField('amenities', [...editingResort.amenities, newAmenity]);
                                                }
                                                setNewAmenityText('');
                                            }
                                        }
                                    }}
                                />
                                <IonButton
                                    size="small"
                                    fill="outline"
                                    onClick={() => {
                                        if (newAmenityText.trim()) {
                                            const newAmenity = newAmenityText.trim();
                                            if (!editingResort.amenities.includes(newAmenity)) {
                                                updateField('amenities', [...editingResort.amenities, newAmenity]);
                                            }
                                            setNewAmenityText('');
                                        }
                                    }}
                                >
                                    <IonIcon icon={addOutline} />
                                </IonButton>
                            </div>
                            <div className="amenities-chips" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {editingResort.amenities.map(a => (
                                    <IonChip key={a} onClick={() => {
                                        updateField('amenities', editingResort.amenities.filter(item => item !== a));
                                    }}>
                                        <IonLabel>{a}</IonLabel>
                                        <IonIcon icon={close} />
                                    </IonChip>
                                ))}
                            </div>
                        </IonItem>
                    </div>

                    <div className="form-section">
                        <h3>Policies</h3>
                        <IonList>
                            <IonItem>
                                <IonLabel position="stacked">Check-in Time</IonLabel>
                                <IonInput
                                    value={editingResort.policies.checkIn}
                                    onIonInput={e => updateField('policies.checkIn', e.detail.value)}
                                    placeholder="2:00 PM"
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Check-out Time</IonLabel>
                                <IonInput
                                    value={editingResort.policies.checkOut}
                                    onIonInput={e => updateField('policies.checkOut', e.detail.value)}
                                    placeholder="12:00 PM"
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Cancellation Policy</IonLabel>
                                <IonTextarea
                                    value={editingResort.policies.cancellation}
                                    onIonInput={e => updateField('policies.cancellation', e.detail.value)}
                                    rows={2}
                                />
                            </IonItem>
                        </IonList>
                    </div>

                    <div className="form-section">
                        <h3>Settings</h3>
                        <IonList>
                            <IonItem>
                                <IonLabel>Verified Resort</IonLabel>
                                <IonSelect
                                    value={editingResort.isVerified}
                                    onIonChange={e => updateField('isVerified', e.detail.value)}
                                >
                                    <IonSelectOption value={true}>Yes</IonSelectOption>
                                    <IonSelectOption value={false}>No</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Status</IonLabel>
                                <IonSelect
                                    value={editingResort.status}
                                    onIonChange={e => updateField('status', e.detail.value)}
                                >
                                    <IonSelectOption value="active">Active</IonSelectOption>
                                    <IonSelectOption value="inactive">Inactive</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </IonList>
                    </div>

                    <div className="form-section">
                        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3>Accommodations & Services</h3>
                            <IonButton size="small" onClick={handleAddNewRoom}>
                                <IonIcon icon={addOutline} slot="start" /> Add
                            </IonButton>
                        </div>

                        {rooms.length === 0 ? (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>No rooms or services added yet.</p>
                        ) : (
                            <div className="rooms-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                {rooms.map(room => (
                                    <IonCard key={room.id} style={{ margin: 0 }}>
                                        <div style={{ height: '140px', overflow: 'hidden' }}>
                                            <img src={room.images[0]} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <IonCardContent>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 'bold' }}>{room.name}</h4>
                                                <IonBadge color="primary">₱{room.pricePerNight.toLocaleString()}</IonBadge>
                                            </div>
                                            <p style={{ fontSize: '0.85rem', color: '#666', margin: '4px 0' }}>Legacy: {room.capacity} pax | Qty: {room.quantity}</p>
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                                <IonButton fill="outline" size="small" expand="block" style={{ flex: 1 }} onClick={() => handleEditRoom(room)}>
                                                    <IonIcon icon={pencilOutline} />
                                                </IonButton>
                                                <IonButton fill="outline" color="danger" size="small" expand="block" style={{ flex: 1 }} onClick={() => handleDeleteRoom(room.id)}>
                                                    <IonIcon icon={trashOutline} />
                                                </IonButton>
                                            </div>
                                        </IonCardContent>
                                    </IonCard>
                                ))}
                            </div>
                        )}
                    </div>
                </IonContent>
            </IonModal>

            {/* Room Edit Modal */}
            <IonModal isOpen={showRoomModal} onDidDismiss={() => setShowRoomModal(false)}>
                <IonHeader>
                    <IonToolbar color="light">
                        <IonTitle>{editingRoom.id.startsWith('temp') ? 'Add Room/Service' : 'Edit Room/Service'}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowRoomModal(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonList>
                        <IonItem>
                            <IonLabel position="stacked">Name *</IonLabel>
                            <IonInput
                                value={editingRoom.name}
                                onIonInput={e => updateRoomField('name', e.detail.value)}
                                placeholder="e.g. Deluxe Room, Beach Cottage"
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Description</IonLabel>
                            <IonTextarea
                                value={editingRoom.description}
                                onIonInput={e => updateRoomField('description', e.detail.value)}
                                rows={3}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Image URL</IonLabel>
                            <IonInput
                                value={editingRoom.images[0]}
                                onIonInput={e => updateRoomField('images', [e.detail.value])}
                                placeholder="https://..."
                            />
                        </IonItem>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <IonItem style={{ flex: 1 }}>
                                <IonLabel position="stacked">Price (₱)</IonLabel>
                                <IonInput
                                    type="number"
                                    value={editingRoom.pricePerNight}
                                    onIonInput={e => updateRoomField('pricePerNight', Number(e.detail.value))}
                                />
                            </IonItem>
                            <IonItem style={{ flex: 1 }}>
                                <IonLabel position="stacked">Capacity (Pax)</IonLabel>
                                <IonInput
                                    type="number"
                                    value={editingRoom.capacity}
                                    onIonInput={e => updateRoomField('capacity', Number(e.detail.value))}
                                />
                            </IonItem>
                            <IonItem style={{ flex: 1 }}>
                                <IonLabel position="stacked">Quantity</IonLabel>
                                <IonInput
                                    type="number"
                                    value={editingRoom.quantity}
                                    onIonInput={e => updateRoomField('quantity', Number(e.detail.value))}
                                />
                            </IonItem>
                        </div>

                        <div className="ion-marginTop">
                            <IonLabel style={{ marginLeft: '16px', color: '#666', fontSize: '0.9rem' }}>Amenities (e.g. AC, TV)</IonLabel>
                            <div style={{ display: 'flex', gap: '8px', padding: '0 16px', marginTop: '8px' }}>
                                <IonInput
                                    placeholder="Add amenity..."
                                    value={newRoomAmenity}
                                    onIonInput={e => setNewRoomAmenity(e.detail.value!)}
                                    className="custom-input-border"
                                />
                                <IonButton
                                    size="small"
                                    fill="solid"
                                    onClick={() => {
                                        if (newRoomAmenity.trim()) {
                                            updateRoomField('amenities', [...editingRoom.amenities, newRoomAmenity.trim()]);
                                            setNewRoomAmenity('');
                                        }
                                    }}
                                >
                                    <IonIcon icon={addOutline} />
                                </IonButton>
                            </div>
                            <div style={{ padding: '8px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {editingRoom.amenities.map(a => (
                                    <IonChip key={a} onClick={() => updateRoomField('amenities', editingRoom.amenities.filter(item => item !== a))}>
                                        <IonIcon icon={wifiOutline} size="small" />
                                        <IonLabel>{a}</IonLabel>
                                        <IonIcon icon={close} />
                                    </IonChip>
                                ))}
                            </div>
                        </div>

                        <div className="ion-marginTop">
                            <IonLabel style={{ marginLeft: '16px', color: '#666', fontSize: '0.9rem' }}>Inclusions (e.g. Breakfast)</IonLabel>
                            <div style={{ display: 'flex', gap: '8px', padding: '0 16px', marginTop: '8px' }}>
                                <IonInput
                                    placeholder="Add inclusion..."
                                    value={newInclusion}
                                    onIonInput={e => setNewInclusion(e.detail.value!)}
                                />
                                <IonButton
                                    size="small"
                                    fill="solid"
                                    onClick={() => {
                                        if (newInclusion.trim()) {
                                            updateRoomField('inclusions', [...editingRoom.inclusions, newInclusion.trim()]);
                                            setNewInclusion('');
                                        }
                                    }}
                                >
                                    <IonIcon icon={addOutline} />
                                </IonButton>
                            </div>
                            <div style={{ padding: '8px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {editingRoom.inclusions.map(inc => (
                                    <IonChip key={inc} onClick={() => updateRoomField('inclusions', editingRoom.inclusions.filter(item => item !== inc))}>
                                        <IonIcon icon={bedOutline} size="small" />
                                        <IonLabel>{inc}</IonLabel>
                                        <IonIcon icon={close} />
                                    </IonChip>
                                ))}
                            </div>
                        </div>
                    </IonList>

                    <div className="ion-padding">
                        <IonButton expand="block" shape="round" onClick={handleSaveRoom}>
                            {editingRoom.id.startsWith('temp') ? 'Add Room' : 'Save Changes'}
                        </IonButton>
                    </div>
                </IonContent>
            </IonModal>

            {/* Delete Confirmation */}
            <IonAlert
                isOpen={showDeleteAlert}
                onDidDismiss={() => setShowDeleteAlert(false)}
                header="Delete Resort"
                message="Are you sure you want to delete this resort? This action cannot be undone."
                buttons={[
                    { text: 'Cancel', role: 'cancel' },
                    { text: 'Delete', role: 'destructive', handler: confirmDelete }
                ]}
            />
        </IonPage>
    );
};

export default ResortManagement;
