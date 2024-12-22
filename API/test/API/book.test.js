const request = require('supertest');
const resetBdd = require("../../config/bddTest");
const PORT = 40000;
const URL = `http://localhost:${PORT}`;

describe('Book API', () => {

    test('GET /books - Récupérer tous les livres', async () => {
        await resetBdd.main();
        const response = await request(URL).get('/books');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(4);
    });

    test('GET /books/:id - Récupérer un livre existant', async () => {
        await resetBdd.main();
        const response = await request(URL).get('/books/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            title: "Harry Potter and the Philosopher's Stone",
            description: "A young wizard embarks on his journey.",
            publicationDate: "1997-06-26",
            authorId: 1,
            author: { id: 1, name: "J.K. Rowling" },
            categories: [{ id: 1, name: "Fantasy" }]
        });
    });

    test('GET /books/:id - Récupérer un livre inexistant', async () => {
        await resetBdd.main();
        const response = await request(URL).get('/books/99');
        expect(response.status).toBe(404);
    });

    test('POST /books - Ajouter un nouveau livre', async () => {
        await resetBdd.main();
        const newBook = {
            title: "New Book Title",
            description: "Description of new book",
            publicationDate: "2024-01-01",
            authorId: 1,
            categoryIds: [1, 2]
        };
        const response = await request(URL).post('/books').send(newBook);
        expect(response.status).toBe(201);
        expect(response.body.title).toBe(newBook.title);
    });

    test('POST /books - Tentative d\'ajout d\'un livre avec un titre vide', async () => {
        await resetBdd.main();
        const invalidBook = {
            title: "",
            description: "Description of new book",
            publicationDate: "2024-01-01",
            authorId: 1,
            categoryIds: [1, 2]
        };
        const response = await request(URL).post('/books').send(invalidBook);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Erreur lors de la création du livre");
    });

    test('PUT /books/:id - Mettre à jour un livre', async () => {
        await resetBdd.main();
        const updatedBook = {
            title: "Updated Book Title",
            description: "Updated description",
            publicationDate: "2024-01-01",
            authorId: 1,
            categoryIds: [1]
        };
        const response = await request(URL).put('/books/1').send(updatedBook);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedBook.title);
    });

    test('PUT /books/:id - Tentative de mise à jour d\'un livre inexistant', async () => {
        await resetBdd.main();
        const updatedBook = {
            title: "Updated Book Title",
            description: "Updated description",
            publicationDate: "2024-01-01",
            authorId: 1,
            categoryIds: [1]
        };
        const response = await request(URL).put('/books/99').send(updatedBook);
        expect(response.status).toBe(404);
    });

    test('DELETE /books/:id - Supprimer un livre existant', async () => {
        await resetBdd.main();
        const response = await request(URL).delete('/books/2');
        expect(response.status).toBe(200);
    });

    test('DELETE /books/:id - Supprimer un livre inexistant', async () => {
        await resetBdd.main();
        const response = await request(URL).delete('/books/99');
        expect(response.status).toBe(400);
    });

    test('DELETE /books/author/:authorId - Supprimer les livres par auteur', async () => {
        await resetBdd.main();
        const response = await request(URL).delete('/books/author/2');
        expect(response.status).toBe(200);
    });

    test('DELETE /books/categories/:categoryId - Supprimer les livres par catégorie', async () => {
        await resetBdd.main();
        const response = await request(URL).delete('/books/categories/3');
        expect(response.status).toBe(200);
    });
});
