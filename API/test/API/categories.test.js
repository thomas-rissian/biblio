const request = require('supertest');
const resetBdd = require("../../config/bddTest");
const PORT = 40000;
const URL = `http://localhost:${PORT}`;

describe('Category API', () => {
    test('GET /categories - Récupérer toutes les catégories', async () => {
        await resetBdd.main();
        const response = await request(URL).get('/categories');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(4);
    });

    test('GET /categories/:id - Récupérer une catégorie existante', async () => {
        await resetBdd.main();
        const response = await request(URL).get('/categories/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            name: "Fantasy"
        });
    });

    test('GET /categories/:id - Récupérer une catégorie inexistante', async () => {
        await resetBdd.main();
        const response = await request(URL).get('/categories/99');
        expect(response.status).toBe(404);
    });

    test('POST /categories - Ajouter une nouvelle catégorie', async () => {
        await resetBdd.main();
        const newCategory = { name: "Science" };
        const response = await request(URL).post('/categories').send(newCategory);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(newCategory.name);
    });

    test('POST /categories - Tentative d\'ajout d\'une catégorie avec un nom vide', async () => {
        await resetBdd.main();
        const invalidCategory = { name: "" };
        const response = await request(URL).post('/categories').send(invalidCategory);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Erreur lors de la création de la catégorie.");
    });

    test('PUT /categories/:id - Mettre à jour une catégorie existante', async () => {
        await resetBdd.main();
        const updatedCategory = { name: "Science Updated" };
        const response = await request(URL).put('/categories/1').send(updatedCategory);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedCategory.name);
    });

    test('PUT /categories/:id - Tentative de mise à jour d\'une catégorie inexistante', async () => {
        await resetBdd.main();
        const updatedCategory = { name: "Non-existent Category" };
        const response = await request(URL).put('/categories/99').send(updatedCategory);
        expect(response.status).toBe(404);
    });

    test('DELETE /categories/:id - Supprimer une catégorie existante', async () => {
        await resetBdd.main();
        const response = await request(URL).delete('/categories/3');
        expect(response.status).toBe(200);
    });

    test('DELETE /categories/:id - Tentative de suppression d\'une catégorie inexistante', async () => {
        await resetBdd.main();
        const response = await request(URL).delete('/categories/99');
        expect(response.status).toBe(404);
    });

    test('GET /categories/books/count - Récupérer le nombre de livres par catégorie', async () => {
        await resetBdd.main();
        const response = await request(URL).get('/categories/books/count');
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
