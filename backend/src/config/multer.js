import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB máximo
  fileFilter,
});

export default upload;