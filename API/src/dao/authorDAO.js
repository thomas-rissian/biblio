const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const AppError = require('../model/AppError');
const Author = require('../model/Author');
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
            if (!(author instanceof Author) || author.validate(false).length > 0) {
                console.log(author);
                throw new AppError("Données d'auteur invalides.", 400);
            }
            const authorData = author.toJson(false);
            return await prisma.author.create({
                data: authorData,
            });
        } catch (error) {
            this.handlePrismaError(error, 'Erreur lors de la création de l\'auteur.');
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
            return authors.map(author => ({
                ...author,
                birthDate: formatDate(author.birthDate),
                deathDate: formatDate(author.deathDate),
            }));
        } catch (error) {
            this.handlePrismaError(error, 'Erreur lors de la récupération des auteurs.');
        }
    }

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
                author.birthDate = formatDate(author.birthDate);
                author.deathDate = formatDate(author.deathDate);
            }

            return author;
        } catch (error) {
            this.handlePrismaError(error, 'Erreur lors de la récupération de l\'auteur.');
        }
    }

    /**
     * Met à jour un auteur
     * @param {Author} author
     * @returns {Promise<Object>} L'auteur mis à jour
     * @throws {AppError} Si une erreur se produit lors de la mise à jour
     */
    async update(author) {
        try {
            if (!(author instanceof Author) || author.validate(false).length > 0) {
                throw new AppError("Données d'auteur invalides.", 400);
            }
            const id = parseInt(author.id);

            if (isNaN(id)) {
                throw new AppError("ID d'auteur invalide.", 400);
            }
            const data = author.toJson();
            return await prisma.author.update({
                where: { id },
                data,
            });
        } catch (error) {
            this.handlePrismaError(error, 'Erreur lors de la mise à jour de l\'auteur.');
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
            return await prisma.author.delete({
                where: { id },
            });
        } catch (error) {
            this.handlePrismaError(error, 'Erreur lors de la suppression de l\'auteur.');
        }
    }
    /**
     * Gère les erreurs Prisma et les convertit en erreurs métiers.
     * @param {Error} error - L'erreur levée par Prisma.
     * @param {string} defaultMessage - Message par défaut pour les erreurs non spécifiées.
     * @throws {AppError} - Une erreur personnalisée basée sur le contexte métier.
     */
    handlePrismaError(error, defaultMessage) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':
                    throw new AppError("Une entrée avec ces données existe déjà.", 409);
                case 'P2025':
                    throw new AppError("Aucune correspondance trouvée pour cette requête.", 404);
                case 'P2003':
                    throw new AppError("Violation de contrainte de clé étrangère.", 400);
                default:
                    throw new AppError(defaultMessage, 500);
            }
        }
        throw new AppError(defaultMessage, 400);
    }
}

module.exports = new AuthorDAO();
