import  RestaurantModel  from '@/models/RestaurantModel';
import  UserModel  from '@/models/UserModel';
import { CartItemModel } from '@/models/Cart'; // Assume you already have this

export interface OrderModel {
  _id: string;
  customer: UserModel;
  restaurant: RestaurantModel;
  items: CartItemModel[];
  totalPrice: number;
  orderStatus: 'Pending' | 'Confirmed' | 'Delivering' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  deliveryAddress: string;
  createdAt: Date;
}
