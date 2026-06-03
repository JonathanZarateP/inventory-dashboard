import pool from '../config/db.js';

// GET /api/suppliers
export const getSuppliers = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM suppliers WHERE is_active = 1 ORDER BY name ASC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener proveedores:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// GET /api/suppliers/:id
export const getSupplierById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM suppliers WHERE id = ? AND is_active = 1',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener proveedor:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// POST /api/suppliers
export const createSupplier = async (req, res) => {
    const { name, phone, email } = req.body;
    try {
        const [existing] = await pool.query(
            'SELECT id FROM suppliers WHERE name = ? AND is_active = 1',
            [name]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: 'Ya existe un proveedor con ese nombre' });
        }

        const [result] = await pool.query(
            'INSERT INTO suppliers (name, phone, email) VALUES (?, ?, ?)',
            [name, phone, email]
        );

        res.status(201).json({
            message: 'Proveedor creado correctamente',
            id: result.insertId,
        });
    } catch (error) {
        console.error('Error al crear proveedor:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PUT /api/suppliers/:id
export const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    try {
        const [existing] = await pool.query(
            'SELECT id FROM suppliers WHERE id = ? AND is_active = 1',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        const [duplicate] = await pool.query(
            'SELECT id FROM suppliers WHERE name = ? AND id != ? AND is_active = 1',
            [name, id]
        );

        if (duplicate.length > 0) {
            return res.status(409).json({ message: 'Ya existe un proveedor con ese nombre' });
        }

        await pool.query(
            'UPDATE suppliers SET name = ?, phone = ?, email = ? WHERE id = ?',
            [name, phone, email, id]
        );

        res.json({ message: 'Proveedor actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar proveedor:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// DELETE /api/suppliers/:id — soft delete
export const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const [existing] = await pool.query(
            'SELECT id FROM suppliers WHERE id = ? AND is_active = 1',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        await pool.query(
            'UPDATE suppliers SET is_active = 0 WHERE id = ?',
            [id]
        );

        res.json({ message: 'Proveedor desactivado correctamente' });
    } catch (error) {
        console.error('Error al desactivar proveedor:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};