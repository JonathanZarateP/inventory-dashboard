import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import requireRole from '../middlewares/role.middleware.js';
import { validateCategory } from '../validations/category.validation.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/categories
router.get('/', getCategories);

// GET /api/categories/:id
router.get('/:id', getCategoryById);

// POST /api/categories — solo admin
router.post('/', requireRole('admin'), validateCategory, createCategory);

// PUT /api/categories/:id — solo admin
router.put('/:id', requireRole('admin'), validateCategory, updateCategory);

// DELETE /api/categories/:id — solo admin
router.delete('/:id', requireRole('admin'), deleteCategory);

export default router;