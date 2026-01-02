import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonChip,
    IonIcon,
    IonButton,
    IonModal,
    IonList,
    IonItem,
    IonLabel,
    IonRange,
    IonCheckbox,
    IonButtons,
    IonGrid,
    IonRow,
    IonCol,
    IonSegment,
    IonSegmentButton,
    IonBadge
} from '@ionic/react';
import { star, location, filter, close, heart, heartOutline, grid, list } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { dataService } from '../../services/MockDataService';
import { Resort } from '../../types';
import './ExplorePage.css';

const ALL_AMENITIES = [
    'Beach Access', 'Pool', 'Spa', 'Wi-Fi', 'Restaurant', 'Bar',
    'Gym', 'Water Sports', 'Mountain View', 'Lake View', 'Hiking Trails'
];

const ExplorePage: React.FC = () => {
    const history = useHistory();
    const locationHook = useLocation();

    const [searchText, setSearchText] = useState('');
    const [resorts, setResorts] = useState<Resort[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [favorites, setFavorites] = useState<string[]>([]);

    // Filters
    const [priceRange, setPriceRange] = useState<{ lower: number; upper: number }>({ lower: 0, upper: 25000 });
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [minRating, setMinRating] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(locationHook.search);
        const q = params.get('q') || '';
        const city = params.get('city') || '';
        setSearchText(q || city);

        loadResorts(q || city);
    }, [locationHook.search]);

    const loadResorts = (query?: string) => {
        const results = dataService.searchResorts(query || searchText, {
            minPrice: priceRange.lower,
            maxPrice: priceRange.upper,
            amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
            minRating: minRating > 0 ? minRating : undefined
        });
        setResorts(results);
    };

    const applyFilters = () => {
        loadResorts();
        setShowFilters(false);
    };

    const resetFilters = () => {
        setPriceRange({ lower: 0, upper: 25000 });
        setSelectedAmenities([]);
        setMinRating(0);
    };

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Explore Resorts</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonInput={e => setSearchText(e.detail.value!)}
                        onIonChange={() => loadResorts()}
                        placeholder="Search resorts, cities..."
                        debounce={300}
                    />
                </IonToolbar>
            </IonHeader>

            <IonContent className="explore-content">
                {/* Filter Bar */}
                <div className="filter-bar">
                    <IonButton fill="outline" size="small" onClick={() => setShowFilters(true)}>
                        <IonIcon icon={filter} slot="start" />
                        Filters
                        {(selectedAmenities.length > 0 || minRating > 0) && (
                            <IonBadge color="primary" style={{ marginLeft: '8px' }}>
                                {selectedAmenities.length + (minRating > 0 ? 1 : 0)}
                            </IonBadge>
                        )}
                    </IonButton>

                    <IonSegment value={viewMode} onIonChange={e => setViewMode(e.detail.value as 'grid' | 'list')}>
                        <IonSegmentButton value="grid">
                            <IonIcon icon={grid} />
                        </IonSegmentButton>
                        <IonSegmentButton value="list">
                            <IonIcon icon={list} />
                        </IonSegmentButton>
                    </IonSegment>
                </div>

                {/* Results Count */}
                <div className="results-info">
                    <span>{resorts.length} resorts found</span>
                </div>

                {/* Resort Grid/List */}
                <IonGrid>
                    <IonRow>
                        {resorts.map(resort => (
                            <IonCol
                                key={resort.id}
                                size="12"
                                sizeMd={viewMode === 'grid' ? '6' : '12'}
                                sizeLg={viewMode === 'grid' ? '4' : '12'}
                            >
                                <IonCard
                                    className={`resort-card ${viewMode}`}
                                    onClick={() => history.push(`/client/resort/${resort.id}`)}
                                >
                                    <div className="card-image-container">
                                        <img src={resort.images[0]} alt={resort.name} />
                                        {resort.isVerified && (
                                            <IonBadge className="verified-badge">Verified</IonBadge>
                                        )}
                                        <button
                                            className="favorite-btn"
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(resort.id); }}
                                        >
                                            <IonIcon icon={favorites.includes(resort.id) ? heart : heartOutline} />
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <IonCardHeader>
                                            <IonCardTitle>{resort.name}</IonCardTitle>
                                            <IonCardSubtitle>
                                                <IonIcon icon={location} /> {resort.location.city}, {resort.location.province}
                                            </IonCardSubtitle>
                                        </IonCardHeader>
                                        <IonCardContent>
                                            <div className="amenities-preview">
                                                {resort.amenities.slice(0, 4).map(a => (
                                                    <IonChip key={a} color="light" className="amenity-chip">{a}</IonChip>
                                                ))}
                                            </div>
                                            <div className="card-footer">
                                                <div className="rating">
                                                    <IonIcon icon={star} color="warning" />
                                                    <span>{resort.rating}</span>
                                                    <span className="review-count">({resort.reviewCount})</span>
                                                </div>
                                                <div className="price">
                                                    <span className="amount">₱{resort.priceRange.min.toLocaleString()}</span>
                                                    <span className="per">/night</span>
                                                </div>
                                            </div>
                                        </IonCardContent>
                                    </div>
                                </IonCard>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>

                {resorts.length === 0 && (
                    <div className="no-results">
                        <h3>No resorts found</h3>
                        <p>Try adjusting your search or filters</p>
                        <IonButton onClick={resetFilters}>Clear Filters</IonButton>
                    </div>
                )}

                {/* Filter Modal */}
                <IonModal isOpen={showFilters} onDidDismiss={() => setShowFilters(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot="start">
                                <IonButton onClick={() => setShowFilters(false)}>
                                    <IonIcon icon={close} />
                                </IonButton>
                            </IonButtons>
                            <IonTitle>Filters</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={resetFilters}>Reset</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="filter-modal-content">
                        <div className="filter-section">
                            <h3>Price Range</h3>
                            <IonRange
                                dualKnobs={true}
                                min={0}
                                max={25000}
                                step={500}
                                value={priceRange}
                                onIonChange={e => setPriceRange(e.detail.value as { lower: number; upper: number })}
                            >
                                <IonLabel slot="start">₱{priceRange.lower.toLocaleString()}</IonLabel>
                                <IonLabel slot="end">₱{priceRange.upper.toLocaleString()}</IonLabel>
                            </IonRange>
                        </div>

                        <div className="filter-section">
                            <h3>Minimum Rating</h3>
                            <IonSegment value={String(minRating)} onIonChange={e => setMinRating(Number(e.detail.value))}>
                                <IonSegmentButton value="0">All</IonSegmentButton>
                                <IonSegmentButton value="3">3+</IonSegmentButton>
                                <IonSegmentButton value="4">4+</IonSegmentButton>
                                <IonSegmentButton value="4.5">4.5+</IonSegmentButton>
                            </IonSegment>
                        </div>

                        <div className="filter-section">
                            <h3>Amenities</h3>
                            <div className="amenities-grid">
                                {ALL_AMENITIES.map(amenity => (
                                    <IonChip
                                        key={amenity}
                                        color={selectedAmenities.includes(amenity) ? 'primary' : 'medium'}
                                        onClick={() => toggleAmenity(amenity)}
                                    >
                                        {amenity}
                                    </IonChip>
                                ))}
                            </div>
                        </div>

                        <IonButton expand="block" className="apply-btn" onClick={applyFilters}>
                            Apply Filters
                        </IonButton>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default ExplorePage;
