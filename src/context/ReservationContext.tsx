import React, { createContext, useState, ReactNode, useContext } from 'react';
import api from '@/services/api';
import ReservationModel from '../models/ReservationModel';

interface ReservationContextProps {
    reservations: ReservationModel[];
    createReservation: (data: {
        restaurant: string;
        service: string;
        date: string;
        time: string;
        type: string;
        specialRequests: string;
    }) => Promise<ReservationModel>;
    fetchReservations: () => Promise<void>;
}

const ReservationContext = createContext<ReservationContextProps | undefined>(undefined);

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
    const [reservations, setReservations] = useState<ReservationModel[]>([]);

    const fetchReservations = async () => {
        try {
            const response = await api.fetchReservations();
            setReservations(response.map((res: any) => ReservationModel.fromApiResponse(res)));
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
        }
    };

    const createReservation = async (data: {
        restaurant: string;
        service: string;
        date: string;
        time: string;
        type: string;
        specialRequests: string;
    }): Promise<ReservationModel> => {
        try {
            const response = await api.createReservation(data);
            const newReservation = ReservationModel.fromApiResponse(response);
            setReservations((prev) => [...prev, newReservation]);
            return newReservation;
        } catch (error) {
            console.error('Failed to create reservation:', error);
            throw error;
        }
    };

    return (
        <ReservationContext.Provider value={{ reservations, createReservation, fetchReservations }}>
            {children}
        </ReservationContext.Provider>
    );
};

export const useReservation = () => {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error('useReservation must be used within a ReservationProvider');
    }
    return context;
};
