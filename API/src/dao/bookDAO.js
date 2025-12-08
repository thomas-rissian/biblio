import { prisma, Prisma } from '../../lib/prisma.js'
import AppError from '../model/AppError.js';
import Book from '../model/Book.js';

function formatDate(date) {
    return date ? new Date(date).toISOString().split('T')[0] : null;
}

class BookDAO {

    /**
     * Récupère tous les livres
     * @returns {Promise<Array>} Liste de livres
     * @throws {AppError} Si une erreur se produit lors de la récupération des livres
     */
    async getAll() {
        try {
            const books = await prisma.book.findMany({
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    categories: true
                }
            });
            return books.map(book => ({
                ...book,
                publicationDate: formatDate(book.publicationDate)
            }));
        } catch (error) {
            this.handlePrismaError(error, 'Erreur lors de la récupération des livres');
        }
    }

    /**
     * Récupère un livre par ID
     * @param {number} id
     * @returns {Promise<Object|null>} Le livre trouvé ou null
     * @throws {AppError} Si une erreur se produit lors de la récupération du livre
     */
    async getById(id) {
        try {
            id = parseInt(id);
            if (isNaN(id)) {
                throw new AppError('ID du livre invalide.', 400);
            }

            const book = await prisma.book.findUnique({
                where: {
                    id: id
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    categories: true
                }
            });

            if (book) {
                book.publicationDate = formatDate(book.publicationDate);
            }

            return book;
        } catch (error) {
            this.handlePrismaError(error, 'Erreur lors de la récupération du livre');
        }
    }

    /**
     * Crée un livre dans la base de données avec des catégories
     * @param {Book} book
     * @returns {Promise<Object>} Le livre créé
     * @throws {AppError} Si une erreur se produit lors de la création du livre
     */
    async create(book) {
        try {
            if (!(book instanceof Book) || book.validate(false).length > 0) {
                throw new AppError("Données de livre invalides.", 400);
            }
            const categoryIds = book.categories;

            const bookJson = book.toJson(false);

            const categoriesConnect = categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0
                ? {
                    categories: {
                        connect: categoryIds.map(id => ({ id }))
                    }
                }
                : {};

            return await prisma.book.create({
                data: {
                    ...bookJson,
                    ...categoriesConnect
                }
            });
        } catch (error) {
            throw this.handlePrismaError(error, 'Erreur lors de la création du livre');
        }
    }

    /**
     * Met à jour un livre avec des catégories
     * @param {Book} book
     * @returns {Promise<Object>} Le livre mis à jour
     * @throws {AppError} Si une erreur se produit lors de la mise à jour du livre
     */
    async update(book) {
        try {
            if (!(book instanceof Book) || book.validate(false).length > 0) {
                throw new AppError("Données de livre invalides.", 400);
            }

            const validCategories = await prisma.category.findMany({
                where: { id: { in: book.categories } },
            });

            if (validCategories.length !== book.categories.length) {
                throw new AppError(
                    `Une ou plusieurs catégories spécifiées n'existent pas.`,
                    400
                );
            }

            return await prisma.book.update({
                where: { id: book.id },
                data: {
                    ...book.toJson(false),
                    categories: {
                        set: validCategories.map((cat) => ({ id: cat.id })), // Réassigne uniquement les catégories valides
                    },
                },
            });

        } catch (error) {
            throw this.handlePrismaError(error, "Erreur lors de la mise à jour du livre");
        }
    }

    /**
     * Supprime un livre
     * @param {number} id
     * @returns {Promise<Object>} Le livre supprimé
     * @throws {AppError} Si une erreur se produit lors de la suppression du livre
     */
    async delete(id) {
        try {
            id = parseInt(id);
            if (isNaN(id)) {
                throw new AppError('ID du livre invalide.', 400);
            }
            const book = await this.getById(id);
            if (!book) {
                throw new AppError("Livre non trouvé", 404);
            }

            return await prisma.book.delete({
                where: { id: id },
            });

        } catch (error) {
            throw this.handlePrismaError(error, "Erreur lors de la suppression du livre");
        }
    }

    /**
     * Supprime des livres d'un auteur
     * @param {number} id
     * @returns {Promise<Object>} Le nombre de livres supprimés
     * @throws {AppError} Si une erreur se produit lors de la suppression des livres
     */
    async deleteByAuthor(id) {
        try {
            id = parseInt(id);
            if (isNaN(id)) {
                throw new AppError('ID de l\'auteur invalide.', 400);
            }

            // Check if author exists
            const author = await prisma.author.findUnique({ where: { id } });
            if (!author) {
                throw new AppError("Aucun auteur trouvé avec cet ID.", 404);
            }

            return await prisma.book.deleteMany({
                where: { authorId: id },
            });
        } catch (error) {
            throw this.handlePrismaError(error, "Erreur lors de la suppression des livres de l'auteur");
        }
    }

    /**
     * Supprime tous les livres associés à une catégorie donnée.
     * @param {number} id - L'ID de la catégorie dont les livres doivent être supprimés.
     * @returns {Promise<void>}
     * @throws {AppError} Si une erreur se produit lors de la suppression des livres.
     */
    async deleteByCategory(id) {
        try {
            id = parseInt(id);
            if (isNaN(id)) {
                throw new AppError('ID de la catégorie invalide.', 400);
            }

            // Check if category exists
            const category = await prisma.category.findUnique({ where: { id } });
            if (!category) {
                throw new AppError("Aucune catégorie trouvée avec cet ID.", 404);
            }

            return await prisma.book.deleteMany({
                where: {
                    categories: {
                        some: {
                            id: id,
                        },
                    },
                },
            });
        } catch (error) {
            throw this.handlePrismaError(error, "Erreur lors de la suppression des livres de la catégorie");
        }
    }

    /**
     * Récupère tous les livres d'une catégorie donnée.
     * @param {number} categoryId - L'ID de la catégorie.
     * @returns {Promise<Array>} Liste des livres de la catégorie.
     * @throws {AppError} Si une erreur se produit lors de la récupération des livres.
     */
    async getBooksByCategory(categoryId) {
        try {
            categoryId = parseInt(categoryId);
            if (isNaN(categoryId)) {
                throw new AppError('ID de la catégorie invalide.', 400);
            }

            return await prisma.book.findMany({
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    categories: true
                },
                where: { categories: { some: { id: categoryId } } },
            });
        } catch (error) {
            this.handlePrismaError(error, 'Erreur lors de la récupération des livres de la catégorie.');
        }
    }
    async getBooksByAuthor(authorId) {
        try {
            authorId = parseInt(authorId);
            return await prisma.book.findMany({
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    categories: true
                },
                where: {
                    authorId: authorId,
                },
            });
        } catch (error) {
            this.handlePrismaError(error, 'Erreur lors de la récupération des livres de l\'auteur.');
        }
    }
    /**
     * Gère les erreurs Prisma et les convertit en erreurs métiers.
     * @param {Error} error - L'erreur levée par Prisma.
     * @param {string} defaultMessage - Message par défaut pour les erreurs non spécifiées.
     * @throws {AppError} - Une erreur personnalisée basée sur le contexte métier.
     */
    handlePrismaError(error, defaultMessage) {
        // If it's already an AppError, rethrow it
        if (error instanceof AppError) {
            throw error;
        }
        
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

export default new BookDAO();
