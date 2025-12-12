import axios from 'axios';
export const API_URL = 'http://localhost:3001/api/v1';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
});

