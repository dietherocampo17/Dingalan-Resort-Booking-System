import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<User | null>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing different roles
const DEMO_USERS: Record<string, User & { password: string }> = {
    'admin@resort.com': {
        id: 'admin-1',
        email: 'admin@resort.com',
        name: 'Admin User',
        role: 'admin',
        password: 'admin123',
        createdAt: new Date().toISOString()
    },
    'employee@resort.com': {
        id: 'emp-1',
        email: 'employee@resort.com',
        name: 'Front Desk Staff',
        role: 'employee',
        password: 'employee123',
        createdAt: new Date().toISOString()
    },
    'guest@example.com': {
        id: 'user-1',
        email: 'guest@example.com',
        name: 'John Traveler',
        role: 'client',
        phone: '+1234567890',
        password: 'guest123',
        createdAt: new Date().toISOString()
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored session
        const stored = localStorage.getItem('resort_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<User | null> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const demoUser = DEMO_USERS[email.toLowerCase()];
        if (demoUser && demoUser.password === password) {
            const { password: _, ...userData } = demoUser;
            setUser(userData);
            localStorage.setItem('resort_user', JSON.stringify(userData));
            return userData;
        }

        // Check registered users
        const users = JSON.parse(localStorage.getItem('resort_users') || '[]');
        const found = users.find((u: User & { password: string }) =>
            u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (found) {
            const { password: _, ...userData } = found;
            setUser(userData);
            localStorage.setItem('resort_user', JSON.stringify(userData));
            return userData;
        }

        return null;
    };

    const signup = async (name: string, email: string, password: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Check if email exists
        if (DEMO_USERS[email.toLowerCase()]) {
            return false;
        }

        const users = JSON.parse(localStorage.getItem('resort_users') || '[]');
        if (users.find((u: User) => u.email.toLowerCase() === email.toLowerCase())) {
            return false;
        }

        const newUser: User & { password: string } = {
            id: `user-${Date.now()}`,
            email,
            name,
            role: 'client',
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('resort_users', JSON.stringify(users));

        const { password: _, ...userData } = newUser;
        setUser(userData);
        localStorage.setItem('resort_user', JSON.stringify(userData));

        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('resort_user');
    };

    const switchRole = (role: UserRole) => {
        if (user) {
            const updatedUser = { ...user, role };
            setUser(updatedUser);
            localStorage.setItem('resort_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            signup,
            logout,
            switchRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
