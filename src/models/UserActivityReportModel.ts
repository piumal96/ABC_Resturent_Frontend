// models/UserActivityReportModel.ts

export interface User {
    _id: string;
    email: string;
    role: 'Customer' | 'Staff' | 'Admin';
    createdAt: string; // ISO Date string
  }
  
  export interface UserActivityReportResponse {
    success: boolean;
    message: string;
    users: User[];
    totalPages: number;
    currentPage: number;
  }
  