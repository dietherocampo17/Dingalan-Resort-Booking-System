import { Resort, RoomType, Booking, Review, Availability, User } from '../types';

// Sample resort images (placeholder URLs)
const RESORT_IMAGES = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
];

// Initial seed data
const INITIAL_RESORTS: Resort[] = [
    {
        id: 'resort-1',
        name: 'Aurora Beach Club',
        description: 'Experience the "Batanes of the East" at Aurora Beach Club. Featuring panoramic ocean views, private villas, and direct access to White Beach. Perfect for luxury seekers and nature lovers.',
        location: {
            address: 'Paltic',
            city: 'Dingalan',
            province: 'Aurora',
            lat: 15.3917,
            lng: 121.3966
        },
        images: [RESORT_IMAGES[0], RESORT_IMAGES[1], RESORT_IMAGES[2]],
        amenities: ['Beach Access', 'Infinity Pool', 'Restaurant', 'Bar', 'Water Sports', 'ATV Rental', 'Wi-Fi'],
        rating: 4.8,
        reviewCount: 156,
        priceRange: { min: 4500, max: 12000 },
        policies: {
            checkIn: '2:00 PM',
            checkOut: '12:00 PM',
            cancellation: 'Free cancellation up to 72 hours before check-in',
            rules: ['No smoking in rooms', 'No pets allowed']
        },
        isVerified: true,
        status: 'active'
    },
    {
        id: 'resort-2',
        name: 'Dingalan White Beach Resort',
        description: 'Located right on the pristine shoreline of White Beach. Simple, comfortable cottages perfect for groups and families looking to enjoy the sun and sand.',
        location: {
            address: 'White Beach',
            city: 'Dingalan',
            province: 'Aurora',
            lat: 15.3950,
            lng: 121.3980
        },
        images: [RESORT_IMAGES[1], RESORT_IMAGES[3], RESORT_IMAGES[0]],
        amenities: ['Beachfront', 'Cottages', 'Grill Area', 'Common Bath', 'Parking'],
        rating: 4.5,
        reviewCount: 89,
        priceRange: { min: 2500, max: 5000 },
        policies: {
            checkIn: '1:00 PM',
            checkOut: '11:00 AM',
            cancellation: 'Non-refundable within 7 days',
            rules: ['Pets allowed', 'Quiet hours 10 PM onwards']
        },
        isVerified: true,
        status: 'active'
    },
    {
        id: 'resort-3',
        name: 'Matawe Inter-Tidal Resort',
        description: 'Discover the unique rock formations and tidal pools of Matawe. A serene getaway for those who want to disconnect and explore the raw beauty of Dingalan.',
        location: {
            address: 'Brgy. Matawe',
            city: 'Dingalan',
            province: 'Aurora',
            lat: 15.3500,
            lng: 121.4000
        },
        images: [RESORT_IMAGES[2], RESORT_IMAGES[4], RESORT_IMAGES[1]],
        amenities: ['Rock Formations', 'Tidal Pools', 'Picnic Huts', 'Camping Ground'],
        rating: 4.3,
        reviewCount: 45,
        priceRange: { min: 1500, max: 3500 },
        policies: {
            checkIn: '2:00 PM',
            checkOut: '12:00 PM',
            cancellation: 'Flexible cancellation',
            rules: ['Clean as you go', 'No loud karaoke']
        },
        isVerified: true,
        status: 'active'
    },
    {
        id: 'resort-4',
        name: 'Shalom Guest House & Viewdeck',
        description: 'Perched on a hill offering breathtaking views of Dingalan Bay. Homey atmosphere with a famous viewdeck perfect for sunrise viewing.',
        location: {
            address: 'Tanawan',
            city: 'Dingalan',
            province: 'Aurora',
            lat: 15.4000,
            lng: 121.3800
        },
        images: [RESORT_IMAGES[3], RESORT_IMAGES[0], RESORT_IMAGES[4]],
        amenities: ['Viewdeck', 'Restaurant', 'Wi-Fi', 'Function Hall'],
        rating: 4.7,
        reviewCount: 210,
        priceRange: { min: 1800, max: 4000 },
        policies: {
            checkIn: '2:00 PM',
            checkOut: '12:00 PM',
            cancellation: 'Free cancellation up to 24 hours before',
            rules: ['No smoking']
        },
        isVerified: true,
        status: 'active'
    }
];

