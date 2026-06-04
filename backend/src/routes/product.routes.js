import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import requireRole from '../middlewares/role.middleware.js';
import { validateProduct } from '../validations/product.validation.js';
import upload from '../config/multer.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/products
router.get('/', getProducts);

// GET /api/products/:id
router.get('/:id', getProduct);

// POST /api/products — solo admin
router.post('/', requireRole('admin'), upload.single('image'), validateProduct, createProduct);

// PUT /api/products/:id — solo admin
router.put('/:id', requireRole('admin'), upload.single('image'), validateProduct, updateProduct);

// DELETE /api/products/:id — solo admin
router.delete('/:id', requireRole('admin'), deleteProduct);

export default router;