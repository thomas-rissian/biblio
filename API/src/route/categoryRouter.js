import express from 'express';
import * as categoryController from '../controller/categoryController.js';

const router = express.Router();

// GET all categories
router.get('/', categoryController.getAllCategories);

// GET book count by categories (must come before /:id)
router.get('/books/count', categoryController.countBooksCategories);

// POST create new category
router.post('/', categoryController.createCategory);

// GET category by ID
router.get('/:id', categoryController.getOneCategory);

// PUT update category
router.put('/:id', categoryController.updateCategory);

// DELETE category
router.delete('/:id', categoryController.deleteCategory);

export default router;