const INITIAL_ROOM_TYPES: RoomType[] = [
    // Aurora Beach Club (resort-1)
    {
        id: 'room-1',
        resortId: 'resort-1',
        name: 'Ocean View Villa',
        description: 'Private villa with balcony overlooking the Pacific Ocean.',
        capacity: 4,
        pricePerNight: 8500,
        inclusions: ['Breakfast for 4', 'Welcome Drinks', 'Pool Access'],
        images: [RESORT_IMAGES[0]],
        amenities: ['Ocean View', '2 Queen Beds', 'Balcony', 'AC', 'Private Bath'],
        quantity: 5
    },
    {
        id: 'room-2',
        resortId: 'resort-1',
        name: 'Standard Room',
        description: 'Comfortable room for couples close to the pool area.',
        capacity: 2,
        pricePerNight: 4500,
        inclusions: ['Breakfast for 2', 'Pool Access'],
        images: [RESORT_IMAGES[1]],
        amenities: ['Queen Bed', 'AC', 'TV', 'Shower'],
        quantity: 10
    },
    // Dingalan White Beach Resort (resort-2)
    {
        id: 'room-3',
        resortId: 'resort-2',
        name: 'Beach Cottage',
        description: 'Traditional nipa hut style cottage right on the sand.',
        capacity: 6,
        pricePerNight: 3500,
        inclusions: ['Entrance Fees', 'Use of Grill'],
        images: [RESORT_IMAGES[3]],
        amenities: ['Fan', 'Mattresses', 'Table & Chairs'],
        quantity: 8
    },
    {
        id: 'room-4',
        resortId: 'resort-2',
        name: 'Aircon Room',
        description: 'Simple air-conditioned room for small families.',
        capacity: 4,
        pricePerNight: 5000,
        inclusions: ['Entrance Fees'],
        images: [RESORT_IMAGES[4]],
        amenities: ['AC', 'Private Bath', 'Double Bed'],
        quantity: 4
    },
    // Matawe (resort-3)
    {
        id: 'room-5',
        resortId: 'resort-3',
        name: 'Glamping Tent',
        description: 'Experience sleeping under the stars with our sturdy glamping tents.',
        capacity: 2,
        pricePerNight: 1500,
        inclusions: ['Common Bath Access', 'Breakfast'],
        images: [RESORT_IMAGES[1]],
        amenities: ['Mattress', 'Pillows', 'Lamp'],
        quantity: 10
    },
    // Shalom (resort-4)
    {
        id: 'room-7',
        resortId: 'resort-4',
        name: 'View Deck Room',
        description: 'Room with the best view of the sunrise.',
        capacity: 2,
        pricePerNight: 3000,
        inclusions: ['Breakfast', 'Viewdeck Access'],
        images: [RESORT_IMAGES[2]],
        amenities: ['AC', 'Queen Bed', 'Hot Shower'],
        quantity: 5
    },
    {
        id: 'room-8',
        resortId: 'resort-4',
        name: 'Family Room',
        description: 'Large room for big groups.',
        capacity: 8,
        pricePerNight: 6000,
        inclusions: ['Breakfast'],
        images: [RESORT_IMAGES[0]],
        amenities: ['AC', 'Bunk Beds', 'Private Bath'],
        quantity: 3
    }
];

