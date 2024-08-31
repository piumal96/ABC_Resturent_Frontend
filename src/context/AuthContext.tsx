import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserModel from '../models/UserModel';

interface AuthContextProps {
    user: UserModel | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<UserModel>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserModel | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const isAuthenticated = !!user;

    const login = async (email: string, password: string): Promise<UserModel> => {
        try {
            const loggedInUser = await api.login(email, password);
            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            console.log('User logged in and session stored');
            navigate('/dashboard');
            return loggedInUser;
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Login failed');
        }
    };

    const logout = () => {
        api.logout();
        setUser(null);
        localStorage.removeItem('user');
        console.log('User logged out and session cleared');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
