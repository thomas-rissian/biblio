const categoryDAO = require('../dao/categoryDAO');
const Category = require('../model/Category');
const AppError = require("../model/AppError");

const handleRequest = async (req, res, callback) => {
    try {
        await callback();
    } catch (error) {
        console.error('Erreur dans le contrôleur :', error);
        const statusCode = error.statusCode || 500;
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message || 'Erreur interne du serveur' }));
    }
};

const readRequestBody = (req) => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', (err) => reject(err));
});

const getAllCategories = async (req, res) =>
    handleRequest(req, res, async () => {
        const categories = await categoryDAO.getAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(categories));
    });

const getOneCategory = async (req, res) =>
    handleRequest(req, res, async () => {
        const id = parseInt(req.url.split('/')[2]);
        const category = await categoryDAO.getById(id);
        if (category) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(category));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Catégorie non trouvée.' }));
        }
    });

const createCategory = async (req, res) =>
    handleRequest(req, res, async () => {
        const body = await readRequestBody(req);
        const data = JSON.parse(body);
        const category = new Category(data);
        const newCategory = await categoryDAO.create(category);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newCategory));

});

const updateCategory = async (req, res) =>
    handleRequest(req, res, async () => {
        const id = parseInt(req.url.split('/')[2]);
        const body = await readRequestBody(req);
        const data = JSON.parse(body);
        data.id = id;
        const categories = new Category(data);
        const updatedCategory = await categoryDAO.update(categories);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedCategory));
    });
const deleteCategory = async (req, res) =>
    handleRequest(req, res, async () => {
        const id = parseInt(req.url.split('/')[2]);
        await categoryDAO.delete(id);
        res.writeHead(200);
        res.end();
    });

const deleteCategoryAndManageBooks = async (req, res) =>
    handleRequest(req, res, async () => {
        const id = parseInt(req.url.split('/')[2]);
        await categoryDAO.delete(id);
        res.writeHead(200);
        res.end();
    });
const countBooksCategories = async (req, res) =>
    handleRequest(req, res, async () => {
       const categories = await categoryDAO.getCategoriesBookCount();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(categories));
    });
module.exports = {
    getAllCategories,
    getOneCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    deleteCategoryAndManageBooks,
    countBooksCategories
};
