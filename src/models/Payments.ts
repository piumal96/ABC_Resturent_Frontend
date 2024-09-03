export interface PaymentModel { 
    id: string;
    customer: string;
    reservation: string;
    amount: number;
    status: 'Pending' | 'Paid' | 'Failed';  
    paymentDate: string;
  }