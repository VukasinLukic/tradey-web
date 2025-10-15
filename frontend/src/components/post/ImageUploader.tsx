import { useState, useRef } from 'react';

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}

export function ImageUploader({ onFilesChange, maxFiles = 5 }: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
    setFiles(newFiles);
    onFilesChange(newFiles);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    const updatedPreviews = previews.filter((_, index) => index !== indexToRemove);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onFilesChange(updatedFiles);
  };

  return (
    <div>
      <div className="p-4 bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg text-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-red-500 font-semibold"
        >
          Select Images (up to {maxFiles})
        </button>
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP</p>
      </div>

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square">
              <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover rounded-md" />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
