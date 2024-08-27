import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserModel from '../models/UserModel';

interface AuthContextProps {
    user: UserModel | null;
    sessionId: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<UserModel>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserModel | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user data is available in localStorage on app load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setSessionId(parsedUser.sessionId ?? null);
        }
    }, []);

    const isAuthenticated = !!user;

    const login = async (email: string, password: string): Promise<UserModel> => {
        try {
            const loggedInUser = await api.login(email, password);
            setUser(loggedInUser);
            setSessionId(loggedInUser.sessionId || null);
            localStorage.setItem('user', JSON.stringify(loggedInUser)); // Store user in localStorage
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
        setSessionId(null);
        localStorage.removeItem('user'); // Clear user from localStorage
        navigate('/home');
    };

    return (
        <AuthContext.Provider value={{ user, sessionId, isAuthenticated, login, logout }}>
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
