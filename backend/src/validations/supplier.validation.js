export const validateSupplier = (req, res, next) => {
  const { name, phone, email } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'El nombre del proveedor es requerido' });
  }

  if (name.trim().length > 150) {
    return res.status(400).json({ message: 'El nombre no puede superar 150 caracteres' });
  }

  if (email && email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'El email no tiene un formato válido' });
    }
    req.body.email = email.trim().toLowerCase();
  } else {
    req.body.email = null;
  }

  if (phone && phone.trim() !== '') {
    req.body.phone = phone.trim();
  } else {
    req.body.phone = null;
  }

  req.body.name = name.trim();

  next();
};