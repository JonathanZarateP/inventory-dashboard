import pool from '../config/db.js';

// GET /api/categories
export const getCategories = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM categories ORDER BY name ASC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// GET /api/categories/:id
export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM categories WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener categoría:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// POST /api/categories
export const createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const [existing] = await pool.query(
            'SELECT id FROM categories WHERE name = ?',
            [name]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: 'Ya existe una categoría con ese nombre' });
        }

        const [result] = await pool.query(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [name, description]
        );

        res.status(201).json({
            message: 'Categoría creada correctamente',
            id: result.insertId,
        });
    } catch (error) {
        console.error('Error al crear categoría:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const [existing] = await pool.query(
            'SELECT id FROM categories WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        const [duplicate] = await pool.query(
            'SELECT id FROM categories WHERE name = ? AND id != ?',
            [name, id]
        );

        if (duplicate.length > 0) {
            return res.status(409).json({ message: 'Ya existe una categoría con ese nombre' });
        }

        await pool.query(
            'UPDATE categories SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );

        res.json({ message: 'Categoría actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar categoría:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const [existing] = await pool.query(
            'SELECT id FROM categories WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        const [products] = await pool.query(
            'SELECT id FROM products WHERE category_id = ? LIMIT 1',
            [id]
        );

        if (products.length > 0) {
            return res.status(409).json({
                message: 'No se puede eliminar una categoría con productos asociados'
            });
        }

        await pool.query('DELETE FROM categories WHERE id = ?', [id]);

        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar categoría:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};