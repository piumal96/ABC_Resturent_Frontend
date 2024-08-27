import axios, { AxiosResponse } from 'axios';
import UserModel from '../models/UserModel';

const API_URL = 'http://localhost:5001/api/';

interface LoginResponse {
    success: boolean;
    message: string;
    user: {
        id: string;
        username: string;
        email: string;
        role: string;
        createdAt: string;
    };
    sessionId: string;
}

// Login function
export const login = async (email: string, password: string): Promise<UserModel> => {
    try {
        const response: AxiosResponse<LoginResponse> = await axios.post(`${API_URL}auth/login`, { email, password });
        const user = UserModel.fromApiResponse(response.data);
        localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage
        return user;
    } catch (error) {
        throw new Error('Login failed. Please check your credentials and try again.');
    }
};


// Get current user from localStorage
export const getCurrentUser = (): UserModel | null => {
    const userData = localStorage.getItem('user');
    if (!userData) {
        return null; // Return null if no user data is found
    }

    try {
        const parsedData = JSON.parse(userData);
        if (parsedData && parsedData.user && parsedData.user.id) {
            return UserModel.fromApiResponse(parsedData); // Safely parse and return UserModel
        } else {
            throw new Error('Malformed user data');
        }
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return null; // Return null if parsing fails
    }
};

// Logout function
export const logout = (): void => {
    localStorage.removeItem('user');
};

export default {
    login,
    getCurrentUser,
    logout,
};
