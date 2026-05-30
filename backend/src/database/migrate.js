import pool from '../config/db.js';

const createTables = async () => {
  const connection = await pool.getConnection();

  try {
    console.log(' Iniciando migración...');

    // 1. Suppliers
    await connection.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(150),
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log(' Tabla suppliers creada');

    // 2. Categories
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log(' Tabla categories creada');

    // 3. Users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log(' Tabla users creada');

    // 4. Products
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        sku VARCHAR(100) NOT NULL UNIQUE,
        category_id INT NOT NULL,
        supplier_id INT,
        stock INT NOT NULL DEFAULT 0,
        min_stock INT NOT NULL DEFAULT 5,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        unit VARCHAR(50) NOT NULL DEFAULT 'piezas',
        image_url VARCHAR(500) DEFAULT NULL,
        image_storage_id VARCHAR(255) DEFAULT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        CHECK (stock >= 0),
        CHECK (min_stock >= 0),
        CHECK (price >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
        CONSTRAINT fk_product_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
      )
    `);
    console.log(' Tabla products creada');

    // 5. Movements
    await connection.query(`
      CREATE TABLE IF NOT EXISTS movements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        type ENUM('entry', 'exit') NOT NULL,
        quantity INT NOT NULL,
        CHECK (quantity > 0),
        reason VARCHAR(255),
        stock_before INT NOT NULL,
        stock_after INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_movement_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
        CONSTRAINT fk_movement_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
      )
    `);
    console.log(' Tabla movements creada');

    console.log(' Migración completada exitosamente');

  } catch (error) {
    console.error(' Error en migración:', error.message);
    process.exit(1);
  } finally {
    connection.release();
    process.exit(0);
  }
};

createTables();