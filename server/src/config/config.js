import axios from 'axios';
export const API_URL = 'http://localhost:40000';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
});

