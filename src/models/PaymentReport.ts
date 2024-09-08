import { OrderModel } from './OrderModel';

export interface PaymentReportResponse {
  success: boolean;
  report: {
    totalSales: number;
    totalOrders: number;
    paidOrders: OrderModel[]; 
  };
}
