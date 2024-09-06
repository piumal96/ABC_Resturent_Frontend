// models/Cart.ts

import { DishModel } from '../models/Dish Model';  

export interface CartItemModel {
    dish: DishModel;             
    quantity: number;            
    customizations: Record<string, string>;  
    totalPrice: number;          
}

export interface CartModel {
    items: CartItemModel[];      
    totalPrice: number;          
}
