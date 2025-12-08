import express from 'express';
import * as authorController from '../controller/authorController.js';

const router = express.Router();

// GET all authors
router.get('/', authorController.getAllAuthors);

// POST create new author
router.post('/', authorController.createAuthor);

// GET author by ID
router.get('/:id', authorController.getOneAuthor);

// PUT update author
router.put('/:id', authorController.updateAuthor);

// DELETE author
router.delete('/:id', authorController.deleteAuthor);

export default router;
