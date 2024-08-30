import axios, { AxiosResponse } from 'axios';
import UserModel from '../models/UserModel';
import ReservationModel from '@/models/ReservationModel';
import RestaurantModel from '@/models/RestaurantModel';
import ReservationDetailModel from '@/models/ReservationDetailModel';

// Constants
const API_URL = 'http://localhost:5001/api/';

// Axios setup to automatically include session ID in headers and handle credentials
axios.defaults.withCredentials = true; // Ensures cookies are sent with requests

axios.interceptors.request.use(config => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
        config.headers.Authorization = `Bearer ${sessionId}`;
        console.log("Authorization Header Set:", config.headers.Authorization);
    } else {
        console.error("No session ID available for the request.");
    }
    return config;
}, error => Promise.reject(error));

// API response interfaces
interface LoginResponse {
    success: boolean;
    message: string;
    user: UserModel;
    sessionId: string;
}

interface ReservationResponse {
    success: boolean;
    message: string;
    reservation: ReservationModel;
}

interface FetchRestaurantsResponse {
    success: boolean;
    message: string;
    restaurants: RestaurantModel[];
}

interface FetchServicesResponse {
    success: boolean;
    message: string;
    services: ServiceModel[];
}

// Define the ServiceModel interface
export interface ServiceModel {
    _id: string;
    name: string;
    description: string;
    price: number;
    createdAt: Date;
}

// API functions
export const login = async (email: string, password: string): Promise<UserModel> => {
    const response: AxiosResponse<LoginResponse> = await axios.post(`${API_URL}auth/login`, { email, password });
    const { sessionId, user } = response.data;
    localStorage.setItem('sessionId', sessionId);  // Store the session ID
    localStorage.setItem('user', JSON.stringify(user));  // Store user data
    return user;
};

export const getCurrentUser = (): UserModel | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
};

export const logout = (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');  // Clear session ID
};

export const createReservation = async (reservationData: ReservationModel): Promise<ReservationModel> => {
    const response: AxiosResponse<ReservationResponse> = await axios.post(`${API_URL}reservations`, reservationData);
    return response.data.reservation;
};

// Correctly define the getReservationsByUserId function to fetch multiple reservations by user ID
export const getReservationsByUserId = async (
    userId: string
): Promise<ReservationDetailModel[]> => {
    const response: AxiosResponse<{ reservations: ReservationDetailModel[] }> = await axios.get(
        `${API_URL}reservations/user/${userId}`
    );
    return response.data.reservations;
};

export const updateReservation = async (id: string, reservationData: Partial<ReservationModel>): Promise<ReservationModel> => {
    const response: AxiosResponse<ReservationResponse> = await axios.put(`${API_URL}reservations/${id}`, reservationData);
    return response.data.reservation;
};

export const deleteReservation = async (id: string): Promise<ReservationModel> => {
    const response: AxiosResponse<ReservationResponse> = await axios.delete(`${API_URL}reservations/${id}`);
    return response.data.reservation;
};

export const fetchReservations = async (): Promise<ReservationDetailModel[]> => {
    const response: AxiosResponse<{ reservations: any[] }> = await axios.get(`${API_URL}reservations`);
    // Map the raw API response data to ReservationDetailModel instances
    return response.data.reservations.map(reservation => new ReservationDetailModel(reservation));
};

export const fetchRestaurants = async (): Promise<RestaurantModel[]> => {
    const response: AxiosResponse<FetchRestaurantsResponse> = await axios.get(`${API_URL}restaurants`);
    return response.data.restaurants;
};

export const fetchServices = async (query = ''): Promise<ServiceModel[]> => {
    try {
        const response: AxiosResponse<FetchServicesResponse> = await axios.get(`${API_URL}services`, {
            params: { query }
        });
        return response.data.services;
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
};

// Export all functions as a single default object
export default {
    fetchServices,
    fetchRestaurants,
    login,
    getCurrentUser,
    logout,
    createReservation,
    updateReservation,
    deleteReservation,
    fetchReservations,
    getReservationsByUserId, // Ensure this function is exported
};
