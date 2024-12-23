import { axiosInstance } from '@/config/config.js';

const API_URL = 'authors';

export const getAuthors = async () => {
    return (await axiosInstance.get(`/${API_URL}`)).data;
};

export const getAuthorById = async (id) => {
    return (await axiosInstance.get(`/${API_URL}/${id}`)).data;
};

export const createAuthor = async (authorData) => {
    return (await axiosInstance.post(`/${API_URL}`, authorData)).data;
};

export const updateAuthor = async (id, authorData) => {
    return (await axiosInstance.put(`/${API_URL}/${id}`, authorData)).data;
};

export const deleteAuthor = async (id) => {
    return (await axiosInstance.delete(`/${API_URL}/${id}`)).data;
};
