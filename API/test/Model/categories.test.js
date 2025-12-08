import Category from '../../src/model/Category.js';

describe('Modèle Category', () => {

    it('doit créer une instance valide de Category avec les bonnes données', () => {
        const data = {
            id: 1,
            name: 'Fantasy'
        };
        const category = new Category(data);

        expect(category.id).toBe(1);
        expect(category.name).toBe('Fantasy');
    });

    it('doit valider correctement avec des données valides', () => {
        const data = {
            id: 1,
            name: 'Fantasy'
        };
        const category = new Category(data);

        const errors = category.validate();
        expect(errors).toEqual([]); // Aucune erreur, validation réussie
    });

    it('doit échouer lors de la validation si l\'ID de la catégorie est invalide', () => {
        const data = {
            id: null,
            name: 'Fantasy'
        };
        const category = new Category(data);

        const errors = category.validate();
        expect(errors).toContain("L'ID de la catégorie est invalide.");
    });

    it('doit échouer lors de la validation si le nom de la catégorie est manquant', () => {
        const data = {
            id: 1,
            name: ''
        };
        const category = new Category(data);

        const errors = category.validate();
        expect(errors).toContain("Le nom de la catégorie est obligatoire.");
    });

    it('doit échouer lors de la validation si le nom de la catégorie est manquant', () => {
        const data = {
            id: 1,
            name: null
        };
        const category = new Category(data);

        const errors = category.validate();
        expect(errors).toContain("Le nom de la catégorie est obligatoire.");
    });

    it('doit réussir la validation si le nom de la catégorie est valide', () => {
        const data = {
            id: 1,
            name: 'Science Fiction'
        };
        const category = new Category(data);

        const errors = category.validate();
        expect(errors).toEqual([]); // Validation réussie
    });

    it('doit échouer lors de la validation si l\'ID de la catégorie est manquant lors de la mise à jour', () => {
        const data = {
            id: null,
            name: 'Fantasy'
        };
        const category = new Category(data);

        const errors = category.validate(true); // isUpdate = true
        expect(errors).toContain("L'ID de la catégorie est invalide.");
    });

    it('doit réussir la validation si l\'ID de la catégorie est valide lors de la mise à jour', () => {
        const data = {
            id: 1,
            name: 'Fantasy'
        };
        const category = new Category(data);

        const errors = category.validate(true); // isUpdate = true
        expect(errors).toEqual([]); // Validation réussie
    });
});
