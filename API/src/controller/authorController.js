import authorDAO from '../dao/authorDAO.js';
import Author from '../model/Author.js';

const handleRequest = async (req, res, callback) => {
    try {
        await callback(req, res);
    } catch (error) {
        console.error('Erreur dans le contrôleur :', error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message || 'Erreur interne du serveur' });
    }
};

const getAllAuthors = async (req, res) => handleRequest(req, res, async() => {
        const authors = await authorDAO.getAll();
        res.status(200).json(authors);
});

const createAuthor = async (req, res) => handleRequest(req, res, async () => {
        const data = req.body;
        const newAuthor = await authorDAO.create(new Author(data));
        res.status(201).json(newAuthor);
});

const getOneAuthor = async (req, res) =>  handleRequest(req, res, async () => {
    const { id } = req.params;
    const author = await authorDAO.getById(parseInt(id));
    if (author) {
        res.status(200).json(author);
    } else {
        res.status(404).json({ message: 'Auteur non trouvé.' });
    }
});

const updateAuthor = async (req, res) =>  handleRequest(req, res, async () => {
    const { id } = req.params;
    const data = req.body;
    data.id = parseInt(id);
    const updatedAuthor = await authorDAO.update(new Author(data));
    res.status(200).json(updatedAuthor);
});

const deleteAuthor = async (req, res) =>  handleRequest(req, res, async () => {
    const { id } = req.params;
    await authorDAO.delete(parseInt(id));
    res.status(204).end();
});

export {
    getAllAuthors,
    createAuthor,
    getOneAuthor,
    updateAuthor,
    deleteAuthor,
};
