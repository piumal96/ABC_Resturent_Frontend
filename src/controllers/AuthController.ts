import AuthService from '../services/authService';
import UserModel from '../models/UserModel';

const AuthController = {
  login: async (email: string, password: string): Promise<UserModel> => {
    try {
      const loginResponse = await AuthService.login(email, password);
      // You can add additional processing here if needed
      return UserModel.fromApiResponse(loginResponse);
    } catch (error) {
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  },

  register: async (username: string, email: string, password: string, role: string): Promise<UserModel> => {
    try {
      const registerResponse = await AuthService.register(username, email, password, role);
      // You can add additional processing here if needed
      return UserModel.fromApiResponse(registerResponse);
    } catch (error) {
      throw new Error('Registration failed. Please check your details and try again.');
    }
  },

  getUserDetails: async (userId: string): Promise<UserModel> => {
    try {
      const userDetails = await AuthService.getUserDetails(userId);
      // You can add additional processing here if needed
      return UserModel.fromApiResponse(userDetails);
    } catch (error) {
      throw new Error('Failed to fetch user details.');
    }
  },

  updateUser: async (userId: string, userData: Partial<UserModel>): Promise<UserModel> => {
    try {
      const updatedUser = await AuthService.updateUser(userId, userData);
      // You can add additional processing here if needed
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update user.');
    }
  },

  deleteUser: async (userId: string): Promise<boolean> => {
    try {
      return await AuthService.deleteUser(userId);
    } catch (error) {
      throw new Error('Failed to delete user.');
    }
  },

  logout: (): void => {
    AuthService.logout();
  },

  getCurrentUser: (): UserModel | null => {
    const currentUser = AuthService.getCurrentUser();
    return currentUser ? UserModel.fromApiResponse(currentUser) : null;
  },
};

export default AuthController;
