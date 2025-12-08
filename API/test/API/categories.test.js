import request from 'supertest';
import app from '../../index.js';
import { main as resetBdd } from "../../config/bddTest.js";
const agent = request(app);

describe('Category API', () => {
    beforeEach(async () => {
        await resetBdd();
    });

    test('GET /categories - Récupérer toutes les catégories', async () => {
        const response = await agent.get('/api/v1/categories');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(4);
    });

    test('GET /categories/:id - Récupérer une catégorie existante', async () => {
        const response = await agent.get('/api/v1/categories/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            name: "Fantasy"
        });
    });

    test('GET /categories/:id - Récupérer une catégorie inexistante', async () => {
        const response = await agent.get('/api/v1/categories/99');
        expect(response.status).toBe(404);
    });

    test('POST /categories - Ajouter une nouvelle catégorie', async () => {
        const newCategory = { name: "Horror" };
        const response = await agent.post('/api/v1/categories').send(newCategory);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(newCategory.name);
    });

    test('POST /categories - Tentative d\'ajout d\'une catégorie avec un nom vide', async () => {
        const invalidCategory = { name: "" };
        const response = await agent.post('/api/v1/categories').send(invalidCategory);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Données de catégories invalides.");
    });

    test('PUT /categories/:id - Mettre à jour une catégorie existante', async () => {
        const updatedCategory = { name: "Science Updated" };
        const response = await agent.put('/api/v1/categories/1').send(updatedCategory);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedCategory.name);
    });

    test('PUT /categories/:id - Tentative de mise à jour d\'une catégorie inexistante', async () => {
        const updatedCategory = { name: "Non-existent Category" };
        const response = await agent.put('/api/v1/categories/99').send(updatedCategory);
        expect(response.status).toBe(404);
    });

    test('DELETE /categories/:id - Supprimer une catégorie existante', async () => {
        const response = await agent.delete('/api/v1/categories/3');
        expect(response.status).toBe(200);
    });

    test('DELETE /categories/:id - Tentative de suppression d\'une catégorie inexistante', async () => {
        const response = await agent.delete('/api/v1/categories/99');
        expect(response.status).toBe(404);
    });

    test('GET /categories/books/count - Récupérer le nombre de livres par catégorie', async () => {
        const response = await agent.get('/api/v1/categories/books/count');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                { id: 1, name: 'Fantasy', count: expect.any(Number) },
                { id: 2, name: 'Dystopian', count: expect.any(Number) },
                { id: 3, name: 'Romance', count: expect.any(Number) },
                { id: 4, name: 'Classic Literature', count: expect.any(Number) },
            ])
        );
    });
});
