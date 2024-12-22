const AuthorDAO = require('../../src/dao/authorDAO');
const Author = require('../../src/model/Author');
const AppError = require('../../src/model/AppError');
const resetBdd = require('../../config/bddTest');

const authors = [{"id":1,"name":"J.K. Rowling","birthDate":"1965-07-31","deathDate":null,"biography":"British author, best known for the Harry Potter series."},
    {"id":2,"name":"George Orwell","birthDate":"1903-06-25","deathDate":"1950-01-21","biography":"English novelist and essayist, known for \"1984\" and \"Animal Farm\"."},
    {"id":3,"name":"Jane Austen","birthDate":"1775-12-16","deathDate":"1817-07-18","biography":"English novelist known for \"Pride and Prejudice\"."}
]

const authorCreate = {
    "id": 1,
    "name": "Mark Twain",
    "birthDate": "1835-11-30",
    "deathDate": "1910-04-21",
    "biography":"English novelist and essayist, known for \"1984\" and \"Animal Farm\""
};

describe('AuthorDAO', () => {

    test('getAll() retourne tous les auteurs', async () => {
        await resetBdd.main();
        const allAuthors = await AuthorDAO.getAll();
        expect(allAuthors).toHaveLength(3);
        expect(allAuthors).toEqual(authors);
    });

    test('getById() retourne un auteur existant', async () => {
        await resetBdd.main();
        const author = await AuthorDAO.getById(1);
        expect(author).not.toBeNull();
        expect(author).toEqual(authors[0]);
    });

    test('getById() retourne null pour un auteur inexistant', async () => {
        const author = await AuthorDAO.getById(99);
        expect(author).toBeNull();
    });

    test('create() ajoute un nouvel auteur', async () => {
        await resetBdd.main();
        const newAuthor = new Author(authorCreate);
        const createdAuthor = await AuthorDAO.create(newAuthor);
        expect(createdAuthor.name).toBe(newAuthor.name);

        const allAuthors = await AuthorDAO.getAll();
        expect(allAuthors).toHaveLength(4);
    });

    test('create() lève une erreur pour des données invalides', async () => {
        const invalidAuthor = new Author({...authorCreate, name: ""});
        try {
            await AuthorDAO.create(invalidAuthor);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe("Erreur lors de la création de l'auteur.");
        }
    });

    test('update() met à jour un auteur existant', async () => {
        await resetBdd.main();
        const updatedAuthor = new Author(authorCreate);
        await AuthorDAO.update(updatedAuthor);

        const author = await AuthorDAO.getById(1);
        expect(author.name).toBe("Mark Twain");
    });

    test('update() retourne une erreur pour un auteur inexistant', async () => {
        const updatedAuthor = new Author({...authorCreate, id: 100});
        try {
            await AuthorDAO.update(updatedAuthor);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe("Aucune correspondance trouvée pour cette requête.");
        }
    });

    test('delete() supprime un auteur existant', async () => {
        await resetBdd.main();
        const deletedAuthor = await AuthorDAO.delete(3);

        expect(deletedAuthor).toEqual({
            biography: "English novelist known for \"Pride and Prejudice\".",
            birthDate: new Date("1775-12-16T00:00:00.000Z"),
            deathDate: new Date("1817-07-18T00:00:00.000Z"),
            id: 3,
            name: "Jane Austen",
        });

        const allAuthors = await AuthorDAO.getAll();
        expect(allAuthors).toHaveLength(2);
    });

    test('delete() retourne une erreur pour un auteur inexistant', async () => {
        try {
            await AuthorDAO.delete(100);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe("Aucune correspondance trouvée pour cette requête.");
        }
    });

    test('delete() retourne une erreur si l\'auteur est lié à des livres', async () => {
        await resetBdd.main();
        try {
            await AuthorDAO.delete(1);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Impossible de supprimer cet auteur car il est lié à d\'autres enregistrements.');
        }
    });
});
