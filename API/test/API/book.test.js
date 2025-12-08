import request from 'supertest';
import app from '../../index.js';
import { main as resetBdd } from "../../config/bddTest.js";
const agent = request(app);

describe('Book API', () => {
    beforeEach(async () => {
        await resetBdd();
    });

    test('GET /books - Récupérer tous les livres', async () => {
        const response = await agent.get('/api/v1/books');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(4);
    });

    test('GET /books/:id - Récupérer un livre existant', async () => {
        const response = await agent.get('/api/v1/books/1');
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
        const response = await agent.get('/api/v1/books/99');
        expect(response.status).toBe(404);
    });

    test('POST /books - Ajouter un nouveau livre', async () => {
        const newBook = {
            title: "New Book Title",
            description: "Description of new book",
            publicationDate: "2024-01-01",
            authorId: 1,
            categoryIds: [1, 2]
        };
        const response = await agent.post('/api/v1/books').send(newBook);
        expect(response.status).toBe(201);
        expect(response.body.title).toBe(newBook.title);
    });

    test('POST /books - Tentative d\'ajout d\'un livre avec un titre vide', async () => {
        const invalidBook = {
            title: "",
            description: "Description of new book",
            publicationDate: "2024-01-01",
            authorId: 1,
            categoryIds: [1, 2]
        };
        const response = await agent.post('/api/v1/books').send(invalidBook);
        expect(response.status).toBe(400);
    });

    test('PUT /books/:id - Mettre à jour un livre', async () => {
        const updatedBook = {
            title: "Updated Book Title",
            description: "Updated description",
            publicationDate: "2024-01-01",
            authorId: 1,
            categoryIds: [1]
        };
        const response = await agent.put('/api/v1/books/1').send(updatedBook);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedBook.title);
    });

    test('PUT /books/:id - Tentative de mise à jour d\'un livre inexistant', async () => {
        const updatedBook = {
            title: "Updated Book Title",
            description: "Updated description",
            publicationDate: "2024-01-01",
            authorId: 1,
            categoryIds: [1]
        };
        const response = await agent.put('/api/v1/books/99').send(updatedBook);
        expect(response.status).toBe(404);
    });

    test('DELETE /books/:id - Supprimer un livre existant', async () => {
        const response = await agent.delete('/api/v1/books/2');
        expect(response.status).toBe(200);
    });

    test('DELETE /books/:id - Supprimer un livre inexistant', async () => {
        const response = await agent.delete('/api/v1/books/99');
        expect(response.status).toBe(404);
    });

    test('DELETE /books/author/:authorId - Supprimer les livres par auteur', async () => {
        const response = await agent.delete('/api/v1/books/author/2');
        expect(response.status).toBe(200);
    });

    test('DELETE /books/categories/:categoryId - Supprimer les livres par catégorie', async () => {
        const response = await agent.delete('/api/v1/books/categories/3');
        expect(response.status).toBe(200);
    });
});
