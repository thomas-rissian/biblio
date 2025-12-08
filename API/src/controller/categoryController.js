import categoryDAO from '../dao/categoryDAO.js';
import Category from '../model/Category.js';
import AppError from "../model/AppError.js";

const handleRequest = async (req, res, callback) => {
    try {
        await callback(req, res);
    } catch (error) {
        console.error('Erreur dans le contrôleur :', error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message || 'Erreur interne du serveur' });
    }
};

const getAllCategories = async (req, res) =>
    handleRequest(req, res, async (req, res) => {
        const DEFAULT_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 10;
        const MAX_PAGE_SIZE = 100;
        let { page, pageSize } = req.query;
        // Set defaults when is not provided
        if (page === undefined) {
            page = DEFAULT_PAGE;
        }
        if (pageSize === undefined) {
            pageSize = DEFAULT_PAGE_SIZE;
        }
        if (page !== undefined) {
            page = parseInt(page);
            if (isNaN(page) || page < 1) {
                throw new AppError('Paramètre `page` invalide', 400);
            }
        }
        if (pageSize !== undefined) {
            pageSize = parseInt(pageSize);
            if (isNaN(pageSize) || pageSize < 1 ) {
                throw new AppError('Paramètre `pageSize` invalide (1 - ' + MAX_PAGE_SIZE + ')', 400);
            }
        }
        const categories = await categoryDAO.getAll({ page: Number(page), pageSize: Number(pageSize) });
        res.status(200).json(categories);
    });

const getOneCategory = async (req, res) =>
    handleRequest(req, res, async (req, res) => {
        const { id } = req.params;
        const category = await categoryDAO.getById(parseInt(id));
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ message: 'Catégorie non trouvée.' });
        }
    });

const createCategory = async (req, res) =>
    handleRequest(req, res, async (req, res) => {
        const data = req.body;
        const category = new Category(data);
        const newCategory = await categoryDAO.create(category);
        res.status(201).json(newCategory);
    });

const updateCategory = async (req, res) =>
    handleRequest(req, res, async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        data.id = parseInt(id);
        const categories = new Category(data);
        const updatedCategory = await categoryDAO.update(categories);
        res.status(200).json(updatedCategory);
    });

const deleteCategory = async (req, res) =>
    handleRequest(req, res, async (req, res) => {
        const { id } = req.params;
        await categoryDAO.delete(parseInt(id));
        res.status(200).end();
    });

const deleteCategoryAndManageBooks = async (req, res) =>
    handleRequest(req, res, async (req, res) => {
        const { id } = req.params;
        await categoryDAO.delete(parseInt(id));
        res.status(200).end();
    });

const countBooksCategories = async (req, res) =>
    handleRequest(req, res, async (req, res) => {
       const categories = await categoryDAO.getCategoriesBookCount();
        res.status(200).json(categories);
    });

export {
    getAllCategories,
    getOneCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    deleteCategoryAndManageBooks,
    countBooksCategories
};
