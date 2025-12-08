import authorDAO from '../dao/authorDAO.js';
import Author from '../model/Author.js';
import AppError from '../model/AppError.js';

const handleRequest = async (req, res, callback) => {
    try {
        await callback(req, res);
    } catch (error) {
        console.error('Erreur dans le contrôleur :', error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message || 'Erreur interne du serveur' });
    }
};

const getAllAuthors = async (req, res) => handleRequest(req, res, async() => {
        const DEFAULT_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 10;
        const MAX_PAGE_SIZE = 100;
        let { page, pageSize } = req.query;
        // If the client didn't provide pagination, default to defaults
        // Set defaults when not provided
        if (page === undefined) {
            page = DEFAULT_PAGE;
        }
        if (pageSize === undefined) {
            pageSize = DEFAULT_PAGE_SIZE;
        }
        // If provided parse and validate
        if (page !== undefined) {
            page = parseInt(page);
            if (isNaN(page) || page < 1) {
                throw new AppError('Paramètre `page` invalide', 400);
            }
        }
        if (pageSize !== undefined) {
            pageSize = parseInt(pageSize);
            if (isNaN(pageSize) || pageSize < 1) {
                throw new AppError('Paramètre `pageSize` invalide (1 - ' + MAX_PAGE_SIZE + ')', 400);
            }
        }
        const authors = await authorDAO.getAll({ page: Number(page), pageSize: Number(pageSize) });
        res.status(200).json(authors);
});

const createAuthor = async (req, res) => handleRequest(req, res, async () => {
        const data = req.body;
        const newAuthor = await authorDAO.create(new Author(data));
        res.status(201).json(newAuthor);
});

const getOneAuthor = async (req, res) =>  handleRequest(req, res, async () => {
    const { id } = req.params;
    const author = await authorDAO.getById(parseInt(id));
    if (author) {
        res.status(200).json(author);
    } else {
        res.status(404).json({ message: 'Auteur non trouvé.' });
    }
});

const updateAuthor = async (req, res) =>  handleRequest(req, res, async () => {
    const { id } = req.params;
    const data = req.body;
    data.id = parseInt(id);
    const updatedAuthor = await authorDAO.update(new Author(data));
    res.status(200).json(updatedAuthor);
});

const deleteAuthor = async (req, res) =>  handleRequest(req, res, async () => {
    const { id } = req.params;
    await authorDAO.delete(parseInt(id));
    res.status(204).end();
});

export {
    getAllAuthors,
    createAuthor,
    getOneAuthor,
    updateAuthor,
    deleteAuthor,
};
