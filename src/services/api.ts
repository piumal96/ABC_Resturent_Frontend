import axios, { AxiosResponse } from 'axios';
import UserModel from '../models/UserModel';
import ReservationModel from '@/models/ReservationModel';
import RestaurantModel from '@/models/RestaurantModel';
import ServiceModel from '@/models/ServiceModel';

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

// Reservation API Calls
interface ReservationResponse {
    success: boolean;
    message: string;
    reservation: {
        id: string;
        customer: string;
        restaurant: string;
        service: string;
        date: string;
        time: string;
        type: string;
        deliveryAddress?: string;
        specialRequests: string;
        status: string;
        createdAt: string;
    };
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


// Create a reservation
export const createReservation = async (reservationData: {
    restaurant: string;
    service: string;
    date: string;
    time: string;
    type: string;
    specialRequests: string;
}): Promise<ReservationModel> => {
    try {
        const response: AxiosResponse<ReservationResponse> = await axios.post(`${API_URL}reservations`, reservationData);
        return ReservationModel.fromApiResponse(response.data.reservation);
    } catch (error) {
        console.error('Failed to create reservation:', error);
        throw error;
    }
};

// Fetch reservations (if needed)
export const fetchReservations = async (): Promise<ReservationModel[]> => {
    try {
        const response: AxiosResponse<{ reservations: ReservationModel[] }> = await axios.get(`${API_URL}reservations`);
        return response.data.reservations.map((reservation: any) => ReservationModel.fromApiResponse(reservation));
    } catch (error) {
        console.error('Failed to fetch reservations:', error);
        throw error;
    }
};
// Fetch Restaurant (if needed)
export const fetchRestaurants = async (): Promise<RestaurantModel[]> => {
    try {
        const response: AxiosResponse<FetchRestaurantsResponse> = await axios.get(`${API_URL}restaurants`);
        return response.data.restaurants.map(restaurant => RestaurantModel.fromApiResponse(restaurant));
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw error;
    }
};

// Fetch Services (if needed)
export const fetchServices = async (): Promise<ServiceModel[]> => {
    try {
        const response: AxiosResponse<FetchServicesResponse> = await axios.get(`${API_URL}services`);
        return response.data.services.map(service => ServiceModel.fromApiResponse(service));
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
};



export default {
    fetchServices,
    fetchRestaurants,
    login,
    getCurrentUser,
    logout,
    createReservation,
    fetchReservations, // Add this if you plan to fetch reservations
};