const INITIAL_REVIEWS: Review[] = [
    {
        id: 'rev-1',
        resortId: 'resort-1',
        userId: 'user-1',
        userName: 'Maria Santos',
        rating: 5,
        comment: 'Absolutely stunning resort! The beach is pristine and the staff went above and beyond.',
        createdAt: '2024-12-15T10:00:00Z'
    },
    {
        id: 'rev-2',
        resortId: 'resort-1',
        userId: 'user-2',
        userName: 'Carlos Reyes',
        rating: 4,
        comment: 'Great location and amenities. Food could be better but overall excellent stay.',
        createdAt: '2024-12-10T14:30:00Z'
    },
    {
        id: 'rev-3',
        resortId: 'resort-3',
        userId: 'user-3',
        userName: 'Anna Lee',
        rating: 5,
        comment: 'Paradise on Earth! The overwater villa was a dream come true.',
        createdAt: '2024-12-20T09:15:00Z'
    }
];

const INITIAL_BOOKINGS: Booking[] = [
    {
        id: 'book-1',
        resortId: 'resort-1',
        roomTypeId: 'room-1',
        userId: 'user-1',
        checkInDate: '2026-01-05',
        checkOutDate: '2026-01-08',
        guests: 2,
        totalPrice: 16500,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: '2024-12-25T10:00:00Z',
        updatedAt: '2024-12-25T10:00:00Z'
    },
    {
        id: 'book-2',
        resortId: 'resort-3',
        roomTypeId: 'room-5',
        userId: 'user-1',
        checkInDate: '2026-01-10',
        checkOutDate: '2026-01-12',
        guests: 2,
        totalPrice: 16000,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: '2024-12-28T14:00:00Z',
        updatedAt: '2024-12-28T14:00:00Z'
    }
];

