// import axios from 'axios';

// const API_URL = 'http://localhost:5001/api/';

// const login = async (email: string, password: string) => {
//     try {
//         const response = await axios.post(`${API_URL}auth/login`, { email, password });
//         return response.data;
//     } catch (error) {
//         throw new Error('Login failed. Please check your credentials and try again.');
//     }
// };

// const register = async (username: string, email: string, password: string, role: string) => {
//     try {
//         const response = await axios.post(`${API_URL}/register`, { username, email, password, role });
//         return response.data;
//     } catch (error: any) {
//         console.error('Error during registration:', error.response ? error.response.data : error.message);
//         throw new Error('Registration failed. Please check your details and try again.');
//     }
// };


// export default {
//     login,
//     register, // Exporting the new register function
// };

import axios, { AxiosResponse } from 'axios';
import UserModel from '../models/UserModel';

const API_URL = 'http://localhost:5001/api/';

interface LoginResponse {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
}

interface RegisterResponse extends LoginResponse {}

interface UserDetails extends LoginResponse {}

const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response: AxiosResponse<LoginResponse> = await axios.post(`${API_URL}auth/login`, { email, password });
        localStorage.setItem('user', JSON.stringify(response.data)); // Store user in localStorage
        return response.data;
    } catch (error) {
        throw new Error('Login failed. Please check your credentials and try again.');
    }
};

const register = async (username: string, email: string, password: string, role: string): Promise<RegisterResponse> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await axios.post(`${API_URL}users/register`, { username, email, password, role });
        return response.data;
    } catch (error: any) {
        console.error('Error during registration:', error.response ? error.response.data : error.message);
        throw new Error('Registration failed. Please check your details and try again.');
    }
};

const getUserDetails = async (userId: string): Promise<UserDetails> => {
    try {
        const response: AxiosResponse<UserDetails> = await axios.get(`${API_URL}users/${userId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching user details:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch user details.');
    }
};

const updateUser = async (userId: string, userData: Partial<UserModel>): Promise<UserModel> => {
    try {
        const response: AxiosResponse<UserModel> = await axios.put(`${API_URL}users/${userId}`, userData);
        const currentUser = JSON.parse(localStorage.getItem('user') as string);
        if (currentUser && currentUser._id === userId) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error: any) {
        console.error('Error updating user:', error.response ? error.response.data : error.message);
        throw new Error('Failed to update user.');
    }
};

const deleteUser = async (userId: string): Promise<boolean> => {
    try {
        await axios.delete(`${API_URL}users/${userId}`);
        return true;
    } catch (error: any) {
        console.error('Error deleting user:', error.response ? error.response.data : error.message);
        throw new Error('Failed to delete user.');
    }
};

const logout = (): void => {
    localStorage.removeItem('user');
};

const getCurrentUser = (): UserModel | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) as UserModel : null;
};

export default {
    login,
    register,
    getUserDetails,
    updateUser,
    deleteUser,
    logout,
    getCurrentUser,
};
