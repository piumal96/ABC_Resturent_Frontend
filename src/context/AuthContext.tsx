import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserModel from '../models/UserModel';

interface AuthContextProps {
    user: UserModel | null;
    sessionId: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<UserModel>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserModel | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user and session data are available in localStorage on app load
        const storedUser = localStorage.getItem('user');
        const storedSessionId = localStorage.getItem('sessionId');

        if (storedUser && storedSessionId) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setSessionId(storedSessionId);
            console.log('User and session restored from localStorage');
        } else {
            setUser(null);
            setSessionId(null);
            console.log('No valid session found in localStorage');
        }

        setLoading(false); // Mark loading as complete
    }, []);

    const isAuthenticated = !!user && !!sessionId;

    useEffect(() => {
        console.log("isAuthenticated:", isAuthenticated);
    }, [isAuthenticated]);

    const login = async (email: string, password: string): Promise<UserModel> => {
        try {
            const loggedInUser = await api.login(email, password);
            setUser(loggedInUser);
            setSessionId(loggedInUser.sessionId || null);
            localStorage.setItem('user', JSON.stringify(loggedInUser)); // Store user in localStorage
            localStorage.setItem('sessionId', loggedInUser.sessionId || ''); // Store sessionId in localStorage
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
        setSessionId(null);
        localStorage.removeItem('user'); // Clear user from localStorage
        localStorage.removeItem('sessionId'); // Clear sessionId from localStorage
        console.log('User logged out and session cleared');
        navigate('/home');
    };

    return (
        <AuthContext.Provider value={{ user, sessionId, isAuthenticated, loading, login, logout }}>
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
