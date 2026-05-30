import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  const connection = await pool.getConnection();

  try {
    console.log(' Ejecutando seed...');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;


    // Verificar si ya existe el admin
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    );

    if (existing.length > 0) {
      console.log('El usuario admin ya existe, seed omitido.');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await connection.query(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      ['Administrador', adminEmail, hashedPassword, 'admin']
    );

    console.log(' Usuario admin creado correctamente');
    console.log(' Cambia la contraseña en producción');

  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    process.exit(1);
  } finally {
    connection.release();
    process.exit(0);
  }
};

seed();