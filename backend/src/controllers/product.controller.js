import * as productService from '../services/product.service.js';

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { search, category_id, low_stock, price_min, price_max } = req.query;
    const products = await productService.getAllProducts({
      search, category_id, low_stock, price_min, price_max,
    });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// GET /api/products/:id
export const getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const skuTaken = await productService.isSkuTaken(req.body.sku);
    if (skuTaken) {
      return res.status(409).json({ message: 'Ya existe un producto con ese SKU' });
    }

    const id = await productService.createProduct(req.body, req.file || null);

    res.status(201).json({
      message: 'Producto creado correctamente',
      id,
    });
  } catch (error) {
    console.error('Error al crear producto:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const skuTaken = await productService.isSkuTaken(req.body.sku, id);
    if (skuTaken) {
      return res.status(409).json({ message: 'Ya existe un producto con ese SKU' });
    }

    await productService.updateProduct(id, req.body, req.file || null);

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await productService.deleteProduct(id);

    res.json({ message: 'Producto desactivado correctamente' });
  } catch (error) {
    console.error('Error al desactivar producto:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};