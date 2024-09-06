// models/Dish.ts

export interface CustomizationModel {
    name: string;               
    options: string[];         
    price: number;             
}

export interface DishModel {
    _id: string;                
    name: string;               
    description: string;       
    price: number;              
    category: 'Starter' | 'Main Course' | 'Dessert' | 'Drinks';  
    customizations: CustomizationModel[]; 
    imageUrl: string;           
}