// Data service class
class MockDataService {
    private getStorage<T>(key: string, initial: T[]): T[] {
        const stored = localStorage.getItem(key);
        if (!stored) {
            localStorage.setItem(key, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(stored);
    }

    private setStorage<T>(key: string, data: T[]): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // === Resorts ===
    getResorts(): Resort[] {
        return this.getStorage('dingalan_resorts', INITIAL_RESORTS);
    }

    getResort(id: string): Resort | undefined {
        return this.getResorts().find(r => r.id === id);
    }

    searchResorts(query: string, filters?: {
        city?: string;
        minPrice?: number;
        maxPrice?: number;
        amenities?: string[];
        minRating?: number;
    }): Resort[] {
        let resorts = this.getResorts().filter(r => r.status === 'active');

        if (query) {
            const q = query.toLowerCase();
            resorts = resorts.filter(r =>
                r.name.toLowerCase().includes(q) ||
                r.location.city.toLowerCase().includes(q) ||
                r.location.province.toLowerCase().includes(q)
            );
        }

        if (filters?.city) {
            resorts = resorts.filter(r =>
                r.location.city.toLowerCase() === filters.city!.toLowerCase()
            );
        }

        if (filters?.minPrice !== undefined) {
            resorts = resorts.filter(r => r.priceRange.min >= filters.minPrice!);
        }

        if (filters?.maxPrice !== undefined) {
            resorts = resorts.filter(r => r.priceRange.max <= filters.maxPrice!);
        }

        if (filters?.amenities?.length) {
            resorts = resorts.filter(r =>
                filters.amenities!.every(a => r.amenities.includes(a))
            );
        }

        if (filters?.minRating !== undefined) {
            resorts = resorts.filter(r => r.rating >= filters.minRating!);
        }

        return resorts;
    }

    saveResort(resort: Resort): void {
        const resorts = this.getResorts();
        const idx = resorts.findIndex(r => r.id === resort.id);
        if (idx >= 0) {
            resorts[idx] = resort;
        } else {
            resorts.push(resort);
        }
        this.setStorage('dingalan_resorts', resorts);
    }

    deleteResort(id: string): void {
        const resorts = this.getResorts().filter(r => r.id !== id);
        this.setStorage('dingalan_resorts', resorts);
    }

    // === Room Types ===
    getRoomTypes(resortId?: string): RoomType[] {
        const rooms = this.getStorage('dingalan_rooms', INITIAL_ROOM_TYPES);
        return resortId ? rooms.filter(r => r.resortId === resortId) : rooms;
    }

    getRoomType(id: string): RoomType | undefined {
        return this.getRoomTypes().find(r => r.id === id);
    }

    saveRoomType(room: RoomType): void {
        const rooms = this.getRoomTypes();
        const idx = rooms.findIndex(r => r.id === room.id);
        if (idx >= 0) {
            rooms[idx] = room;
        } else {
            rooms.push(room);
        }
        this.setStorage('dingalan_rooms', rooms);
    }

    // === Bookings ===
    getBookings(filters?: {
        userId?: string;
        resortId?: string;
        status?: string;
        date?: string;
    }): Booking[] {
        let bookings = this.getStorage('dingalan_bookings', INITIAL_BOOKINGS);

        if (filters?.userId) {
            bookings = bookings.filter(b => b.userId === filters.userId);
        }
        if (filters?.resortId) {
            bookings = bookings.filter(b => b.resortId === filters.resortId);
        }
        if (filters?.status) {
            bookings = bookings.filter(b => b.status === filters.status);
        }
        if (filters?.date) {
            bookings = bookings.filter(b =>
                b.checkInDate === filters.date || b.checkOutDate === filters.date
            );
        }

        return bookings;
    }

    getBooking(id: string): Booking | undefined {
        return this.getBookings().find(b => b.id === id);
    }

    createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
        const newBooking: Booking = {
            ...booking,
            id: `book-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const bookings = this.getBookings();
        bookings.push(newBooking);
        this.setStorage('dingalan_bookings', bookings);
        return newBooking;
    }

    updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
        const bookings = this.getBookings();
        const idx = bookings.findIndex(b => b.id === id);
        if (idx >= 0) {
            bookings[idx] = {
                ...bookings[idx],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.setStorage('dingalan_bookings', bookings);
            return bookings[idx];
        }
        return undefined;
    }

    // === Reviews ===
    getReviews(resortId?: string): Review[] {
        const reviews = this.getStorage('dingalan_reviews', INITIAL_REVIEWS);
        return resortId ? reviews.filter(r => r.resortId === resortId) : reviews;
    }

    addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
        const newReview: Review = {
            ...review,
            id: `rev-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        const reviews = this.getReviews();
        reviews.push(newReview);
        this.setStorage('dingalan_reviews', reviews);

        // Update resort rating
        this.updateResortRating(review.resortId);

        return newReview;
    }

    private updateResortRating(resortId: string): void {
        const reviews = this.getReviews(resortId);
        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            const resort = this.getResort(resortId);
            if (resort) {
                resort.rating = Math.round(avgRating * 10) / 10;
                resort.reviewCount = reviews.length;
                this.saveResort(resort);
            }
        }
    }

    // === Availability ===
    checkAvailability(roomTypeId: string, checkIn: string, checkOut: string): boolean {
        const room = this.getRoomType(roomTypeId);
        if (!room) return false;

        const bookings = this.getBookings().filter(b =>
            b.roomTypeId === roomTypeId &&
            b.status !== 'cancelled' &&
            !(b.checkOutDate <= checkIn || b.checkInDate >= checkOut)
        );

        return bookings.length < room.quantity;
    }

    // === Users (for admin) ===
    getUsers(): User[] {
        return this.getStorage('dingalan_users', []);
    }

    // === Analytics ===
    getAnalytics(): {
        totalBookings: number;
        totalRevenue: number;
        occupancyRate: number;
        pendingBookings: number;
        todayCheckIns: number;
    } {
        const bookings = this.getBookings();
        const today = new Date().toISOString().split('T')[0];

        const completedBookings = bookings.filter(b =>
            b.status === 'completed' || b.status === 'checked-in'
        );
        const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

        return {
            totalBookings: bookings.length,
            totalRevenue,
            occupancyRate: 68, // Mock value
            pendingBookings: bookings.filter(b => b.status === 'pending').length,
            todayCheckIns: bookings.filter(b => b.checkInDate === today && b.status === 'confirmed').length
        };
    }
}

export const dataService = new MockDataService();
