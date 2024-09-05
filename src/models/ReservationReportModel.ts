// models/ReservationReportModel.ts

export interface ReservationCustomer {
    _id: string;
    email: string;
  }
  
  export interface ReservationRestaurant {
    _id: string;
    name: string;
  }
  
  export interface ReservationService {
    _id: string;
    name: string;
  }
  
  export interface Reservation {
    _id: string;
    customer: ReservationCustomer | null
    restaurant: ReservationRestaurant;
    service: ReservationService;
    date: string; // ISO Date string
    time: string; // Time in HH:mm format
    type: 'Dine-in' | 'Takeaway' | 'Delivery';
    deliveryAddress?: string | null;
    contactNumber?: string | null;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
    specialRequests?: string | null;
    createdAt: string; // ISO Date string
  }
  
  export interface ReservationReportResponse {
    success: boolean;
    message: string;
    reservations: Reservation[];
    totalPages: number;
    currentPage: number;
  }
  