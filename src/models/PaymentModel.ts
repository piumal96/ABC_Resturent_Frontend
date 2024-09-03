// src/models/PaymentModel.ts

export interface PaymentModel {
    _id: string;
    customer: string;
    amount: number;
    status?: string;
    paymentDate?: string;
    reservation?: string;
    paymentMethod?: string;
}
