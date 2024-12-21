const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AppError = require('../model/AppError');
const Categories = require("../model/Category");
class CategoryDAO {
    /**
     * Récupère toutes les catégories
     * @returns {Promise<Array>}
     */
    async getAll() {
        return prisma.category.findMany();
    }

    /**
     * Récupère une catégori²e par son ID
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    async getById(id) {
        id = parseInt(id);
        if (isNaN(id)) {
            throw new AppError("ID de catégorie invalide.", 400);
        }
        return prisma.category.findUnique({
            where: {id},
        });
    }

    /**
     * Crée une nouvelle catégorie
     * @param {Categories} categories
     * @returns {Promise<Object>}
     */
    async create(categories) {
        if (!(categories instanceof Categories) || categories.validate(false).length >0) {
            throw new AppError("Données de catégories invalides.", 400);
        }
        const data = categories.toJson();
        return prisma.category.create({
            data,
        });
    }

    /**
     * Met à jour une catégorie par son ID
     * @param  {Categories} categories
     * @returns {Promise<Object>}
     */
    async update(categories) {
        if (!(categories instanceof Categories) || categories.validate(false).length >0) {
            throw new AppError("Données de catégories invalides.", 400);
        }
        const id = parseInt(categories.id);
        if (isNaN(id)) {
            throw new AppError("Données ou ID de catégorie invalides.", 400);
        }
        const data = categories.toJson();
        return prisma.category.update({
            where: { id },
            data,
        });
    }
    /**
     * Supprime une catégorie des livres, supprime également les livres qui n'ont plus d'autres catégories
     * @param {number} categoryId - ID de la catégorie à supprimer
     * @throws {AppError} - Si une erreur se produit
     */
    async deleteCategoryAndManageBooks(categoryId) {
        try {
            categoryId = parseInt(categoryId);
            if (isNaN(categoryId)) {
                throw new AppError("ID de catégorie invalide.", 400);
            }

            const booksWithCategory = await prisma.book.findMany({
                where: {
                    categories: {
                        some: {
                            id: categoryId,
                        },
                    },
                },
                include: {
                    categories: true,
                },
            });

            // Traiter chaque livre
            for (const book of booksWithCategory) {
                // Si le livre n'a plus aucune autre catégorie, on le supprime
                if (book.categories.length === 1 && book.categories[0].id === categoryId) {
                    await prisma.book.delete({
                        where: { id: book.id },
                    });
                } else {
                    // Sinon, on dissocie la catégorie du livre
                    await prisma.book.update({
                        where: { id: book.id },
                        data: {
                            categories: {
                                disconnect: { id: categoryId },
                            },
                        },
                    });
                }
            }

            await prisma.category.delete({
                where: { id: categoryId },
            });

        } catch (error) {
            console.error(error);
            if (error.code === 'P2003') {
                throw new AppError(
                    'Impossible de supprimer cette catégorie car elle est liée à d\'autres enregistrements.',
                    400
                );
            }
            throw new AppError('Erreur lors de la suppression de la catégorie.', 500);
        }
    }



    /**
     * Supprime une catégorie par son ID
     * @param {number} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        id = parseInt(id);
        if (isNaN(id)) {
            throw new AppError("ID de catégorie invalide.", 400);
        }
        return prisma.category.delete({
            where: { id },
        });
    }

    async getCategoriesBookCount() {
        try {
            const categoriesWithBookCount = await prisma.category.findMany({
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: { books: true },
                    },
                },
            });

            return categoriesWithBookCount.map(category => ({
                id: category.id,
                name: category.name,
                count: category._count.books,
            }));

        }catch (error) {
            throw new AppError('Erreur lors de la récupération du nombre de livre par catégories', 500);
        }
    }
}

module.exports = new CategoryDAO();
