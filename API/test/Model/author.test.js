import Author from '../../src/model/Author.js';

describe('Modèle Author', () => {
    it('doit créer une instance valide d\'AuthorTest avec les bonnes données', () => {
        const data = {
            id: 1,
            name: 'J.K. Rowling',
            birthDate: '1965-07-31',
            deathDate: null,
            biography: 'British author, best known for the Harry Potter series.'
        };
        const author = new Author(data);

        expect(author.id).toBe(1);
        expect(author.name).toBe('J.K. Rowling');
        expect(author.birthDate).toBeInstanceOf(Date);
        expect(author.deathDate).toBeNull();
        expect(author.biography).toBe('British author, best known for the Harry Potter series.');
    });

    it('doit valider correctement avec des données valides', () => {
        const data = {
            id: 1,
            name: 'J.K. Rowling',
            birthDate: '1965-07-31',
            deathDate: null,
            biography: 'British author, best known for the Harry Potter series.'
        };
        const author = new Author(data);

        const errors = author.validate();
        expect(errors).toEqual([]); // Validation réussie, aucune erreur
    });

    it('doit renvoyer la représentation JSON correcte de l\'auteur', () => {
        const data = {
            id: 1,
            name: 'J.K. Rowling',
            birthDate: '1965-07-31',
            deathDate: null,
            biography: 'British author, best known for the Harry Potter series.'
        };
        const author = new Author(data);

        const json = author.toJson();
        expect(json).toEqual({
            id: 1,
            name: 'J.K. Rowling',
            birthDate: expect.any(Date),
            deathDate: null,
            biography: 'British author, best known for the Harry Potter series.'
        });
    });

    it('doit valider correctement avec toutes les données valides', () => {
        const data = {
            id: 1,
            name: 'J.K. Rowling',
            birthDate: '1965-07-31',
            deathDate: '2023-12-31', // Une date de décès valide, après la date de naissance
            biography: 'British author, best known for the Harry Potter series.'
        };
        const author = new Author(data);

        const errors = author.validate();
        expect(errors).toEqual([]); // Validation réussie, aucune erreur
    });
});
