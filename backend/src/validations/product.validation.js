export const validateProduct = (req, res, next) => {
  const { name, sku, category_id, price, stock, min_stock } = req.body;

  // Nombre requerido
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'El nombre del producto es requerido' });
  }
  if (name.trim().length > 150) {
    return res.status(400).json({ message: 'El nombre no puede superar 150 caracteres' });
  }

  // SKU requerido
  if (!sku || sku.trim() === '') {
    return res.status(400).json({ message: 'El SKU del producto es requerido' });
  }
  if (sku.trim().length > 100) {
    return res.status(400).json({ message: 'El SKU no puede superar 100 caracteres' });
  }

  // Categoría requerida
  if (!category_id || isNaN(parseInt(category_id))) {
    return res.status(400).json({ message: 'La categoría es requerida y debe ser válida' });
  }

  // Proveedor opcional pero válido si viene
  if (req.body.supplier_id !== undefined && req.body.supplier_id !== '') {
    if (isNaN(parseInt(req.body.supplier_id))) {
      return res.status(400).json({ message: 'El proveedor debe ser válido' });
  }
}


  // Precio requerido y positivo
  if (price === undefined || price === null || price === '') {
    return res.status(400).json({ message: 'El precio es requerido' });
  }
  if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    return res.status(400).json({ message: 'El precio debe ser un número positivo' });
  }

  // Stock opcional pero debe ser entero positivo si viene
  if (stock !== undefined && stock !== '') {
    if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      return res.status(400).json({ message: 'El stock debe ser un número entero positivo' });
    }
  }

  // Min stock opcional pero debe ser entero positivo si viene
  if (min_stock !== undefined && min_stock !== '') {
    if (isNaN(parseInt(min_stock)) || parseInt(min_stock) < 0) {
      return res.status(400).json({ message: 'El stock mínimo debe ser un número entero positivo' });
    }
  }

  // Normalizar campos
  req.body.name = name.trim();
  req.body.sku = sku.trim().toUpperCase();
  req.body.category_id = parseInt(category_id);
  req.body.supplier_id = req.body.supplier_id ? parseInt(req.body.supplier_id) : null;
  req.body.price = parseFloat(price);
  req.body.stock = stock !== undefined && stock !== '' ? parseInt(stock) : 0;
  req.body.min_stock = min_stock !== undefined && min_stock !== '' ? parseInt(min_stock) : 5;
  req.body.unit = req.body.unit?.trim() || 'piezas';
  req.body.description = req.body.description?.trim() || null;

  next();
};