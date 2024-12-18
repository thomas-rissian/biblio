// bookController.js
const bookDAO = require('../dao/bookDAO');
const BookModel = require('../model/Book');
const AppError = require('../model/AppError');

const handleRequest = async (req, res, callback) => {
    try {
        await callback(req, res);
    } catch (error) {
        console.error('Erreur dans le contrôleur :', error);
        const statusCode = error.statusCode || 500;
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message || 'Erreur interne du serveur' }));
    }
};

const getAllBooks = (req, res) => handleRequest(req, res, async () => {
    const books = await bookDAO.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(books));
});

const getOneBook = (req, res, id) => handleRequest(req, res, async () => {
    const book = await bookDAO.getById(id);
    if (!book) {
        throw new AppError('Livre non trouvé', 404);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(book));
});

const createBook = (req, res) => handleRequest(req, res, async () => {
    const body = await readRequestBody(req);
    const data = JSON.parse(body);

    const bookModel = new BookModel(data);
    const validationErrors = bookModel.validate(false);

    if (validationErrors.length > 0) {
        throw new AppError(validationErrors.join(", "), 400);
    }
    const book = await bookDAO.create(bookModel);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(book));
});

const updateBook = async (req, res) => {
    try {

        const body = await readRequestBody(req);
        const data = JSON.parse(body);
        data.id = parseInt(req.url.split('/')[2]);

        const bookModel = new BookModel(data);
        const validationErrors = bookModel.validate(true);
        if (validationErrors.length > 0) {
            throw new AppError(`Erreurs de validation : ${validationErrors.join(', ')}`, 400);
        }

        const updatedBook = await bookDAO.update(bookModel);
        if (!updatedBook) {
            throw new AppError('Livre non trouvé', 404);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedBook));
    } catch (error) {
        const statusCode = error instanceof AppError ? error.statusCode : 500;
        const message = error instanceof AppError ? error.message : 'Erreur interne du serveur';

        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: message }));
    }
};

const deleteBook = (req, res) => handleRequest(req, res, async () => {
    const bookId = req.url.split('/')[2];
    if (!bookId) {
        throw new AppError('ID du livre manquant', 400);
    }
    const deletedBook = await bookDAO.delete(bookId);
    if (!deletedBook) {
        throw new AppError('Livre non trouvé', 404);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Livre supprimé avec succès' }));
});

const deleteBooksByAuthor = (req, res) => handleRequest(req, res, async () => {
    const authorId = req.url.split('/')[3];
    if (!authorId || authorId.length === 0) {
        throw new AppError('Id de l\'auteur manquant', 400);
    }
    const deletedBooks = await bookDAO.deleteByAuthor(authorId);
    if (deletedBooks === 0) {
        throw new AppError('Aucun livre trouvé pour cet auteur', 404);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Livres supprimés avec succès' }));
});

const deleteBooksByCategory = (req, res) => handleRequest(req, res, async () => {
    const categoryId = req.url.split('/')[3];
    if (!categoryId || categoryId.length === 0) {
        throw new AppError('Id de la catégorie manquant', 400);
    }
    const deletedBooks = await bookDAO.deleteByCategory(categoryId);
    if (deletedBooks === 0) {
        throw new AppError('Aucun livre trouvé pour cette catégorie', 404);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Livres supprimés avec succès' }));
});

const getBooksByCategory = async (req, res) => {
    const urlParts = req.url.split('/');
    const categoryId = urlParts[3];

    if (!categoryId) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'ID de la catégorie manquant'}));
        return;
    }

    const books = await bookDAO.getBooksByCategory(categoryId);

    if (books.length === 0) {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Aucun livre trouvé pour cette catégorie'}));
        return;
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(books));
};

const getBooksByAuthor = async (req, res) => {
    const urlParts = req.url.split('/');
    const authorId = urlParts[3];

    if (!authorId) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'ID de l\'auteur manquant'}));
        return;
    }

    const books = await bookDAO.getBooksByAuthor(authorId);

    if (books.length === 0) {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Aucun livre trouvé pour cet auteur'}));
        return;
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(books));
};

const readRequestBody = (req) => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', (err) => reject(err));
});

module.exports = {
    getAllBooks,
    getOneBook,
    createBook,
    updateBook,
    deleteBook,
    deleteBooksByCategory,
    deleteBooksByAuthor,
    getBooksByAuthor,
    getBooksByCategory
};