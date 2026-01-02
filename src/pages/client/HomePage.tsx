import React, { useState } from 'react';
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
    IonText,
    IonRow,
    IonCol,
    IonGrid,
    IonBadge
} from '@ionic/react';
import { star, location, heart, heartOutline, arrowForward, search } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { dataService } from '../../services/MockDataService';
import { useAuth } from '../../context/AuthContext';
import './HomePage.css';

const HomePage: React.FC = () => {
    const history = useHistory();
    const { user, isAuthenticated } = useAuth();
    const [searchText, setSearchText] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);

    const resorts = dataService.getResorts();
    const featuredResorts = resorts.filter(r => r.isVerified && r.rating >= 4.5).slice(0, 3);
    const popularDestinations = ['Boracay', 'Palawan', 'Baguio', 'Tagaytay', 'Cebu'];

    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const handleSearch = () => {
        history.push(`/client/explore?q=${encodeURIComponent(searchText)}`);
    };

    return (
        <IonPage>
            <IonContent fullscreen className="home-content">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <h1>Discover Dingalan, Aurora</h1>
                        <p>Experience the Batanes of the East</p>
                        <div className="search-box">
                            <IonIcon icon={search} />
                            <input
                                type="text"
                                placeholder="Where do you want to stay in Dingalan?"
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                            />
                            <IonButton onClick={handleSearch}>Search</IonButton>
                        </div>
                    </div>
                </section>

                <section className="popular-destinations">
                    <div className="section-header">
                        <h2>Popular Spots</h2>
                        <span className="sc-link" onClick={() => history.push('/client/explore')}>See All</span>
                    </div>
                    <div className="destinations-scroll">
                        <div className="destination-card" onClick={() => setSearchText('White Beach')}>
                            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500" alt="White Beach" />
                            <span>White Beach</span>
                        </div>
                        <div className="destination-card" onClick={() => setSearchText('Tanawan')}>
                            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500" alt="Tanawan Viewdeck" />
                            <span>Tanawan Viewdeck</span>
                        </div>
                        <div className="destination-card" onClick={() => setSearchText('Matawe')}>
                            <img src="https://images.unsplash.com/photo-1476900543704-4312b78632f8?w=500" alt="Matawe" />
                            <span>Matawe Rocks</span>
                        </div>
                        <div className="destination-card" onClick={() => setSearchText('Lamao Caves')}>
                            <img src="https://images.unsplash.com/photo-1499678329028-101435549a4e?w=500" alt="Lamao Caves" />
                            <span>Lamao Caves</span>
                        </div>
                    </div>
                </section>

                {/* Featured Resorts */}
                <div className="section">
                    <div className="section-header">
                        <h2 className="section-title">Featured Resorts</h2>
                        <IonButton fill="clear" size="small" onClick={() => history.push('/client/explore')}>
                            View All <IonIcon icon={arrowForward} />
                        </IonButton>
                    </div>

                    <div className="featured-grid">
                        {featuredResorts.map(resort => (
                            <IonCard
                                key={resort.id}
                                className="resort-card featured"
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
                                <IonCardHeader>
                                    <IonCardTitle>{resort.name}</IonCardTitle>
                                    <IonCardSubtitle>
                                        <IonIcon icon={location} /> {resort.location.city}, {resort.location.province}
                                    </IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <div className="card-footer">
                                        <div className="rating">
                                            <IonIcon icon={star} color="warning" />
                                            <span>{resort.rating}</span>
                                            <span className="review-count">({resort.reviewCount} reviews)</span>
                                        </div>
                                        <div className="price">
                                            <span className="from">from</span>
                                            <span className="amount">₱{resort.priceRange.min.toLocaleString()}</span>
                                            <span className="per">/night</span>
                                        </div>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        ))}
                    </div>
                </div>

                {/* All Resorts */}
                <div className="section">
                    <h2 className="section-title">All Resorts</h2>
                    <IonGrid>
                        <IonRow>
                            {resorts.map(resort => (
                                <IonCol size="12" sizeMd="6" sizeLg="4" key={resort.id}>
                                    <IonCard
                                        className="resort-card"
                                        onClick={() => history.push(`/client/resort/${resort.id}`)}
                                    >
                                        <div className="card-image-container small">
                                            <img src={resort.images[0]} alt={resort.name} />
                                            <button
                                                className="favorite-btn"
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(resort.id); }}
                                            >
                                                <IonIcon icon={favorites.includes(resort.id) ? heart : heartOutline} />
                                            </button>
                                        </div>
                                        <IonCardHeader>
                                            <IonCardTitle>{resort.name}</IonCardTitle>
                                            <IonCardSubtitle>
                                                <IonIcon icon={location} /> {resort.location.city}
                                            </IonCardSubtitle>
                                        </IonCardHeader>
                                        <IonCardContent>
                                            <div className="amenities-preview">
                                                {resort.amenities.slice(0, 3).map(a => (
                                                    <IonChip key={a} color="light" className="amenity-chip">{a}</IonChip>
                                                ))}
                                            </div>
                                            <div className="card-footer">
                                                <div className="rating">
                                                    <IonIcon icon={star} color="warning" />
                                                    <span>{resort.rating}</span>
                                                </div>
                                                <div className="price">
                                                    <span className="amount">₱{resort.priceRange.min.toLocaleString()}</span>
                                                    <span className="per">/night</span>
                                                </div>
                                            </div>
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default HomePage;
