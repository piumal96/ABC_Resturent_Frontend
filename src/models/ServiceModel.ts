// src/models/ServiceModel.ts

export default class ServiceModel {
    _id: string;             // MongoDB ObjectId as a string
    name: string;            // Name of the service
    description: string;     // Description of the service
    price: number;           // Price of the service
    createdAt: Date;         // Date the service was created
  
    constructor(serviceData: {
      _id: string;
      name: string;
      description: string;
      price: number;
      createdAt: Date;
    }) {
      this._id = serviceData._id;
      this.name = serviceData.name;
      this.description = serviceData.description;
      this.price = serviceData.price;
      this.createdAt = serviceData.createdAt;
    }
  }
  