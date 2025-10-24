/**
 * Image Compression Utility
 * Compresses images before upload to reduce Firebase Storage costs
 */

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxSizeMB: 0.8, // Max 800KB per image
  maxWidthOrHeight: 1920, // Max 1080p resolution
  quality: 0.85, // 85% quality (good balance)
};

/**
 * Compress image file before upload
 * Uses Canvas API for compression
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Skip compression for small images (< 200KB)
  if (file.size < 200 * 1024) {
    return file;
  }

  try {
    // Create image element
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    // Load image
    const imageUrl = URL.createObjectURL(file);
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Calculate new dimensions
    let { width, height } = img;
    const maxDimension = opts.maxWidthOrHeight;

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = (height / width) * maxDimension;
        width = maxDimension;
      } else {
        width = (width / height) * maxDimension;
        height = maxDimension;
      }
    }

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Draw and compress image
    ctx.drawImage(img, 0, 0, width, height);

    // Clean up
    URL.revokeObjectURL(imageUrl);

    // Convert to blob with compression
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        file.type,
        opts.quality
      );
    });

    if (!blob) {
      throw new Error('Failed to compress image');
    }

    // Check if compressed size is acceptable
    const maxBytes = opts.maxSizeMB * 1024 * 1024;
    if (blob.size > maxBytes) {
      // Try again with lower quality
      const lowerQuality = Math.max(0.5, opts.quality - 0.2);
      return compressImage(file, { ...opts, quality: lowerQuality });
    }

    // Create compressed file
    const compressedFile = new File([blob], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });

    console.log(
      `Image compressed: ${(file.size / 1024).toFixed(1)}KB → ${(
        compressedFile.size / 1024
      ).toFixed(1)}KB (${(
        ((file.size - compressedFile.size) / file.size) *
        100
      ).toFixed(1)}% reduction)`
    );

    return compressedFile;
  } catch (error) {
    console.error('Image compression failed, using original:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Compress multiple images
 */
export async function compressImages(
  files: File[],
  options?: CompressionOptions
): Promise<File[]> {
  return Promise.all(files.map((file) => compressImage(file, options)));
}

/**
 * Validate image file
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
