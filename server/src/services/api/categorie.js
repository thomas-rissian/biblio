import { axiosInstance } from '@/config/config.js';

const API_URL = 'categories';

export const getCategories = async () => {
    return (await axiosInstance.get(`/${API_URL}`)).data;
};

export const getCategoryById = async (id) => {
    return (await axiosInstance.get(`/${API_URL}/${id}`)).data;
};

export const createCategory = async (categoryData) => {
    return (await axiosInstance.post(`/${API_URL}`, categoryData)).data;
};

export const updateCategory = async (id, categoryData) => {
    return (await axiosInstance.put(`/${API_URL}/${id}`, categoryData)).data;
};
export const deleteCategory = async (id) => {
    return (await axiosInstance.delete(`/${API_URL}/${id}`)).data;
};
