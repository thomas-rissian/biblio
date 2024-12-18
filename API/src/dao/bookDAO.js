const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const AppError = require('../model/AppError');
const Book = require('../model/Book');

function formatDate(date) {
    return date ? new Date(date).toISOString().split('T')[0] : null;
}

class BookDAO {


    /**
     * Récupère un livre par ID
     * @returns {Promise<Object|null>} Liste de livre
     * @throws {AppError} Si une erreur se produit lors de la récupération du livre
     */
    async getAll() {
        try {
            const books = await prisma.book.findMany({
                include: {
                    categories: true // Inclure les catégories dans la réponse
                }
            });

            // Formater les dates pour chaque livre
            return books.map(book => ({
                ...book,
                publicationDate: formatDate(book.publicationDate)
            }));
        } catch (error) {
            throw new AppError('Erreur lors de la récupération du livre', 500);
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
            const book = await prisma.book.findUnique({
                where: {
                    id: id
                },
                include: { // Inclure les catégories dans la réponse
                    categories: true
                }
            });
            if (book) {
                // Formater les dates avant de retourner le résultat
                book.publicationDate = formatDate(book.publicationDate);
            }

            return book;
        } catch (error) {
            throw new AppError('Erreur lors de la récupération du livre', 500);
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
            // Assurez-vous que bookData est une instance de Book
            if (!(book instanceof Book)) {
                throw new AppError("Données de livre invalides.", 400);
            }

            const categoryIds = book.categories; // Utiliser le getter "categories"

            const bookJson = book.toJson(false);

            // Vérifie si categoryIds est défini et s'il contient des éléments
            const categoriesConnect = categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0
                ? {
                    categories: {
                        connect: categoryIds.map(id => ({ id }))
                    }
                }
                : {};

            // Création du livre dans la base de données avec Prisma
            return await prisma.book.create({
                data: {
                    ...bookJson, // Les autres données du livre
                    ...categoriesConnect // Ajouter les catégories connectées si elles existent
                }
            });

        } catch (error) {
            throw new AppError('Erreur lors de la création du livre', 400);
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
            // Vérifiez les catégories spécifiées
            const validCategories = await prisma.category.findMany({
                where: { id: { in: book.categories } },
            });

            if (validCategories.length !== book.categories.length) {
                throw new AppError(
                    `Une ou plusieurs catégories spécifiées n'existent pas.`,
                    400
                );
            }

            // Réattribuez les catégories et mettez à jour les autres champs
            const updatedBook = await prisma.book.update({
                where: { id: book.id },
                data: {
                    ...book.toJson(false),
                    categories: {
                        set: validCategories.map((cat) => ({ id: cat.id })), // Réassigne uniquement les catégories valides
                    },
                },
            });

            return updatedBook;
        } catch (error) {
            throw new AppError(
                "Erreur lors de la mise à jour du livre",
                error.statusCode || 500
            );
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
                throw new Error('ID du livre invalide');
            }
            const book = await this.getById(id);
            if (!book) {
                throw new AppError("Livre non trouvé", 400);
            }
            return await prisma.book.deleteMany({
                where: { id: id },
            });

        } catch (error) {
            throw new Error('Erreur lors de la suppression du livre', error.message);
        }
    }

    /**
     * Supprime des livres d'un auteur
     * @param {number} id
     * @returns {Promise<Object>} Le livre supprimé
     * @throws {AppError} Si une erreur se produit lors de la suppression du livre
     */
    async deleteByAuthor(id) {
        try {
            id = parseInt(id);
            const result = await prisma.book.deleteMany({
                where: { authorId: id },
            });
            return result.count;
        } catch (error) {
            throw new AppError("Erreur lors de la suppression des livres de l'auteur", 500);
        }
    }

    /**
     * Supprime tous les livres associés à une catégorie donnée.
     * @param {number} id - L'ID de la catégorie dont les livres doivent être supprimés.
     * @returns {Promise<void>}
     * @throws {Error} Si une erreur se produit lors de la suppression des livres.
     */
    async deleteByCategory(id) {
        try {
            id = parseInt(id);
            // Dissocier les livres de la catégorie
            await prisma.bookCategory.deleteMany({
                where: {
                    categoryId: id,
                },
            });

            // Supprimer les livres associés à la catégorie
            await prisma.book.deleteMany({
                where: {
                    categories: {
                        some: {
                            id: id,
                        },
                    },
                },
            });
        } catch (error) {
            throw new AppError("Erreur lors de la suppression des livres de la catégorie", 500);
        }
    }

    async getBooksByAuthor(authorId) {
        try {
            authorId = parseInt(authorId);
            return await prisma.book.findMany({
                where: {
                    authorId: authorId,
                },
            });
        } catch (error) {
            throw new AppError('Erreur lors de la récupération des livres de l\'auteur', 500);
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
            return await prisma.book.findMany({
                where: {
                    categories: {
                        some: {
                            id: categoryId,
                        },
                    },
                },
            });
        } catch (error) {
            throw new AppError('Erreur lors de la récupération des livres de la catégorie', 500);
        }
    }

}

module.exports = new BookDAO();
