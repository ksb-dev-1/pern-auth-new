import { v2 as cloudinary } from "cloudinary";

import { config } from "./env.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

/**
 * Uploads an avatar image for a user.
 * Uses a fixed public ID: users/{userId}/avatar → subsequent uploads overwrite.
 */
export const uploadAvatar = async (
  userId: string,
  fileBuffer: Buffer,
  mimeType: string,
) => {
  const publicId = `users/${userId}/avatar`;
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: `url-shortner/profile/${userId}/avatar`,
        // public_id: publicId,
        overwrite: true, // replace existing image
        resource_type: "image",
        // folder: `url-shortner/profile/${userId}`,
        // optional: transform to square
        // transformation: [{ width: 400, height: 400, crop: 'fill' }],
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    uploadStream.end(fileBuffer);
  });
};
