import axios, { AxiosResponse } from 'axios';
import UserModel from '../models/UserModel';
import ReservationModel from '@/models/ReservationModel';
import RestaurantModel from '@/models/RestaurantModel';
import ReservationDetailModel from '@/models/ReservationDetailModel';
import QueryModel from '@/models/QueryModel';
import { OfferModel } from '../models/OfferModel';
import { ReservationReportResponse } from '@/models/ReservationReportModel';
import { QueryReportResponse } from '@/models/QueryReportModel';
import { UserActivityReportResponse } from '@/models/UserActivityReportModel';
import { PaymentModel } from '@/models/Payments';

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

interface FetchQueriesResponse {
    success: boolean;
    message: string;
    queries: QueryModel[];
  }

  interface UploadImageResponse {
    success: boolean;
    message: string;
    image: {
        id: string;
        title: string;
        description: string;
        imageUrl: string;
        uploadedAt: string;
    };
}
interface FetchGalleryImagesResponse {
    success: boolean;
    message: string;
    images: {
        _id: string;
        title: string;
        description: string;
        imageUrl: string;
        uploadedAt: string;
    }[];
}

interface DeleteImageResponse {
    success: boolean;
    message: string;
}

interface CreateOfferResponse {
    success: boolean;
    message: string;
    offer: OfferModel;
  }

  interface FetchOffersResponse {
    success: boolean;
    message: string;
    offers: OfferModel[];
  }

  // API response interfaces for services
interface CreateServiceResponse {
    success: boolean;
    message: string;
    service: ServiceModel;
}

interface FetchServicesResponse {
    success: boolean;
    message: string;
    services: ServiceModel[];
}

interface RegisterResponse {
    success: boolean;
    message: string;
    sessionId: string;
    user: UserModel;
}
interface FetchUsersResponse {
    success: boolean;
    message: string;
    users: UserModel[];
}
// API functions
export const login = async (email: string, password: string): Promise<UserModel> => {
    const response: AxiosResponse<LoginResponse> = await axios.post(`${API_URL}auth/login`, { email, password });
    const { sessionId, user } = response.data;
    console.log(sessionId)
    localStorage.setItem('sessionId', sessionId);  
    localStorage.setItem('user', JSON.stringify(user));  
    return user;
};

export const registerUser = async (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
}): Promise<UserModel> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await axios.post(`${API_URL}users/register`, userData);
        const { sessionId, user } = response.data;
        localStorage.setItem('sessionId', sessionId);
        console.log(sessionId)  
        localStorage.setItem('user', JSON.stringify(user));  
        console.log('User registered successfully:', user);
        return user;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const registerUserAdmin = async (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
}): Promise<UserModel> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await axios.post(`${API_URL}users/register`, userData);
        const { user } = response.data;
    
        return user;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
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
    console.log(response.data.reservation.payment?.id)
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

