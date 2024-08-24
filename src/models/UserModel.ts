// src/models/UserModel.ts

class UserModel {
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
  
    constructor(id: string, username: string, email: string, role: string, createdAt: string) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.role = role;
      this.createdAt = createdAt;
    }
  
    // Utility methods can be added here if needed
    // For example, formatting the user's registration date
    getFormattedDate(): string {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(this.createdAt).toLocaleDateString(undefined, options);
    }
  
    static fromApiResponse(apiResponse: any): UserModel {
      return new UserModel(
        apiResponse._id,
        apiResponse.username,
        apiResponse.email,
        apiResponse.role,
        apiResponse.createdAt
      );
    }
  }
  
  export default UserModel;
  