import bookDAO from '../../src/dao/bookDAO.js';
import Book from '../../src/model/Book.js';
import AppError from '../../src/model/AppError.js';
import { main as resetBdd } from '../../config/bddTest.js';

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
    beforeEach(async () => {
        await resetBdd();
    });

    test('getAll() retourne toutes les livres', async () => {
        const allBooks =  await bookDAO.getAll();
        expect(allBooks).toHaveLength(4);
        expect(allBooks).toEqual(books);
    });

    test('getById() retourne une livre existante', async () => {
        const book = await bookDAO.getById(1);
        expect(book).not.toBeNull();
        expect(book).toEqual(books[0]);
    });

    test('getById() retourne null pour une livre inexistante', async () => {
        const book = await bookDAO.getById(99);
        expect(book).toBeNull();
    });

    test('create() ajoute une nouvelle livre', async () => {
        const newBook = {
            title: "The Great Gatsby",
            description: "A classic American novel.",
            publicationDate: "1925-04-10",
            authorId: 1,
            categoryIds: [1]
        };
        const book = new Book(newBook);
        const createdBook = await bookDAO.create(book);
        expect(createdBook.title).toBe("The Great Gatsby");

        const allBooks = await bookDAO.getAll();
        expect(allBooks).toHaveLength(5);
    });

    test('create() lève une erreur pour des données invalides', async () => {
        const newBook = {
            title: "",
            description: "A classic American novel.",
            publicationDate: "1925-04-10",
            authorId: 1,
            categoryIds: [1]
        };
        const invalidBook = new Book(newBook);
        try {
            await bookDAO.create(invalidBook);
            fail('Should have thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
        }
    });

    test('update() met à jour une livre existante', async () => {
        const updatedBook = new Book({
            id: 1,
            title: "Harry Potter - Updated",
            description: "A young wizard embarks on his journey.",
            publicationDate: "1997-06-26",
            authorId: 1,
            categoryIds: [1]
        });
        await bookDAO.update(updatedBook);
        const book = await bookDAO.getById(1);
        expect(book.id).toBe(1);
        expect(book.title).toBe("Harry Potter - Updated");
    });

    test('update() retourne une erreur pour une livre inexistante', async () => {
        const updatedBook = new Book({
            id: 999,
            title: "Non-existent Book",
            description: "Does not exist.",
            publicationDate: "2000-01-01",
            authorId: 1
        });
        try {
            await bookDAO.update(updatedBook);
            fail('Should have thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
        }
    });

    test('delete() supprime une livre existante', async () => {
        const deletedBook = await bookDAO.delete(3);
        expect(deletedBook).toBeTruthy();
        expect(deletedBook.id).toBe(3);
        expect(deletedBook.title).toBe('Pride and Prejudice');

        const allBooks = await bookDAO.getAll();
        expect(allBooks).toHaveLength(3);
    });

    test('delete() retourne une erreur pour une livre inexistante', async () => {
        try{
            await bookDAO.delete(999);
            fail('Should have thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
        }
    });

    test('deleteByAuthor() retourne null pour un auteur existant', async () => {
        const deletedCategory = await bookDAO.deleteByAuthor(2);
        expect(deletedCategory).toEqual( {
            "count": 2
        });

        const allCategories = await bookDAO.getAll();
        expect(allCategories).toHaveLength(2);
    });

    test('deleteByAuthor() retourne null pour un auteur inexistant', async () => {
        try{
            await bookDAO.deleteByAuthor(100);
            fail('Should have thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
        }
    });

    test('deleteByCategory() retourne null pour une Catégorie existant', async () => {
        const deletedCategory = await bookDAO.deleteByCategory(3);
        expect(deletedCategory).toEqual( {
            "count": 1
        });

        const allCategories = await bookDAO.getAll();
        expect(allCategories).toHaveLength(3);
    });

    test('deleteByCategory() retourne une erreur pour une catégorie inexistante', async () => {
        try{
            await bookDAO.deleteByCategory(100);
            fail('Should have thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
        }
    });
});
