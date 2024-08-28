import React, { createContext, useState, useContext, ReactNode } from 'react';
import api from '../services/api';
import ReservationModel from '../models/ReservationModel';

interface ReservationContextProps {
    createReservation: (data: ReservationModel) => Promise<void>;
    reservations: ReservationModel[];
    fetchReservations: () => Promise<void>;
}

const ReservationContext = createContext<ReservationContextProps | undefined>(undefined);

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
    const [reservations, setReservations] = useState<ReservationModel[]>([]);

    const createReservation = async (data: ReservationModel) => {
        try {
            const newReservation = await api.createReservation(data);
            setReservations([...reservations, newReservation]);
        } catch (error) {
            console.error("Failed to create reservation", error);
        }
    };

    const fetchReservations = async () => {
        try {
            const fetchedReservations = await api.fetchReservations();
            setReservations(fetchedReservations);
        } catch (error) {
            console.error("Failed to fetch reservations", error);
        }
    };

    return (
        <ReservationContext.Provider value={{ createReservation, reservations, fetchReservations }}>
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
