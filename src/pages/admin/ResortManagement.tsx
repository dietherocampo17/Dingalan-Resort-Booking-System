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
import { addOutline, createOutline, trashOutline, star, location, close, saveOutline } from 'ionicons/icons';
import { dataService } from '../../services/MockDataService';
import { Resort } from '../../types';
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

const ResortManagement: React.FC = () => {
    const [resorts, setResorts] = useState<Resort[]>([]);
    const [searchText, setSearchText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingResort, setEditingResort] = useState<Resort>(emptyResort);
    const [isNew, setIsNew] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [resortToDelete, setResortToDelete] = useState<string>('');

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
        setIsNew(true);
        setShowModal(true);
    };

    const handleEdit = (resort: Resort) => {
        setEditingResort({ ...resort });
        setIsNew(false);
        setShowModal(true);
    };

    const handleSave = () => {
        dataService.saveResort(editingResort);
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
                            <IonLabel position="stacked">Select Amenities</IonLabel>
                            <IonSelect
                                multiple
                                value={editingResort.amenities}
                                onIonChange={e => updateField('amenities', e.detail.value)}
                                placeholder="Choose amenities"
                            >
                                {AMENITY_OPTIONS.map(a => (
                                    <IonSelectOption key={a} value={a}>{a}</IonSelectOption>
                                ))}
                            </IonSelect>
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
