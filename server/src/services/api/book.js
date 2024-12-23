import { axiosInstance } from '@/config/config.js';

const API_URL = 'books';

export const getBooks = async () => {
    return (await axiosInstance.get(`/${API_URL}`)).data;
};

export const getBookById = async (id) => {
    return (await axiosInstance.get(`/${API_URL}/${id}`)).data;
};

export const createBook = async (bookData) => {
    return (await axiosInstance.post(`/${API_URL}`, bookData)).data;
};

export const updateBook = async (id, bookData) => {
    return (await axiosInstance.put(`/${API_URL}/${id}`, bookData)).data;
};

export const deleteBook = async (id) => {
    return (await axiosInstance.delete(`/${API_URL}/${id}`)).data;
};

export const getBooksByAuthor = async (authorId) => {
    return (await axiosInstance.get(`/${API_URL}/author/${authorId}`)).data;
};

export const deleteBooksByAuthor = async (authorId) => {
    return (await axiosInstance.delete(`/${API_URL}/author/${authorId}`)).data;
};

export const getBooksByCategory = async (categoryId) => {
    return (await axiosInstance.get(`/${API_URL}/categories/${categoryId}`)).data;
};

export const deleteBooksByCategory = async (categoryId) => {
    return (await axiosInstance.delete(`/${API_URL}/categories/${categoryId}`)).data;
};
