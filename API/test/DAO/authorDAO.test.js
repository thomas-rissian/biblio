import authorDAO from '../../src/dao/authorDAO.js';
import Author from '../../src/model/Author.js';
import AppError from '../../src/model/AppError.js';
import { main as resetBdd } from '../../config/bddTest.js';

const authors = [
    {"id":1,"name":"J.K. Rowling","birthDate":"1965-07-31","deathDate":null,"biography":"British author, best known for the Harry Potter series."},
    {"id":2,"name":"George Orwell","birthDate":"1903-06-25","deathDate":"1950-01-21","biography":"English novelist and essayist, known for \"1984\" and \"Animal Farm\"."},
    {"id":3,"name":"Jane Austen","birthDate":"1775-12-16","deathDate":"1817-07-18","biography":"English novelist known for \"Pride and Prejudice\"."}
];

const authorCreate = {
    "id": 4,
    "name": "Mark Twain",
    "birthDate": "1835-11-30",
    "deathDate": "1910-04-21",
    "biography": "American writer, best known for The Adventures of Tom Sawyer."
};

describe('AuthorDAO', () => {
    beforeEach(async () => {
        await resetBdd();
    });

    test('getAll() retourne tous les auteurs', async () => {
        const allAuthors = await authorDAO.getAll();
        expect(allAuthors).toHaveLength(3);
        expect(allAuthors).toEqual(authors);
    });

    test('getById() retourne un auteur existant', async () => {
        const author = await authorDAO.getById(1);
        expect(author).not.toBeNull();
        expect(author).toEqual(authors[0]);
    });

    test('getById() retourne null pour un auteur inexistant', async () => {
        const author = await authorDAO.getById(99);
        expect(author).toBeNull();
    });

    test('create() ajoute un nouvel auteur', async () => {
        const newAuthor = new Author(authorCreate);
        const createdAuthor = await authorDAO.create(newAuthor);
        expect(createdAuthor.name).toBe(newAuthor.name);

        const allAuthors = await authorDAO.getAll();
        expect(allAuthors).toHaveLength(4);
    });

    test('create() lève une erreur pour des données invalides', async () => {
        const invalidAuthor = new Author({...authorCreate, name: ""});
        await expect(authorDAO.create(invalidAuthor)).rejects.toThrow(AppError);
    });

    test('update() met à jour un auteur existant', async () => {
        const updatedAuthor = new Author({ id: 1, name: 'J.K. Rowling Updated', birthDate: '1965-07-31', biography: 'Updated biography' });
        await authorDAO.update(updatedAuthor);

        const author = await authorDAO.getById(1);
        expect(author.name).toBe("J.K. Rowling Updated");
    });

    test('update() retourne une erreur pour un auteur inexistant', async () => {
        const updatedAuthor = new Author({...authorCreate, id: 100});
        await expect(authorDAO.update(updatedAuthor)).rejects.toThrow(AppError);
    });

    test('delete() supprime un auteur existant', async () => {
        const deletedAuthor = await authorDAO.delete(2);

        expect(deletedAuthor).toBeTruthy();
        expect(deletedAuthor.id).toBe(2);
        expect(deletedAuthor.name).toBe("George Orwell");

        const allAuthors = await authorDAO.getAll();
        expect(allAuthors).toHaveLength(2);
    });

    test('delete() retourne une erreur pour un auteur inexistant', async () => {
        await expect(authorDAO.delete(100)).rejects.toThrow(AppError);
    });

});
