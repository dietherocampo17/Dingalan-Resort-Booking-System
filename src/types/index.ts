// User Roles
export type UserRole = 'guest' | 'client' | 'employee' | 'admin';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
  status?: 'active' | 'inactive';
  favorites?: string[]; // Array of resort IDs
}

// Resort types
export interface Resort {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    province: string;
    lat: number;
    lng: number;
  };
  images: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    rules: string[];
  };
  isVerified: boolean;
  status: 'active' | 'inactive';
}

// Room types
export interface RoomType {
  id: string;
  resortId: string;
  name: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  inclusions: string[];
  images: string[];
  amenities: string[];
  quantity: number;
}

// Booking types
export type BookingStatus = 'pending' | 'confirmed' | 'checked-in' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  resortId: string;
  roomTypeId: string;
  userId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  confirmedBy?: string;
  checkedInBy?: string;
  checkedOutBy?: string;
}

// Review types
export interface Review {
  id: string;
  resortId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  reply?: {
    comment: string;
    createdAt: string;
  };
}

// Availability
export interface Availability {
  roomTypeId: string;
  date: string;
  available: number;
  price: number;
}

// Payment Configuration
export interface PaymentMethodConfig {
  id: string; // 'gcash', 'paymaya', 'bank'
  name: string;
  description: string;
  accountName: string;
  accountNumber: string;
  isEnabled: boolean;
  qrCode?: string; // URL or base64
  instructions?: string;
}
