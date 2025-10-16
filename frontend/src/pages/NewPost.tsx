import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';
import { ClothingConditions } from '../../../shared/types/post.types';
import type { ClothingCondition } from '../../../shared/types/post.types';
import api from '../services/api';

export function NewPostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState<ClothingCondition>('GOOD');
  const [description, setDescription] = useState('');
  const [tradePreferences, setTradePreferences] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Limit to 5 images
    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(f => !validTypes.includes(f.type));
    if (invalidFiles.length > 0) {
      setError('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter(f => f.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Each image must be less than 5MB');
      return;
    }

    setImages(files);
    setError(null);

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!brand.trim()) {
      setError('Brand is required');
      return;
    }
    if (!size.trim()) {
      setError('Size is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (images.length === 0) {
      setError('At least one image is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('brand', brand.trim());
      formData.append('size', size.trim());
      formData.append('condition', condition);
      formData.append('description', description.trim());
      formData.append('tradePreferences', tradePreferences.trim());

      // Append placeholder for images validation (backend will replace with real URLs after upload)
      const placeholders = images.map((_, i) => `placeholder-${i}`);
      formData.append('images', JSON.stringify(placeholders));

      // Append actual image files
      images.forEach((image) => {
        formData.append('images', image);
      });

      // Send to backend API
      await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Success - navigate to profile
      navigate('/profile');
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-fayte text-5xl md:text-6xl text-tradey-black mb-2 tracking-tight uppercase">
          New Post
        </h1>
        <p className="font-sans text-tradey-black/60 text-sm">
          Share your item with the community
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-8 p-4 border border-tradey-red bg-tradey-red/5">
          <p className="font-sans text-tradey-red text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Image Upload Section */}
        <div>
          <label className="block font-sans text-tradey-black/80 text-sm font-medium mb-4">
            Images *
          </label>

          {/* Image previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-[3/4] bg-gray-100 group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4 stroke-tradey-black" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          {imagePreviews.length < 5 && (
            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-tradey-black/20 hover:border-tradey-black/40 transition-colors p-12 text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-tradey-black/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="font-sans text-tradey-black/60 text-sm mb-1">
                  Click to upload images
                </p>
                <p className="font-sans text-tradey-black/40 text-xs">
                  JPG, PNG or WebP (max 5MB each, up to 5 images)
                </p>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}

          <p className="font-sans text-tradey-black/40 text-xs mt-2">
            {imagePreviews.length} / 5 images selected
          </p>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block font-sans text-tradey-black/80 text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Vintage Levi's 501 Jeans"
              maxLength={100}
              className="w-full px-4 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm placeholder:text-tradey-black/30 focus:outline-none focus:border-tradey-red transition-colors"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block font-sans text-tradey-black/80 text-sm font-medium mb-2">
              Brand *
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g., Levi's"
              className="w-full px-4 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm placeholder:text-tradey-black/30 focus:outline-none focus:border-tradey-red transition-colors"
            />
          </div>

          {/* Size */}
          <div>
            <label className="block font-sans text-tradey-black/80 text-sm font-medium mb-2">
              Size *
            </label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g., M, 32, L"
              className="w-full px-4 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm placeholder:text-tradey-black/30 focus:outline-none focus:border-tradey-red transition-colors"
            />
          </div>

          {/* Condition */}
          <div className="md:col-span-2">
            <label className="block font-sans text-tradey-black/80 text-sm font-medium mb-2">
              Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ClothingCondition)}
              className="w-full px-4 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm focus:outline-none focus:border-tradey-red transition-colors cursor-pointer bg-white"
            >
              {Object.entries(ClothingConditions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block font-sans text-tradey-black/80 text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item, its history, any flaws..."
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm placeholder:text-tradey-black/30 focus:outline-none focus:border-tradey-red transition-colors resize-none"
            />
            <p className="font-sans text-tradey-black/40 text-xs mt-1">
              {description.length} / 1000 characters
            </p>
          </div>

          {/* Trade Preferences */}
          <div className="md:col-span-2">
            <label className="block font-sans text-tradey-black/80 text-sm font-medium mb-2">
              I would NOT trade this for... (optional)
            </label>
            <input
              type="text"
              value={tradePreferences}
              onChange={(e) => setTradePreferences(e.target.value)}
              placeholder="e.g., T-shirts, non-branded items..."
              className="w-full px-4 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm placeholder:text-tradey-black/30 focus:outline-none focus:border-tradey-red transition-colors"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-6 border-t border-tradey-black/10">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            disabled={loading}
            className="px-8 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm hover:border-tradey-black transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || images.length === 0}
            className="flex-1 px-8 py-3 bg-tradey-red text-white font-sans text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner />
                <span>Publishing...</span>
              </>
            ) : (
              'Publish Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
