const categoryController = require('../controller/categoryController');

const routes = [
    {
        // Liste toutes les catégories
        pattern: /^\/categories$/,
        method: 'GET',
        handler: (req, res) => {
            categoryController.getAllCategories(req, res);
        }
    },
    {
        // Crée une nouvelle catégorie
        pattern: /^\/categories$/,
        method: 'POST',
        handler: (req, res) => {
            categoryController.createCategory(req, res);
        }
    },
    {
        // Met à jour une catégorie spécifique par ID
        pattern: /^\/categories\/(\d+)$/,
        method: 'PUT',
        handler: (req, res) => {
            categoryController.updateCategory(req, res);
        }
    },
    {
        // Récupère le nombre de livre par catégories
        pattern: /^\/categories\/books\/count$/,
        method: 'GET',
        handler: (req, res) => {
            categoryController.countBooksCategories(req, res);
        }
    },
    {
        // Affiche une catégorie spécifique par ID
        pattern: /^\/categories\/(\d+)$/,
        method: 'GET',
        handler: (req, res) => {
            categoryController.getOneCategory(req, res);
        }
    },
    {
        // Supprime une catégorie spécifique par ID et ses livres associés
        pattern: /^\/categories\/(\d+)$/,
        method: 'DELETE',
        handler: (req, res) => {
            categoryController.deleteCategory(req, res);
        }
    },

];

module.exports = routes;
