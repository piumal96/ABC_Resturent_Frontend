// models/QueryReportModel.ts

export interface QueryCustomer {
    _id: string;
    email: string;
  }
  
  export interface Query {
    _id: string;
    customer: QueryCustomer;
    subject: string;
    message: string;
    status: 'Pending' | 'Resolved' | 'Closed';
    createdAt: string; // ISO Date string
  }
  
  export interface QueryReportResponse {
    success: boolean;
    message: string;
    queries: Query[];
    totalPages: number;
    currentPage: number;
  }
  