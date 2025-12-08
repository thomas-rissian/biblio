import Book from '../../src/model/Book.js';

describe('Modèle Book', () => {

    // Test pour une instance valide de Book
    it('doit créer une instance valide de Book avec les bonnes données', () => {
        const data = {
            id: 1,
            title: 'Harry Potter and the Philosopher\'s Stone',
            authorId: 1,
            publicationDate: '1997-06-26',
            description: 'A young wizard embarks on his journey.',
            categoryIds: [1, 2]
        };
        const book = new Book(data);

        expect(book.id).toBe(1);
        expect(book.title).toBe('Harry Potter and the Philosopher\'s Stone');
        expect(book.author).toBe(1);
        expect(book.publicationDate).toBeInstanceOf(Date);
        expect(book.description).toBe('A young wizard embarks on his journey.');
        expect(book.categories).toEqual([1, 2]);
    });

    // Test de validation avec des données valides
    it('doit valider correctement avec des données valides', () => {
        const data = {
            id: 1,
            title: 'Harry Potter and the Philosopher\'s Stone',
            authorId: 1,
            publicationDate: '1997-06-26',
            description: 'A young wizard embarks on his journey.',
            categoryIds: [1, 2]
        };
        const book = new Book(data);

        const errors = book.validate();
        expect(errors).toEqual([]); // Aucune erreur, validation réussie
    });

    it('doit échouer lors de la validation si l\'ID du livre est invalide', () => {
        const data = {
            id: null,
            title: 'Harry Potter and the Philosopher\'s Stone',
            authorId: 1,
            publicationDate: '1997-06-26',
            description: 'A young wizard embarks on his journey.',
            categoryIds: [1, 2]
        };
        const book = new Book(data);

        const errors = book.validate();
        expect(errors).toContainEqual({ id: "L'ID du livre est invalide." });
    });

    it('doit échouer lors de la validation si le titre est manquant', () => {
        const data = {
            id: 1,
            title: '',
            authorId: 1,
            publicationDate: '1997-06-26',
            description: 'A young wizard embarks on his journey.',
            categoryIds: [1, 2]
        };
        const book = new Book(data);

        const errors = book.validate();
        expect(errors).toContainEqual({ title: "Le titre du livre est obligatoire." });
    });

    it('doit échouer lors de la validation si l\'auteur est manquant ou invalide', () => {
        const data = {
            id: 1,
            title: 'Harry Potter and the Philosopher\'s Stone',
            authorId: null,
            publicationDate: '1997-06-26',
            description: 'A young wizard embarks on his journey.',
            categoryIds: [1, 2]
        };
        const book = new Book(data);

        const errors = book.validate();
        expect(errors).toContainEqual({ author: "L'auteur du livre est obligatoire et doit être un identifiant valide." });
    });

    it('doit échouer lors de la validation si la date de publication est manquante ou invalide', () => {
        const data = {
            id: 1,
            title: 'Harry Potter and the Philosopher\'s Stone',
            authorId: 1,
            publicationDate: 'invalid date',
            description: 'A young wizard embarks on his journey.',
            categoryIds: [1, 2]
        };
        const book = new Book(data);

        const errors = book.validate();
        expect(errors).toContainEqual({ publicationDate: "La date de publication est obligatoire et doit être une date valide." });
    });

    it('doit échouer lors de la validation si la description est manquante', () => {
        const data = {
            id: 1,
            title: 'Harry Potter and the Philosopher\'s Stone',
            authorId: 1,
            publicationDate: '1997-06-26',
            description: '',
            categoryIds: [1, 2]
        };
        const book = new Book(data);

        const errors = book.validate();
        expect(errors).toContainEqual({ description: "La description du livre est obligatoire." });
    });

    it('doit échouer lors de la validation si les catégories sont manquantes', () => {
        const data = {
            id: 1,
            title: 'Harry Potter and the Philosopher\'s Stone',
            authorId: 1,
            publicationDate: '1997-06-26',
            description: 'A young wizard embarks on his journey.',
            categoryIds: []
        };
        const book = new Book(data);

        const errors = book.validate();
        expect(errors).toContainEqual({ categories: "Les catégories sont obligatoires et doivent contenir au moins une catégorie." });
    });

    it('doit échouer lors de la validation si les identifiants des catégories ne sont pas valides', () => {
        const data = {
            id: 1,
            title: 'Harry Potter and the Philosopher\'s Stone',
            authorId: 1,
            publicationDate: '1997-06-26',
            description: 'A young wizard embarks on his journey.',
            categoryIds: [1, 'invalid'] // "invalid" est un identifiant non valide
        };
        const book = new Book(data);

        const errors = book.validate();
        expect(errors).toContainEqual({ categories: "Tous les identifiants des catégories doivent être valides." });
    });

    it('doit réussir la validation avec toutes les données valides', () => {
        const data = {
            id: 1,
            title: 'Harry Potter and the Philosopher\'s Stone',
            authorId: 1,
            publicationDate: '1997-06-26',
            description: 'A young wizard embarks on his journey.',
            categoryIds: [1, 2]
        };
        const book = new Book(data);

        const errors = book.validate();
        expect(errors).toEqual([]); // Validation réussie, aucune erreur
    });
});
