import pool from '../config/db.js';
import { uploadImage, deleteImage } from './upload.service.js';

// Obtener todos los productos con filtros opcionales
export const getAllProducts = async (filters = {}) => {
  const { search, category_id, low_stock, price_min, price_max } = filters;

  let query = `
    SELECT 
      p.id, p.name, p.sku, p.description, p.stock, p.min_stock,
      p.price, p.unit, p.image_url, p.is_active,
      c.id AS category_id, c.name AS category_name,
      s.id AS supplier_id, s.name AS supplier_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    WHERE p.is_active = 1
  `;

  const params = [];

  if (search) {
    query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category_id) {
    query += ' AND p.category_id = ?';
    params.push(parseInt(category_id));
  }

  if (low_stock === 'true') {
    query += ' AND p.stock <= p.min_stock';
  }

  if (price_min !== undefined && price_min !== '') {
    query += ' AND p.price >= ?';
    params.push(parseFloat(price_min));
  }

  if (price_max !== undefined && price_max !== '') {
    query += ' AND p.price <= ?';
    params.push(parseFloat(price_max));
  }

  query += ' ORDER BY p.name ASC';

  const [rows] = await pool.query(query, params);
  return rows;
};

// Obtener producto por ID
export const getProductById = async (id) => {
  const [rows] = await pool.query(
    `SELECT 
      p.id, p.name, p.sku, p.description, p.stock, p.min_stock,
      p.price, p.unit, p.image_url, p.image_storage_id, p.is_active,
      p.created_at, p.updated_at,
      c.id AS category_id, c.name AS category_name,
      s.id AS supplier_id, s.name AS supplier_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    WHERE p.id = ? AND p.is_active = 1`,
    [id]
  );
  return rows[0] || null;
};

// Verificar SKU duplicado 
export const isSkuTaken = async (sku, excludeId = null) => {
  let query = 'SELECT id FROM products WHERE sku = ?';
  const params = [sku];

  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }

  const [rows] = await pool.query(query, params);
  return rows.length > 0;
};

// Crear producto 
export const createProduct = async (data, file) => {
  const {
    name, sku, description, category_id, supplier_id,
    stock, min_stock, price, unit,
  } = data;

  let image_url = null;
  let image_storage_id = null;

  if (file) {
    const uploaded = await uploadImage(file.buffer);
    image_url = uploaded.image_url;
    image_storage_id = uploaded.image_storage_id;
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO products 
        (name, sku, description, category_id, supplier_id, stock, min_stock, price, unit, image_url, image_storage_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, sku, description, category_id, supplier_id, stock, min_stock, price, unit, image_url, image_storage_id]
    );
    return result.insertId;
  } catch (error) {
    if (image_storage_id) {
      await deleteImage(image_storage_id);
    }
    throw error;
  }
};

// Actualizar producto
export const updateProduct = async (id, data, file) => {
  const {
    name, sku, description, category_id, supplier_id,
    stock, min_stock, price, unit,
  } = data;

  const [current] = await pool.query(
    'SELECT image_storage_id FROM products WHERE id = ?',
    [id]
  );
  const previousStorageId = current[0]?.image_storage_id || null;

  let image_url = undefined;
  let image_storage_id = undefined;

  if (file) {
    const uploaded = await uploadImage(file.buffer);
    image_url = uploaded.image_url;
    image_storage_id = uploaded.image_storage_id;
  }

  const imageFields = file ? ', image_url = ?, image_storage_id = ?' : '';
  const baseParams = [name, sku, description, category_id, supplier_id, stock, min_stock, price, unit];
  const imageParams = file ? [image_url, image_storage_id] : [];

  try {
    await pool.query(
      `UPDATE products SET
        name = ?, sku = ?, description = ?, category_id = ?, supplier_id = ?,
        stock = ?, min_stock = ?, price = ?, unit = ?
        ${imageFields}
      WHERE id = ?`,
      [...baseParams, ...imageParams, id]
    );

    if (file && previousStorageId) {
      await deleteImage(previousStorageId);
    }
  } catch (error) {
    if (file && image_storage_id) {
      await deleteImage(image_storage_id);
    }
    throw error;
  }
};

// Soft delete — primero desactiva en MySQL, luego elimina imagen
export const deleteProduct = async (id) => {
  const [rows] = await pool.query(
    'SELECT image_storage_id FROM products WHERE id = ?',
    [id]
  );

  const storageId = rows[0]?.image_storage_id || null;

  await pool.query('UPDATE products SET is_active = 0 WHERE id = ?', [id]);

  if (storageId) {
    await deleteImage(storageId);
  }
};