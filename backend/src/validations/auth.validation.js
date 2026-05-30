export const validateLogin = (req, res, next) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email y contraseña son requeridos',
    });
  }

  req.body.email = email;
  req.body.password = password;

  next();
};