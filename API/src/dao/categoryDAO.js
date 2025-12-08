import { prisma, Prisma } from '../../lib/prisma.js'
import AppError from '../model/AppError.js';
import Category from "../model/Category.js";
import bookDAO from "./bookDAO.js";

class CategoryDAO {
    async getAll({ page, pageSize } = {}) {
        try {
            const findOptions = { orderBy: { id: 'asc' } };
            if (typeof page === 'number' && typeof pageSize === 'number') {
                findOptions.skip = (page - 1) * pageSize;
                findOptions.take = pageSize;
            }
            const categories = await prisma.category.findMany(findOptions);
            return categories;
        } catch (error) {
            this.handlePrismaError(error, "Erreur lors de la récupération des catégories");
        }
    }

    async getById(id) {
        try {
            id = parseInt(id);
            if (isNaN(id)) {
                throw new AppError("ID de catégorie invalide.", 400);
            }
            return prisma.category.findUnique({
                where: { id },
            });
        }catch (error) {
            this.handlePrismaError(error, "Erreur lors de la récupération de la catégorie");
        }

    }

    async create(categories) {
        try {
            if (!(categories instanceof Category) || categories.validate(false).length > 0) {
                throw new AppError("Données de catégories invalides.", 400);
            }
            const data = categories.toJson();
            return await prisma.category.create({ data });
        } catch (error) {
            console.error('Create error:', error.message, error.code);
            throw this.handlePrismaError(error, "Erreur lors de la création de la catégorie.");
        }
    }

    async update(categories) {
        try {
            if (!(categories instanceof Category) || categories.validate(false).length > 0) {
                throw new AppError("Données de catégories invalides.", 400);
            }

            const id = parseInt(categories.id);
            if (isNaN(id)) {
                throw new AppError("Données ou ID de catégorie invalides.", 400);
            }

            const data = categories.toJson();
            return await prisma.category.update({
                where: { id },
                data,
            });
        } catch (error) {
            console.error('Update error:', error.message, error.code);
            throw this.handlePrismaError(error, "Erreur lors de la mise à jour de la catégorie.");
        }
    }

    async delete(id) {
        try {
            id = parseInt(id);
            if (isNaN(id)) {
                throw new AppError("ID de catégorie invalide.", 400);
            }
            
            // Check if category exists
            const category = await prisma.category.findUnique({ where: { id } });
            if (!category) {
                throw new AppError("Aucune catégorie correspondante trouvée.", 404);
            }
            
            await bookDAO.deleteByCategory(id);
            return await prisma.category.delete({ where: { id } });
        } catch (error) {
            console.error('Delete error:', error.message, error.code);
            throw this.handlePrismaError(error, "Erreur lors de la suppression de la catégorie.");
        }
    }

    async getCategoriesBookCount() {
        try {
            const categoriesWithBookCount = await prisma.category.findMany({
                select: {
                    id: true,
                    name: true,
                    _count: { select: { books: true } },
                },
            });

            return categoriesWithBookCount.map(category => ({
                id: category.id,
                name: category.name,
                count: category._count.books,
            }));
        } catch (error) {
            throw new AppError("Erreur lors de la récupération du nombre de livres par catégories.", 500);
        }
    }

    /**
     * Gère les erreurs Prisma et les convertit en erreurs métiers.
     * @param {Error} error
     * @param {string} defaultMessage
     * @throws {AppError}
     */
    handlePrismaError(error, defaultMessage) {
        // If it's already an AppError, rethrow it
        if (error instanceof AppError) {
            throw error;
        }
        
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':
                    throw new AppError("Une catégorie avec ces données existe déjà.", 409);
                case 'P2025':
                    throw new AppError("Aucune catégorie correspondante trouvée.", 404);
                case 'P2003':
                    throw new AppError("Contrainte de clé étrangère violée.", 400);
                default:
                    throw new AppError(defaultMessage, 500);
            }
        }
        throw new AppError(defaultMessage, 400);
    }
}

export default new CategoryDAO();
