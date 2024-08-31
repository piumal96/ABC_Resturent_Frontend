
export interface OfferModel {
    _id: string;
    title: string; 
    description: string; 
    discountPercentage: number; 
    validFrom: Date;
    validTo: Date; 
    createdAt: Date; 
}