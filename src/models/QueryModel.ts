export interface Customer {
    _id: string;
    email: string;
  }
  
  export default interface QueryModel {
    _id: string;                  // The unique identifier for the query
    customer: Customer;           // Detailed information about the customer
    subject: string;              // The subject of the query
    message: string;              // The content/message of the query
    status: 'Pending' | 'Resolved' | 'Closed'; // The status of the query
    createdAt: Date;              // The date and time when the query was created
  }
  