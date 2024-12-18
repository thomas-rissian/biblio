const authorController = require("../controller/authorController");
const authorRoutes = [
    {
        // Gère '/authors' en GET pour lister tous les auteurs
        pattern: /^\/authors$/,
        method: 'GET',
        handler: (req, res) => {
            authorController.getAllAuthors(req, res);
        }
    },
    {
        // Gère '/authors' en POST pour créer un nouvel auteur
        pattern: /^\/authors$/,
        method: 'POST',
        handler: (req, res) => {
            authorController.createAuthor(req, res);
        }
    },
    {
        // Gère '/authors/:id' en GET pour récupérer un auteur spécifique
        pattern: /^\/authors\/(\d+)$/,
        method: 'GET',
        handler: (req, res) => {
            authorController.getOneAuthor(req, res);
        }
    },
    {
        // Gère '/author/:id' en PUT pour mettre à jour un auteur spécifique
        pattern: /^\/authors\/(\d+)$/,
        method: 'PUT',
        handler: (req, res, match) => {
            authorController.updateAuthor(req, res, match[1]);
        }
    },
    {
        // Gère '/author/:id' en DELETE pour supprimer un auteur spécifique
        pattern: /^\/authors\/(\d+)$/,
        method: 'DELETE',
        handler: (req, res, match) => {
            authorController.deleteAuthor(req, res, match[1]);
        }
    }

];

module.exports = authorRoutes;
