// src/models/RestaurantModel.ts
export default class RestaurantModel {
    _id: string;
    name: string;
    location: string;
    address: string;
    phone: string;
    description: string;
    facilities: string[];
    images: string[];
    createdAt: string;
    updatedAt: string;

    constructor(
        _id: string,
        name: string,
        location: string,
        address: string,
        phone: string,
        description: string,
        facilities: string[],
        images: string[],
        createdAt: string,
        updatedAt: string
    ) {
        this._id = _id;
        this.name = name;
        this.location = location;
        this.address = address;
        this.phone = phone;
        this.description = description;
        this.facilities = facilities;
        this.images = images;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromApiResponse(apiResponse: any): RestaurantModel {
        return new RestaurantModel(
            apiResponse._id,
            apiResponse.name,
            apiResponse.location,
            apiResponse.address,
            apiResponse.phone,
            apiResponse.description,
            apiResponse.facilities,
            apiResponse.images,
            apiResponse.createdAt,
            apiResponse.updatedAt
        );
    }
}
