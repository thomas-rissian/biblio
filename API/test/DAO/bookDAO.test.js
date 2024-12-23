const BookDAO = require('../../src/dao/bookDAO');
const Book = require('../../src/model/Book');
const AppError = require('../../src/model/AppError');
const resetBdd = require('../../config/bddTest');

const books = [
    {"author": {"id": 1, "name": "J.K. Rowling"}, "authorId": 1, "categories": [{"id": 1, "name": "Fantasy"}], "description": "A young wizard embarks on his journey.", "id": 1, "publicationDate": "1997-06-26", "title": "Harry Potter and the Philosopher's Stone"},
    {"author": {"id": 2, "name": "George Orwell"}, "authorId": 2, "categories": [{"id": 2, "name": "Dystopian"}, {"id": 4, "name": "Classic Literature"}], "description": "A dystopian novel set in a totalitarian society.", "id": 2, "publicationDate": "1949-06-08", "title": "1984"},
    {"author": {"id": 3, "name": "Jane Austen"}, "authorId": 3, "categories": [{"id": 3, "name": "Romance"}], "description": "A classic romance novel.", "id": 3, "publicationDate": "1813-01-28", "title": "Pride and Prejudice"},
    {"author": {"id": 2, "name": "George Orwell"}, "authorId": 2, "categories": [{"id": 4, "name": "Classic Literature"}], "description": "A satirical novella about farm animals overthrowing their owner.", "id": 4, "publicationDate": "1945-08-17", "title": "Animal Farm"}
];
const bookCreate = {
    "id":1,
    "title":"Harry Potter and the Philosopher's Stone",
    "description":"A young wizard embarks on his journey.",
    "publicationDate":"1997-06-26",
    "authorId":1,
    "author":{"id":1,"name":"J.K. Rowling"},
    "categoryIds":[1,2]
};
describe('BookDAO', () => {
    test('getAll() retourne toutes les livres', async () => {
        await resetBdd.main();
        const allBooks =  await BookDAO.getAll();
        expect(allBooks).toHaveLength(4);
        expect(allBooks).toEqual(books);
    });
    test('getById() retourne une livre existante', async () => {
        await resetBdd.main();
        const book = await BookDAO.getById(1);

        expect(book).not.toBeNull();
        expect(book).toEqual(books[0]);
    });

    test('getById() retourne null pour une livre inexistante', async () => {
        const book = await BookDAO.getById(99);
        expect(book).toBeNull();
    });

    test('create() ajoute une nouvelle livre', async () => {
        await resetBdd.main();
        const newBook =bookCreate;
        newBook.name = "test";
        const book = new Book(newBook);
        const createdCategory = await BookDAO.create(book);
        expect(createdCategory.name).toBe(book[0]);

        const allBooks = await BookDAO.getAll();
        expect(allBooks).toHaveLength(5);
    });

    test('create() lève une erreur pour des données invalides', async () => {
        const newBook = bookCreate;
        newBook.title = "";
        const invalidBook = new Book(newBook);
        try {
            await BookDAO.create(invalidBook);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Erreur lors de la création du livre');
        }
    });

    test('update() met à jour une livre existante', async () => {
        await resetBdd.main();
        const newBook = bookCreate;
        newBook.title = "test";
        const updatedBook = new Book(newBook);
        await BookDAO.update(updatedBook);
        const book = await BookDAO.getById(1);
        expect(book).toEqual({"id":1,
            "title":"test",
            "description":"A young wizard embarks on his journey.",
            "publicationDate":"1997-06-26",
            "authorId":1,
            "author":{"id":1,"name":"J.K. Rowling"},
            "categories":[{"id":1,"name":"Fantasy"},{"id":2,"name":"Dystopian"}]});
    });

    test('update() retourne null pour une livre inexistante', async () => {
        const newBook = bookCreate;
        newBook.title = "";
        const updatedBook = new Book(newBook);
        try {
            await BookDAO.update(updatedBook);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Erreur lors de la mise à jour du livre');
        }
    });

    test('delete() supprime une livre existante', async () => {
        await resetBdd.main();
        const deletedCategory = await BookDAO.delete(3);
        expect(deletedCategory).toEqual( {
            id: 3,
            title: 'Pride and Prejudice',
            description: 'A classic romance novel.',
            publicationDate: new Date('1813-01-28'),
            authorId: 3,
        });

        const allCategories = await BookDAO.getAll();
        expect(allCategories).toHaveLength(3);
    });

    test('delete() supprime les livres par auteur existante', async () => {
        try{
            await BookDAO.delete(50);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Erreur lors de la suppression du livre');
        }

    });

    test('deleteByAuthor() retourne null pour un auteur existant', async () => {
        await resetBdd.main();
        const deletedCategory = await BookDAO.deleteByAuthor(2);
        expect(deletedCategory).toEqual( {
            "count": 2
        });

        const allCategories = await BookDAO.getAll();
        expect(allCategories).toHaveLength(2);
    });

    test('deleteByAuthor() retourne null pour un auteur inexistante', async () => {
        try{
            await BookDAO.deleteByAuthor(100);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Erreur lors de la suppression du livre');
        }
    });
    test('deleteByCategory() retourne null pour une Catégorie existant', async () => {
        await resetBdd.main();
        const deletedCategory = await BookDAO.deleteByCategory(3);
        expect(deletedCategory).toEqual( {
            "count": 1
        });

        const allCategories = await BookDAO.getAll();
        expect(allCategories).toHaveLength(3);
    });

    test('deleteByCategory() retourne null pour une Catégorie inexistante', async () => {
        try{
            await BookDAO.deleteByCategory(100);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Erreur lors de la suppression des livres de la catégorie');
        }
    });
});
