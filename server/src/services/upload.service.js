import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { ValidationError } from '../utils/errors.js';

export async function uploadImage(buffer, folder = 'relax-station') {
  if (!isCloudinaryConfigured) {
    throw new ValidationError(
      'Image upload is not configured. Set Cloudinary environment variables.'
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId) {
  if (!publicId || !isCloudinaryConfigured) return;
  await cloudinary.uploader.destroy(publicId);
}
