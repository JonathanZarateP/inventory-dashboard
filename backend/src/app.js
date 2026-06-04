import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import multer from 'multer';
import categoryRoutes from './routes/category.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import productRoutes from './routes/product.routes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API del panel de inventario funcionando' });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint no encontrado' });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'La imagen no puede superar los 2 MB',
    });
  }
  return res.status(400).json({ message: err.message });
}
if (err.message === 'Solo se permiten imágenes JPG, PNG o WEBP') {
  return res.status(400).json({ message: err.message });
}
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
const startServer = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();

export default app;