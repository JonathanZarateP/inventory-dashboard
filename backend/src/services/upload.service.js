import cloudinary from '../config/cloudinary.js';

/**
 * Sube una imagen a Cloudinary desde un buffer (memoria).
 * Retorna la URL pública y el storage_id para eliminarla después.
 */
export const uploadImage = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder || process.env.CLOUDINARY_FOLDER,
        resource_type: 'image',
        transformation: [{ width: 800, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          image_url: result.secure_url,
          image_storage_id: result.public_id,
        });
      }
    );
    stream.end(fileBuffer);
  });
};
 //Elimina una imagen del proveedor de almacenamiento usando su storage_id.
export const deleteImage = async (storageId) => {
  if (!storageId) return;

  try {
    await cloudinary.uploader.destroy(storageId);
  } catch (error) {
    console.error('Error al eliminar imagen:', error.message);
  }
};