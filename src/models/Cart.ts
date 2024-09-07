import { DishModel } from '../models/Dish Model'; 

// Interface for individual customization options in a cart item
export interface CustomizationOptions {
    [key: string]: string; 
}

// Interface for individual cart items
export interface CartItemModel {
    _id: string;                         
    dish: DishModel;                     
    quantity: number;                    
    customizations: CustomizationOptions; 
    totalPrice: number;                  
}

// Interface for the entire cart
export interface CartModel {
    _id?: string;                         
    customer?: string;                    
    items: CartItemModel[];               
    totalPrice: number;                   
    __v?: number;                         
}
