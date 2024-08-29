// src/models/ServiceModel.ts
export default class ServiceModel {
    _id: string;
    name: string;
    description: string;
    price: number;
    createdAt: string;

    constructor(
        _id: string,
        name: string,
        description: string,
        price: number,
        createdAt: string
    ) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.createdAt = createdAt;
    }

    static fromApiResponse(apiResponse: any): ServiceModel {
        return new ServiceModel(
            apiResponse._id,
            apiResponse.name,
            apiResponse.description,
            apiResponse.price,
            apiResponse.createdAt
        );
    }
}
