import { Router } from 'express';
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplier.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import requireRole from '../middlewares/role.middleware.js';
import { validateSupplier } from '../validations/supplier.validation.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/suppliers
router.get('/', getSuppliers);

// GET /api/suppliers/:id
router.get('/:id', getSupplierById);

// POST /api/suppliers — solo admin
router.post('/', requireRole('admin'), validateSupplier, createSupplier);

// PUT /api/suppliers/:id — solo admin
router.put('/:id', requireRole('admin'), validateSupplier, updateSupplier);

// DELETE /api/suppliers/:id — solo admin
router.delete('/:id', requireRole('admin'), deleteSupplier);

export default router;