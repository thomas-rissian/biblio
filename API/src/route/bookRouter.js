import express from 'express';
import * as bookController from '../controller/bookController.js';

const router = express.Router();

// GET all books
router.get('/', bookController.getAllBooks);

// GET book by ID
router.get('/:id', bookController.getOneBook);

// POST create new book
router.post('/', bookController.createBook);

// PUT update book
router.put('/:id', bookController.updateBook);

// DELETE book
router.delete('/:id', bookController.deleteBook);

// GET books by author
router.get('/author/:authorId', bookController.getBooksByAuthor);

// DELETE books by author
router.delete('/author/:authorId', bookController.deleteBooksByAuthor);

// GET books by category
router.get('/categories/:categoryId', bookController.getBooksByCategory);

// DELETE books by category
router.delete('/categories/:categoryId', bookController.deleteBooksByCategory);

export default router;