export const updateReservation = async (id: string, reservationData: Partial<ReservationModel>): Promise<ReservationDetailModel> => {
    try {
        // Log the data being sent to the API
        console.log("Sending update request to API with ID:", id);
        console.log("Reservation data being sent:", reservationData);

        const response: AxiosResponse<ReservationResponse> = await axios.put(`${API_URL}reservations/${id}`, reservationData);

        // Log the response received from the API
        console.log("API response received:", response.data);

        const updatedReservation = new ReservationDetailModel(response.data.reservation);
        
        return updatedReservation;
    } catch (error) {
        // Log any errors that occur during the request
        console.error("Error updating reservation:", error);
        throw error;
    }
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

// Create a new service
export const createService = async (serviceData: {
    name: string;
    description: string;
    price: number;
}): Promise<CreateServiceResponse> => {
    try {
        const response: AxiosResponse<CreateServiceResponse> = await axios.post(`${API_URL}services/`, serviceData);
        return response.data;
    } catch (error) {
        console.error('Error creating service:', error);
        throw error;
    }
};

// Fetch all services
export const getServices = async (): Promise<ServiceModel[]> => {
    try {
        const response: AxiosResponse<FetchServicesResponse> = await axios.get(`${API_URL}services/`);
        return response.data.services;
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
};

// Delete a service
export const deleteService = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}services/${id}`);
    } catch (error) {
        console.error('Error deleting service:', error);
        throw error;
    }
};

export const createQuery = async (queryData: Partial<QueryModel>): Promise<QueryModel> => {
    const response = await axios.post(`${API_URL}queries`, queryData);
    return response.data.query as QueryModel;
};

export const fetchQueries = async (): Promise<QueryModel[]> => {
    const response: AxiosResponse<FetchQueriesResponse> = await axios.get(`${API_URL}queries`);
  
    // Convert raw API data to QueryModel instances
    return response.data.queries.map(query => ({
      ...query,
      createdAt: new Date(query.createdAt),
    }));
  };

  export const deleteQuery = async (id: string): Promise<QueryModel> => {
    const response: AxiosResponse<{ success: boolean; message: string; query: QueryModel }> = await axios.delete(`${API_URL}queries/${id}`);
    return response.data.query;
};

export const uploadImage = async (imageFile: File, title: string, description: string): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', title);
    formData.append('description', description);

    try {
        console.log('Uploading image with title:', title);
        const response: AxiosResponse<UploadImageResponse> = await axios.post(`${API_URL}gallery`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Image uploaded successfully:', response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error response:', error.response);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};

// Get all images from the gallery
export const getGalleryImages = async (): Promise<FetchGalleryImagesResponse['images']> => {
    const response: AxiosResponse<FetchGalleryImagesResponse> = await axios.get(`${API_URL}gallery`);
    return response.data.images.map(image => ({
        ...image,
        imageUrl: `${API_URL}${image.imageUrl}`  // Ensure the full URL is used for images
    }));
};

export const deleteImage = async (id: string): Promise<DeleteImageResponse> => {
    try {
        const response: AxiosResponse<DeleteImageResponse> = await axios.delete(`${API_URL}gallery/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

export const createOffer = async (offerData: {
    title: string;
    description: string;
    discountPercentage: number;
    validFrom: string;
    validTo: string;
  }): Promise<CreateOfferResponse> => {
    try {
      const response: AxiosResponse<CreateOfferResponse> = await axios.post(`${API_URL}offers/`, offerData);
      return response.data;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  };

  export const getOffers = async (): Promise<OfferModel[]> => {
    try {
      const response: AxiosResponse<FetchOffersResponse> = await axios.get(`${API_URL}offers/`);
      return response.data.offers;
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  };

  export const deleteOffer = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}offers/${id}`);
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  };

  export const updateService = async (id: string, serviceData: {
    name: string;
    description: string;
    price: number;
}): Promise<ServiceModel> => {
    try {
        const response: AxiosResponse<{ success: boolean; message: string; service: ServiceModel }> = await axios.put(`${API_URL}services/${id}`, serviceData);
        return response.data.service;
    } catch (error) {
        console.error('Error updating service:', error);
        throw error;
    }
};

// Function to fetch reservation report
export const fetchReservationReport = async (): Promise<ReservationReportResponse> => {
    try {
      const response: AxiosResponse<ReservationReportResponse> = await axios.get(`${API_URL}reports/reservations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reservation report:', error);
      throw error;
    }
  };

  export const fetchQueryReport = async (): Promise<QueryReportResponse> => {
    try {
      const response: AxiosResponse<QueryReportResponse> = await axios.get(`${API_URL}reports/queries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching query report:', error);
      throw error;
    }
  };

  // Function to fetch user activity report
export const fetchUserActivityReport = async (): Promise<UserActivityReportResponse> => {
    try {
      const response: AxiosResponse<UserActivityReportResponse> = await axios.get(`${API_URL}reports/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user activity report:', error);
      throw error;
    }
  };
  
  // Function to update a payment status
  export const updatePayment = async (
    paymentId: string,
    amount: number,
    paymentMethod: string,
    paymentStatus: 'Pending' | 'Paid' | 'Failed'
): Promise<{ success: boolean; message: string; payment: PaymentModel }> => {
    const response: AxiosResponse<{ success: boolean; message: string; payment: PaymentModel }> = await axios.put(`${API_URL}payments/${paymentId}`, {
        amount,
        paymentMethod,
        paymentStatus, 
    });

    if (!response.data.success) {
        throw new Error('Payment update failed: ' + response.data.message);
    }

    // No need to use `new` since PaymentModel is an interface
    const updatedPayment: PaymentModel = response.data.payment;

    return {
        success: response.data.success,
        message: response.data.message,
        payment: updatedPayment,
    };
};

export const updateUser = async (id: string, userData: Partial<UserModel>): Promise<UserModel> => {
    try {
        const response: AxiosResponse<{ success: boolean; message: string; user: UserModel }> = await axios.put(`${API_URL}users/${id}`, userData);
        if (!response.data.success) {
            throw new Error(response.data.message || 'User update failed');
        }
        return response.data.user;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (id: string): Promise<void> => {
    try {
        const response: AxiosResponse<{ success: boolean; message: string }> = await axios.delete(`${API_URL}users/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'User deletion failed');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const fetchUsers = async (): Promise<UserModel[]> => {
    try {
        const response: AxiosResponse<FetchUsersResponse> = await axios.get(`${API_URL}users`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch users');
        }
        return response.data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};
// Export all functions as a single default object
export default {
    deleteUser,
    fetchUsers,
    updateUser,
    createOffer,
    updatePayment,
    fetchQueryReport,
    fetchUserActivityReport,
    fetchReservationReport,
    registerUser,
    updateService,
    getGalleryImages,
    deleteQuery,
    fetchQueries,
    createQuery,
    fetchServices,
    fetchRestaurants,
    login,
    getCurrentUser,
    logout,
    createReservation,
    updateReservation,
    deleteReservation,
    fetchReservations,
    getReservationsByUserId, 
    uploadImage,
};
