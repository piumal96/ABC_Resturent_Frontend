import axios, { AxiosResponse } from 'axios';
import UserModel from '../models/UserModel';
import ReservationModel from '@/models/ReservationModel';
import RestaurantModel from '@/models/RestaurantModel';
import ReservationDetailModel from '@/models/ReservationDetailModel';
import QueryModel from '@/models/QueryModel';
import { OfferModel } from '../models/OfferModel';

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
  
// Export all functions as a single default object
export default {createOffer,
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
