import categoryDAO from '../../src/dao/categoryDAO.js';
import Category from '../../src/model/Category.js';
import AppError from '../../src/model/AppError.js';
import { main as resetBdd } from '../../config/bddTest.js';

describe('CategoryDAO', () => {
    beforeEach(async () => {
        await resetBdd();
    });

    test('getAll() retourne toutes les catégories', async () => {
        const allCategories =  await categoryDAO.getAll();
        expect(allCategories).toHaveLength(4);
        expect(allCategories).toEqual(
            expect.arrayContaining([
                { id: 1, name: 'Fantasy' },
                { id: 2, name: 'Dystopian' },
                { id: 3, name: 'Romance' },
                { id: 4, name: 'Classic Literature' },
            ])
        );
    });

    test('getById() retourne une catégorie existante', async () => {
        const categorie = await categoryDAO.getById(1);
        expect(categorie).not.toBeNull();
        expect(categorie).toEqual({ id: 1, name: 'Fantasy' });
    });

    test('getById() retourne null pour une catégorie inexistante', async () => {
        const category = await categoryDAO.getById(99);
        expect(category).toBeNull();
    });

    test('create() ajoute une nouvelle catégorie', async () => {
        const newCategory = new Category({ name: 'Science Fiction' });
        const createdCategory = await categoryDAO.create(newCategory);
        expect(createdCategory.name).toBe('Science Fiction');

        const allCategories = await categoryDAO.getAll();
        expect(allCategories).toHaveLength(5);
    });

    test('create() lève une erreur pour des données invalides', async () => {
        const invalidCategory = new Category({ name: '' });
        try {
            await categoryDAO.create(invalidCategory);
            fail('Devrait avoir levé une erreur');
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Données de catégories invalides.');
        }
    });

    test('update() met à jour une catégorie existante', async () => {
        const updatedCategory = new Category({ id: 2, name: 'Science Updated' });
        await categoryDAO.update(updatedCategory);
        const category = await categoryDAO.getById(2);
        expect(category).toEqual({ id: 2, name: 'Science Updated' });
    });

    test('update() retourne null pour une catégorie inexistante', async () => {
        try{
            const updatedCategory = new Category({ id: 99, name: 'Science Updated' });
            await categoryDAO.update(updatedCategory);
            fail('Devrait avoir levé une erreur');
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            // La 404 vient de Prisma P2025, c'est l'erreur attendue
            expect(error.message).toBe('Aucune catégorie correspondante trouvée.');
        }
    });

    test('delete() supprime une catégorie existante', async () => {
        const deletedCategory = await categoryDAO.delete(3);
        expect(deletedCategory).toBeTruthy();
        expect(deletedCategory.id).toBe(3);
        expect(deletedCategory.name).toBe('Romance');

        const allCategories = await categoryDAO.getAll();
        expect(allCategories).toHaveLength(3);
    });

    test('delete() retourne null pour une catégorie inexistante', async () => {
        try{
            await categoryDAO.delete(50);
            fail('Devrait avoir levé une erreur');
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Aucune catégorie correspondante trouvée.');
        }
    });

    test('getCategoriesBookCount() retourne le nombre de livres par catégorie', async () => {
        const counts = await categoryDAO.getCategoriesBookCount();
        expect(counts).toEqual(
            expect.arrayContaining([
                { id: 1, name: 'Fantasy', count: expect.any(Number) },
                { id: 2, name: 'Dystopian', count: expect.any(Number) },
                { id: 3, name: 'Romance', count: expect.any(Number) },
                { id: 4, name: 'Classic Literature', count: expect.any(Number) },
            ])
        );
    });
});
