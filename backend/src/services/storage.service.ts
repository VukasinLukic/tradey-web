import { storage } from '../config/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for handling Firebase Storage operations
 * Manages image uploads, deletions, and URL generation
 */
export class StorageService {
  /**
   * Upload an image to Firebase Storage
   * @param file - Multer file object
   * @param userId - User ID for organizing files
   * @returns Public URL of the uploaded image
   */
  async uploadImage(file: Express.Multer.File, userId: string): Promise<string> {
    try {
      // Generate unique filename with timestamp and UUID
      const fileExtension = file.mimetype.split('/')[1];
      const fileName = `posts/${userId}/${Date.now()}-${uuidv4()}.${fileExtension}`;

      const fileUpload = storage.file(fileName);

      // Upload file buffer to storage
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
          metadata: {
            uploadedBy: userId,
            uploadedAt: new Date().toISOString(),
          },
        },
        resumable: false,
      });

      // Make file publicly accessible
      await fileUpload.makePublic();

      // Return public URL
      const publicUrl = `https://storage.googleapis.com/${storage.name}/${fileName}`;
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Upload multiple images
   * @param files - Array of Multer file objects
   * @param userId - User ID for organizing files
   * @returns Array of public URLs
   */
  async uploadImages(files: Express.Multer.File[], userId: string): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, userId));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error('Failed to upload images');
    }
  }

  /**
   * Delete an image from Firebase Storage
   * @param imageUrl - Public URL of the image to delete
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      const fileName = imageUrl.split(`${storage.name}/`)[1];

      if (!fileName) {
        throw new Error('Invalid image URL');
      }

      const file = storage.file(fileName);
      await file.delete();
    } catch (error: any) {
      console.error('Error deleting image:', error);
      // Don't throw error if file doesn't exist
      if (error.code !== 404) {
        throw new Error('Failed to delete image');
      }
    }
  }

  /**
   * Delete multiple images
   * @param imageUrls - Array of public URLs to delete
   */
  async deleteImages(imageUrls: string[]): Promise<void> {
    try {
      const deletePromises = imageUrls.map(url => this.deleteImage(url));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting multiple images:', error);
      // Continue even if some deletions fail
    }
  }

  /**
   * Upload user avatar
   * @param file - Multer file object
   * @param userId - User ID
   * @returns Public URL of the uploaded avatar
   */
  async uploadAvatar(file: Express.Multer.File, userId: string): Promise<string> {
    try {
      const fileExtension = file.mimetype.split('/')[1];
      const fileName = `avatars/${userId}/avatar-${Date.now()}.${fileExtension}`;

      const fileUpload = storage.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
      });

      await fileUpload.makePublic();

      return `https://storage.googleapis.com/${storage.name}/${fileName}`;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new Error('Failed to upload avatar');
    }
  }
}

// Export singleton instance
export default new StorageService();
