class UserModel {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  sessionId?: string;

  constructor(id: string, username: string, email: string, role: string, createdAt: string, sessionId?: string) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.role = role;
      this.createdAt = createdAt;
      this.sessionId = sessionId;
  }

  getFormattedDate(): string {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(this.createdAt).toLocaleDateString(undefined, options);
  }

  static fromApiResponse(apiResponse: any): UserModel {
      if (!apiResponse || !apiResponse.user || !apiResponse.user.id) {
          throw new Error('Invalid API response: Missing user data');
      }

      return new UserModel(
          apiResponse.user.id,
          apiResponse.user.username,
          apiResponse.user.email,
          apiResponse.user.role,
          apiResponse.user.createdAt,
          apiResponse.sessionId
      );
  }
}

export default UserModel;
