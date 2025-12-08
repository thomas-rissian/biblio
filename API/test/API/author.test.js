import request from 'supertest';
import app from '../../index.js';
import { main as resetBdd } from '../../config/bddTest.js';
const agent = request(app);

const authors = [
    { id: 1, name: "J.K. Rowling", birthDate: "1965-07-31", deathDate: null, biography: "British author, best known for the Harry Potter series." },
    { id: 2, name: "George Orwell", birthDate: "1903-06-25", deathDate: "1950-01-21", biography: "English novelist and essayist, known for \"1984\" and \"Animal Farm\"." },
    { id: 3, name: "Jane Austen", birthDate: "1775-12-16", deathDate: "1817-07-18", biography: "English novelist known for \"Pride and Prejudice\"." }
];

const authorCreate = {
    name: "Mark Twain",
    birthDate: "1835-11-30",
    deathDate: "1910-04-21",
    biography: "English novelist and essayist, known for \"Adventures of Huckleberry Finn\""
};

describe('Author API', () => {
    beforeEach(async () => {
        await resetBdd();
    });

    test('GET /authors - Récupérer tous les auteurs', async () => {
        const response = await agent.get('/api/v1/authors');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
        expect(response.body).toEqual(authors);
    });

    test('GET /authors/:id - Récupérer un auteur existant', async () => {
        const response = await agent.get('/api/v1/authors/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(authors[0]);
    });

    test('GET /authors/:id - Récupérer un auteur inexistant', async () => {
        const response = await agent.get('/api/v1/authors/99');
        expect(response.status).toBe(404);
    });

    test('POST /authors - Créer un nouvel auteur', async () => {
        const response = await agent.post('/api/v1/authors').send(authorCreate);
        expect(response.status).toBe(201);

        const allAuthorsResponse = await agent.get('/api/v1/authors');
        expect(allAuthorsResponse.body).toHaveLength(4);
    });

    test('POST /authors - Tentative de création d\'un auteur avec des données invalides', async () => {
        const invalidAuthor = { ...authorCreate, name: "" };
        const response = await agent.post('/api/v1/authors').send(invalidAuthor);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    });

    test('PUT /authors/:id - Mettre à jour un auteur existant', async () => {
        const updatedAuthor = { ...authors[0], name: "J.K. Rowling Updated" };
        const response = await agent.put('/api/v1/authors/1').send(updatedAuthor);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("J.K. Rowling Updated");
    });

    test('PUT /authors/:id - Mettre à jour un auteur inexistant', async () => {
        const updatedAuthor = { ...authorCreate, id: 100, name: "Un auteur inexistant" };
        const response = await agent.put('/api/v1/authors/100').send(updatedAuthor);
        expect(response.status).toBe(404);
    });

    test('DELETE /authors/:id - Supprimer un auteur existant', async () => {
        const response = await agent.delete('/api/v1/authors/3');
        expect(response.status).toBe(204);
        const allAuthorsResponse = await agent.get('/api/v1/authors');
        expect(allAuthorsResponse.body).toHaveLength(2);
    });

    test('DELETE /authors/:id - Tentative de suppression d\'un auteur inexistant', async () => {
        const response = await agent.delete('/api/v1/authors/100');
        expect(response.status).toBe(404);
    });

    test('DELETE /authors/:id - Tentative de suppression d\'un auteur lié à des livres', async () => {
        const response = await agent.delete('/api/v1/authors/2');
        expect(response.status).toBe(204);

        expect(response.body).toEqual({});
    });

});
