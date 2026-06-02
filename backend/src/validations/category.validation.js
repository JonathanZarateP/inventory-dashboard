export const validateCategory = (req, res, next) => {
  const { name } = req.body;
  const description = req.body.description?.trim();

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
  }

  if (name.trim().length > 100) {
    return res.status(400).json({ message: 'El nombre no puede superar 100 caracteres' });
  }

  req.body.name = name.trim();
  req.body.description = description || null;

  next();
};