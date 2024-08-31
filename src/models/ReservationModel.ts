class ReservationModel {
    id: string;
    customer: string;
    restaurant: string;
    service: string;
    date: string;
    time: string;
    type: string;
    deliveryAddress?: string;
    paymentStatus?:string;
    contactNumber?: string;
    specialRequests: string;
    status: string;
    createdAt: string;

    constructor(data: any) {
        this.id = data.id;
        this.customer = data.customer;
        this.restaurant = data.restaurant;
        this.service = data.service;
        this.date = data.date;
        this.time = data.time;
        this.type = data.type;
        this.deliveryAddress = data.type === 'Delivery' ? data.deliveryAddress : undefined;
        this.paymentStatus = data.paymentStatus;
        this.contactNumber = data.type === 'Delivery' ? data.contactNumber : undefined; 
        this.specialRequests = data.specialRequests;
        this.status = data.status;
        this.createdAt = data.createdAt;
    }

    static fromApiResponse(response: any): ReservationModel {
        return new ReservationModel(response);
    }
}

export default ReservationModel;
