import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase/config';
import imageCompression from 'browser-image-compression';

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

async function compressFile(file: File): Promise<File> {
  try {
    const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);
    console.log(`Compressed ${file.name} from ${file.size / 1024 / 1024}MB to ${compressedFile.size / 1024 / 1024}MB`);
    return compressedFile;
  } catch (error) {
    console.error(`Failed to compress ${file.name}:`, error);
    // Return original file if compression fails
    return file;
  }
}

export async function uploadPostImages(files: File[]): Promise<string[]> {
  if (!auth.currentUser) {
    throw new Error('User is not authenticated');
  }

  const uploadPromises = files.map(async (file) => {
    const compressedFile = await compressFile(file);
    const imageRef = ref(storage, `posts/${auth.currentUser!.uid}/${Date.now()}-${compressedFile.name}`);
    await uploadBytes(imageRef, compressedFile);
    return getDownloadURL(imageRef);
  });

  return Promise.all(uploadPromises);
} 