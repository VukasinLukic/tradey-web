import { Request, Response, NextFunction } from 'express';

/**
 * Validate uploaded image files using MIME type checking
 * This validates based on file extension and declared MIME type
 *
 * Note: For production, consider adding real file type verification
 * using a library compatible with your Node.js setup
 */
export async function validateImageFiles(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Collect all files to validate (handles both req.files and req.file)
    const filesToValidate: Express.Multer.File[] = [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      filesToValidate.push(...req.files);
    } else if (req.file) {
      filesToValidate.push(req.file);
    }

    // If no files, continue
    if (filesToValidate.length === 0) {
      return next();
    }

    // Allowed MIME types for images
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    // Validate each file
    for (const file of filesToValidate) {
      // Basic MIME type validation
      if (!allowedMimeTypes.includes(file.mimetype)) {
        res.status(400).json({
          message: `Invalid file type: ${file.mimetype}. Only images are allowed (JPEG, PNG, WebP, GIF).`,
          error: 'INVALID_MIME_TYPE',
          detected: file.mimetype,
          allowed: allowedMimeTypes,
        });
        return;
      }

      // Basic size check (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        res.status(400).json({
          message: 'File too large. Maximum size is 10MB.',
          error: 'FILE_TOO_LARGE',
          size: file.size,
          maxSize,
        });
        return;
      }

      // Check for file extension
      const originalName = file.originalname.toLowerCase();
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const hasValidExtension = validExtensions.some(ext => originalName.endsWith(ext));

      if (!hasValidExtension) {
        res.status(400).json({
          message: 'Invalid file extension. Only .jpg, .jpeg, .png, .webp, .gif are allowed.',
          error: 'INVALID_FILE_EXTENSION',
          filename: file.originalname,
        });
        return;
      }
    }

    // All files validated successfully
    next();
  } catch (error) {
    console.error('File validation error:', error);
    res.status(500).json({
      message: 'Error validating uploaded files',
      error: 'FILE_VALIDATION_ERROR',
    });
  }
}
