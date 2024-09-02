// src/models/ReservationDetailModel.ts

export default class ReservationDetailModel {
    _id: string;
    customer: {
        _id: string;
        username: string;
        email: string;
    };
    restaurant: {
        _id: string;
        name: string;
        location: string;
    } | null;
    service: {
        _id: string;
        name: string;
        price: number;
    } | null;
    date: string;
    time: string;
    type: string;
    deliveryAddress?: string | null;
    contactNumber?: string | null;
    specialRequests: string;
    status: string;
    paymentStatus: string;
    payment?: {
        _id: string;
        customer: string;
        amount: number;
        status: string;
        paymentDate: string;
        reservation: string;
        paymentMethod?: string;
    } | null;
    createdAt: string;

    constructor(data: any) {
        this._id = data._id;
        this.customer = {
            _id: data.customer._id,
            username: data.customer.username,
            email: data.customer.email,
        };
        this.restaurant = data.restaurant
            ? {
                  _id: data.restaurant._id,
                  name: data.restaurant.name,
                  location: data.restaurant.location,
              }
            : null;
        this.service = data.service
            ? {
                  _id: data.service._id,
                  name: data.service.name,
                  price: data.service.price,
              }
            : null;
        this.date = data.date;
        this.time = data.time;
        this.type = data.type;
        // Only assign deliveryAddress and contactNumber if type is 'Delivery'
        this.deliveryAddress = data.type === 'Delivery' ? data.deliveryAddress || null : null;
        this.contactNumber = data.type === 'Delivery' ? data.contactNumber || null : null;
        this.specialRequests = data.specialRequests;
        this.status = data.status;
        this.paymentStatus = data.paymentStatus;
        this.payment = data.payment
            ? {
                  _id: data.payment._id,
                  customer: data.payment.customer,
                  amount: data.payment.amount,
                  status: data.payment.status,
                  paymentDate: data.payment.paymentDate,
                  reservation: data.payment.reservation,
                  paymentMethod: data.payment.paymentMethod || null,
              }
            : null;
        this.createdAt = data.createdAt;
    }

    static fromApiResponse(response: any): ReservationDetailModel[] {
        return response.reservations.map((reservation: any) => new ReservationDetailModel(reservation));
    }
}
