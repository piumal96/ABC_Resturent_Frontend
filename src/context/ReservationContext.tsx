import React, { createContext, useState, useContext, ReactNode } from 'react';
import api from '../services/api';
import ReservationModel from '../models/ReservationModel';
import ReservationDetailModel from '../models/ReservationDetailModel'; // Import the correct model

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
            const fetchedReservations: ReservationDetailModel[] = await api.fetchReservations();

            // Map ReservationDetailModel[] to ReservationModel[]
            const mappedReservations: ReservationModel[] = fetchedReservations.map((reservation) => ({
                id: reservation._id, // Map _id to id
                customer: reservation.customer._id, // Assuming ReservationModel expects customer as a string (customer ID)
                restaurant: reservation.restaurant ? reservation.restaurant._id : '', // Provide an empty string fallback for null
                service: reservation.service ? reservation.service._id : '', // Provide an empty string fallback for null
                date: reservation.date,
                time: reservation.time,
                status: reservation.status,
                paymentStatus: reservation.paymentStatus,
                specialRequests: reservation.specialRequests,
                type: reservation.type, // Assuming type is a property in ReservationModel
                createdAt: reservation.createdAt, // Assuming createdAt is a property in ReservationModel
            }));

            setReservations(mappedReservations);
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
