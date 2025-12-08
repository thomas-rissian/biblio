// bookController.js
import bookDAO from '../dao/bookDAO.js';
import BookModel from '../model/Book.js';
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

const getAllBooks = (req, res) => handleRequest(req, res, async () => {
    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 10;
    const MAX_PAGE_SIZE = 100;
    let { page, pageSize } = req.query;
    // Set defaults when not provided
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
        if (isNaN(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
            throw new AppError('Paramètre `pageSize` invalide (1 - ' + MAX_PAGE_SIZE + ')', 400);
        }
    }
    const books = await bookDAO.getAll({ page: Number(page), pageSize: Number(pageSize) });
    res.status(200).json(books);
});

const getOneBook = (req, res) => handleRequest(req, res, async () => {
    const { id } = req.params;
    const book = await bookDAO.getById(id);
    if (!book) {
        throw new AppError('Livre non trouvé', 404);
    }
    res.status(200).json(book);
});

const createBook = (req, res) => handleRequest(req, res, async () => {
    const data = req.body;
    const bookModel = new BookModel(data);
    const book = await bookDAO.create(bookModel);
    res.status(201).json(book);
});

const updateBook = (req, res) => handleRequest(req, res, async () => {
    const { id } = req.params;
    const data = req.body;
    data.id = parseInt(id);

    const bookModel = new BookModel(data);
    const updatedBook = await bookDAO.update(bookModel);
    res.status(200).json(updatedBook);
});

const deleteBook = (req, res) => handleRequest(req, res, async () => {
    const { id } = req.params;
    if (!id) {
        throw new AppError('ID du livre manquant', 400);
    }
    const deletedBook = await bookDAO.delete(id);
    if (!deletedBook) {
        throw new AppError('Livre non trouvé', 404);
    }
    res.status(200).json({ message: 'Livre supprimé avec succès' });
});

const deleteBooksByAuthor = (req, res) => handleRequest(req, res, async () => {
    const { authorId } = req.params;
    if (!authorId || authorId.length === 0) {
        throw new AppError('Id de l\'auteur manquant', 400);
    }
    const deletedBooks = await bookDAO.deleteByAuthor(authorId);
    if (deletedBooks === 0) {
        throw new AppError('Aucun livre trouvé pour cet auteur', 404);
    }
    res.status(200).json({ message: 'Livres supprimés avec succès' });
});

const deleteBooksByCategory = (req, res) => handleRequest(req, res, async () => {
    const { categoryId } = req.params;
    if (!categoryId || categoryId.length === 0) {
        throw new AppError('Id de la catégorie manquant', 400);
    }
    const deletedBooks = await bookDAO.deleteByCategory(categoryId);
    if (!deletedBooks) {
        throw new AppError('Aucun livre trouvé pour cette catégorie', 404);
    }
    res.status(200).json({ message: 'Livres supprimés avec succès' });
});

const getBooksByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!categoryId) {
            return res.status(400).json({message: 'ID de la catégorie manquant'});
        }

        const books = await bookDAO.getBooksByCategory(categoryId);

        if (books.length === 0) {
            return res.status(404).json({message: 'Aucun livre trouvé pour cette catégorie'});
        }

        res.status(200).json(books);
    } catch (error) {
        console.error('Erreur dans le contrôleur :', error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message || 'Erreur interne du serveur' });
    }
};

const getBooksByAuthor = async (req, res) => {
    try {
        const { authorId } = req.params;

        if (!authorId) {
            return res.status(400).json({message: 'ID de l\'auteur manquant'});
        }

        const books = await bookDAO.getBooksByAuthor(authorId);

        if (books.length === 0) {
            return res.status(404).json({message: 'Aucun livre trouvé pour cet auteur'});
        }

        res.status(200).json(books);
    } catch (error) {
        console.error('Erreur dans le contrôleur :', error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message || 'Erreur interne du serveur' });
    }
};

export {
    getAllBooks,
    getOneBook,
    createBook,
    updateBook,
    deleteBook,
    deleteBooksByCategory,
    deleteBooksByAuthor,
    getBooksByAuthor,
    getBooksByCategory,
};