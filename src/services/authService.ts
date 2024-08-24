import axios from 'axios';

const API_URL = 'http://localhost:5001/api/';

const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}auth/login`, { email, password });
        return response.data;
    } catch (error) {
        throw new Error('Login failed. Please check your credentials and try again.');
    }
};

const register = async (username: string, email: string, password: string, role: string) => {
    try {
        const response = await axios.post(`${API_URL}users/register`, { username, email, password, role });
        return response.data;
    } catch (error: any) {
        console.error('Error during registration:', error.response ? error.response.data : error.message);
        throw new Error('Registration failed. Please check your details and try again.');
    }
};


export default {
    login,
    register, // Exporting the new register function
};
