const authorDAO = require('../dao/authorDAO'); // Assurez-vous que `authorDAO` est correctement défini et exporté
const Author = require('../model/Author');

const handleRequest = async (req, res, callback) => {
    try {
        await callback(req, res);
    } catch (error) {
        console.error('Erreur dans le contrôleur :', error);
        const statusCode = error.statusCode || 500;
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message || 'Erreur interne du serveur' }));
    }
};

const getAllAuthors = async (req, res) => handleRequest(req, res, async() => {
        const authors = await authorDAO.getAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(authors));
});

const createAuthor = async (req, res) => handleRequest(req, res, async () => {
        const body = await readRequestBody(req);
        const data = JSON.parse(body);
        const newAuthor = await authorDAO.create(new Author(data));
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newAuthor));
});

const getOneAuthor = async (req, res) =>  handleRequest(req, res, async () => {
    const id = parseInt(req.url.split('/')[2]);
    const author = await authorDAO.getById(id);
    if (author) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(author));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Auteur non trouvé.' }));
    }
});

const updateAuthor = async (req, res) =>  handleRequest(req, res, async () => {

    const body = await readRequestBody(req);
    const data = JSON.parse(body);
    data.id = parseInt(req.url.split('/')[2]);
    const updatedAuthor = await authorDAO.update(new Author(data));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedAuthor));
});

const deleteAuthor = async (req, res) =>  handleRequest(req, res, async () => {
    const id = parseInt(req.url.split('/')[2]);
    await authorDAO.delete(id);
    res.writeHead(204);
    res.end();
});

const readRequestBody = (req) => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', (err) => reject(err));
});

module.exports = {
    getAllAuthors,
    createAuthor,
    getOneAuthor,
    updateAuthor,
    deleteAuthor,
};
