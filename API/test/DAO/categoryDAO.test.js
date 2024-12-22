const CategoryDAO = require('../../src/dao/CategoryDAO');
const Categories = require('../../src/model/Category');
const AppError = require('../../src/model/AppError');
const resetBdd = require('../../config/bddTest');

describe('CategoryDAO', () => {
    test('getAll() retourne toutes les catégories', async () => {
        await resetBdd.main();
        const allCategories =  await CategoryDAO.getAll();
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
        await resetBdd.main();
        const categorie = await CategoryDAO.getById(1);

        expect(categorie).not.toBeNull();

        expect(categorie).toEqual({ id: 1, name: 'Fantasy' });
    });

    test('getById() retourne null pour une catégorie inexistante', async () => {
        const category = await CategoryDAO.getById(99);
        expect(category).toBeNull();
    });

    test('create() ajoute une nouvelle catégorie', async () => {
        await resetBdd.main();
        const newCategory = new Categories({ name: 'Science' });
        const createdCategory = await CategoryDAO.create(newCategory);
        expect(createdCategory.name).toBe('Science');

        const allCategories = await CategoryDAO.getAll();
        expect(allCategories).toHaveLength(5);
    });

    test('create() lève une erreur pour des données invalides', async () => {
        const invalidCategory = new Categories({ name: '' });
        try {
            await CategoryDAO.create(invalidCategory);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Erreur lors de la création de la catégorie.');
        }
    });

    test('update() met à jour une catégorie existante', async () => {
        await resetBdd.main();
        const updatedCategory = new Categories({ id: 2, name: 'Science Updated' });
        await CategoryDAO.update(updatedCategory);
        const category = await CategoryDAO.getById(2);
        expect(category).toEqual({ id: 2, name: 'Science Updated' });
    });

    test('update() retourne null pour une catégorie inexistante', async () => {
        try{
            await resetBdd.main();
            const updatedCategory = new Categories({ id: 99, name: 'Science Updated' });
            await CategoryDAO.update(updatedCategory);
        } catch (error) {
            console.log(error);
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Aucune catégorie correspondante trouvée.');
        }
    });

    test('delete() supprime une catégorie existante', async () => {
        await resetBdd.main();
        const deletedCategory = await CategoryDAO.delete(3);
        expect(deletedCategory).toEqual( { id: 3, name: 'Romance' });

        const allCategories = await CategoryDAO.getAll();
        expect(allCategories).toHaveLength(3);
    });

    test('delete() retourne null pour une catégorie inexistante', async () => {
        try{
            await CategoryDAO.delete(50);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Aucune catégorie correspondante trouvée.');
        }

    });

    test('getCategoriesBookCount() retourne le nombre de livres par catégorie', async () => {
        await resetBdd.main();
        const counts = await CategoryDAO.getCategoriesBookCount();
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
