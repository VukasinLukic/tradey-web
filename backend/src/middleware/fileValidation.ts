import { Request, Response, NextFunction } from 'express';
import { fileTypeFromBuffer } from 'file-type';

/**
 * Validate uploaded image files using real MIME type verification
 * This prevents attackers from uploading malicious files with spoofed MIME types
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
      // Check actual file content using file-type
      const fileType = await fileTypeFromBuffer(file.buffer);

      // If file type cannot be determined, reject
      if (!fileType) {
        res.status(400).json({
          message: 'Invalid file type. Could not determine file format.',
          error: 'FILE_TYPE_UNDETERMINED',
        });
        return;
      }

      // Check if MIME type is allowed
      if (!allowedMimeTypes.includes(fileType.mime)) {
        res.status(400).json({
          message: `Invalid file type: ${fileType.mime}. Only images are allowed (JPEG, PNG, WebP, GIF).`,
          error: 'INVALID_MIME_TYPE',
          detected: fileType.mime,
          allowed: allowedMimeTypes,
        });
        return;
      }

      // Additional check: verify claimed MIME matches actual MIME
      if (file.mimetype !== fileType.mime) {
        res.status(400).json({
          message: 'File MIME type mismatch. Possible file spoofing detected.',
          error: 'MIME_TYPE_MISMATCH',
          claimed: file.mimetype,
          actual: fileType.mime,
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
