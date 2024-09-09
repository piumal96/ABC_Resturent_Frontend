class UserModelRole {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    sessionId?: string;
  
    constructor(_id: string, username: string, email: string, role: string, createdAt: string, sessionId?: string) {
        this._id = _id;
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
  
    static fromApiResponse(apiResponse: any): UserModelRole {
        if (!apiResponse || !apiResponse.user || !apiResponse.user.id) {
            throw new Error('Invalid API response: Missing user data');
        }
  
        return new UserModelRole(
            apiResponse.user._id,
            apiResponse.user.username,
            apiResponse.user.email,
            apiResponse.user.role,
            apiResponse.user.createdAt,
            apiResponse.sessionId
        );
    }
  }
  
  export default UserModelRole;
  