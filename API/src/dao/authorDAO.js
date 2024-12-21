const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AppError = require('../model/AppError'); // Assurez-vous que cette classe gère les erreurs
const Author = require('../model/Author'); // Créez une classe modèle Author similaire à Book
const BookDAO = require('../dao/bookDAO');

function formatDate(date) {
    return date ? new Date(date).toISOString().split('T')[0] : null;
}

class AuthorDAO {
    /**
     * Crée un nouvel auteur
     * @param {Author} author
     * @returns {Promise<Object>} L'auteur créé
     * @throws {AppError} Si une erreur se produit lors de la création
     */
    async create(author) {
        try {
            if (!(author instanceof Author) || author.validate(false).length >0) {
                throw new AppError("Données d'auteur invalides.", 400);
            }
            const authorData = author.toJson(false);
            return await prisma.author.create({
                data: authorData,
            });

        } catch (error) {
            console.error(error);
            throw new AppError('Erreur lors de la création de l\'auteur.', 500);
        }
    }

    /**
     * Récupère tous les auteurs
     * @returns {Promise<Array>} Liste des auteurs
     * @throws {AppError} Si une erreur se produit lors de la récupération
     */
    async getAll() {
        try {
            const authors = await prisma.author.findMany();

            // Formater les dates pour chaque auteur
            return authors.map(author => ({
                ...author,
                birthDate: formatDate(author.birthDate),
                deathDate: formatDate(author.deathDate),
            }));
        } catch (error) {
            console.error(error);
            throw new AppError('Erreur lors de la récupération des auteurs.', 500);
        }
    };

    /**
     * Récupère un auteur par ID
     * @param {number} id
     * @returns {Promise<Object|null>} L'auteur trouvé ou null
     * @throws {AppError} Si une erreur se produit lors de la récupération
     */
    async getById(id) {
        try {
            id = parseInt(id);
            if (isNaN(id)) {
                throw new AppError("ID d'auteur invalide.", 400);
            }

            const author = await prisma.author.findUnique({
                where: { id },
            });

            if (author) {
                // Formater les dates avant de retourner l'objet
                author.birthDate = formatDate(author.birthDate);
                author.deathDate = formatDate(author.deathDate);
            }

            return author;
        } catch (error) {
            console.error(error);
            throw new AppError('Erreur lors de la récupération de l\'auteur.', 500);
        }
    };


    /**
     * Met à jour un auteur
     * @param {Author} author
     * @returns {Promise<Object>} L'auteur mis à jour
     * @throws {AppError} Si une erreur se produit lors de la mise à jour
     */
    async update(author) {
        try {
            const id = parseInt(author.id);

            if (isNaN(id) && author.validate().length >0) {
                throw new AppError("ID d'auteur invalide.", 400);
            }
            const data = author.toJson();
            return await prisma.author.update({
                where: {id},
                data,
            });
        } catch (error) {
            console.error(error);
            throw new AppError('Erreur lors de la mise à jour de l\'auteur.', 500);
        }
    }

    /**
     * Supprime un auteur
     * @param {number} id
     * @returns {Promise<void>}
     * @throws {AppError} Si une erreur se produit lors de la suppression
     */
    async delete(id) {
        try {
            id = parseInt(id);
            if (isNaN(id)) {
                throw new AppError("ID d'auteur invalide.", 400);
            }
            await BookDAO.deleteByAuthor(id);
            await prisma.author.delete({
                where: { id },
            });
        } catch (error) {
            console.error(error);
            if (error.code === 'P2003') {
                throw new AppError(
                    'Impossible de supprimer cet auteur car il est lié à d\'autres enregistrements.',
                    400
                );
            }
            console.log(error)
            throw new AppError('Erreur lors de la suppression de l\'auteur.', 500);
        }
    }
}

module.exports = new AuthorDAO();
