const bookController = require("../controller/bookController");

const bookRoutes = [
    {
        pattern: /^\/books$/,         // Gère '/books' en GET pour lister les livres
        method: 'GET',
        handler: (req, res) => {
            bookController.getAllBooks(req, res);
        }
    },
    {
        pattern: /^\/books\/(\d+)$/,  // Gère '/books/:id' en GET pour afficher un livre spécifique
        method: 'GET',
        handler: (req, res, match) => {
            bookController.getOneBook(req, res, match[1]);
        }
    },
    {
        pattern: /^\/books$/,         // Gère '/books' en POST pour créer un livre
        method: 'POST',
        handler: (req, res) => {
            bookController.createBook(req, res);
        }
    },
    {
        pattern: /^\/books\/(\d+)$/,  // Gère '/books/:id' en PUT pour mettre à jour un livre
        method: 'PUT',
        handler: (req, res, match) => {
            bookController.updateBook(req, res);
        }
    },
    {
        pattern: /^\/books\/(\d+)$/,  // Gère '/books/:id' en DELETE pour supprimer un livre
        method: 'DELETE',
        handler: (req, res, match) => {
            bookController.deleteBook(req, res);
        }
    },
    {
        pattern: /^\/books\/author\/([^/]+)$/,  // Gère '/books/author/:authorId' en DELETE pour supprimer tous les livres d'un auteur
        method: 'DELETE',
        handler: (req, res, match) => {
            const authorName = match[1];
            bookController.deleteBooksByAuthor(req, res, authorName);
        }
    },
    {
        pattern: /^\/books\/categories\/([^/]+)$/,  // Gère '/books/category/:categoryId' en DELETE pour supprimer tous les livres d'une catégorie
        method: 'DELETE',
        handler: (req, res, match) => {
            const categoryName = match[1];
            bookController.deleteBooksByCategory(req, res, categoryName);
        }
    },
    {
        pattern: /^\/books\/author\/(\d+)$/, // Gère '/books/author/:authorId' en GET pour lister les livres d'un auteur
        method: 'GET',
        handler: (req, res, match) => {
            bookController.getBooksByAuthor(req, res);
        },
    },
    {
        pattern: /^\/books\/categories\/(\d+)$/, // Gère '/books/category/:categoryId' en GET pour lister les livres d'une catégorie
        method: 'GET',
        handler: (req, res, match) => {
            bookController.getBooksByCategory(req, res);
        },
    },


];

module.exports = bookRoutes;
