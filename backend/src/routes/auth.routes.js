import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { validateLogin } from '../validations/auth.validation.js';

const router = Router();

// POST /api/auth/login
router.post('/login', validateLogin, login);

export default router;