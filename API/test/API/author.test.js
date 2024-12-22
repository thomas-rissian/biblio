const request = require('supertest');
const URL = 'http://localhost:' + 40000;
const resetBdd = require('../../config/bddTest');

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

    test('GET /authors - Récupérer tous les auteurs', async () => {
        await resetBdd.main();
        const response = await request(URL).get('/authors');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
        expect(response.body).toEqual(authors);
    });

    test('GET /authors/:id - Récupérer un auteur existant', async () => {
        await resetBdd.main();
        const response = await request(URL).get('/authors/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(authors[0]);
    });

    test('GET /authors/:id - Récupérer un auteur inexistant', async () => {
        await resetBdd.main();
        const response = await request(URL).get('/authors/99');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Auteur non trouvé.');
    });

    test('POST /authors - Créer un nouvel auteur', async () => {
        await resetBdd.main();
        const response = await request(URL).post('/authors').send(authorCreate);
        expect(response.status).toBe(409);

        const allAuthorsResponse = await request(URL).get('/authors');
        expect(allAuthorsResponse.body).toHaveLength(3);
    });

    test('POST /authors - Tentative de création d\'un auteur avec des données invalides', async () => {
        await resetBdd.main();
        const invalidAuthor = { ...authorCreate, name: "" };
        const response = await request(URL).post('/authors').send(invalidAuthor);
        expect(response.status).toBe(400);

        console.log(response.body);

        expect(response.body).toHaveProperty("message", "Erreur lors de la création de l'auteur.");
    });


    test('PUT /authors/:id - Mettre à jour un auteur existant', async () => {
        await resetBdd.main();
        const updatedAuthor = { ...authors[0], name: "Mark Twain (updated)" };
        const response = await request(URL).put('/authors/1').send(updatedAuthor);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Mark Twain (updated)");
    });

    test('PUT /authors/:id - Mettre à jour un auteur inexistant', async () => {
        await resetBdd.main();
        const updatedAuthor = { ...authorCreate, id: 100, name: "Un auteur inexistant" };
        const response = await request(URL).put('/authors/100').send(updatedAuthor);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Aucune correspondance trouvée pour cette requête.');
    });

    test('DELETE /authors/:id - Supprimer un auteur existant', async () => {
        await resetBdd.main();
        const response = await request(URL).delete('/authors/3');
        expect(response.status).toBe(204);
        const allAuthorsResponse = await request(URL).get('/authors');
        expect(allAuthorsResponse.body).toHaveLength(2);
    });

    test('DELETE /authors/:id - Tentative de suppression d\'un auteur inexistant', async () => {
        await resetBdd.main();
        const response = await request(URL).delete('/authors/100');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Aucune correspondance trouvée pour cette requête.');
    });

    test('DELETE /authors/:id - Tentative de suppression d\'un auteur lié à des livres', async () => {
        await resetBdd.main();
        const response = await request(URL).delete('/authors/2');
        expect(response.status).toBe(204);

        expect(response.body).toEqual({});
    });

});
