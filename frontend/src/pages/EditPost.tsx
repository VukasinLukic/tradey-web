import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePost } from '../hooks/usePost';
import { Spinner } from '../components/ui/Spinner';
import { ClothingConditions } from '../../../shared/types/post.types';
import type { ClothingCondition } from '../../../shared/types/post.types';
import { postsApi } from '../services/api';
import { CLOTHING_SIZES, CLOTHING_TYPES, CLOTHING_STYLES } from '../constants/clothing';

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { post, loading: postLoading } = usePost(id);

  // Form state
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState(CLOTHING_SIZES[0]);
  const [type, setType] = useState(CLOTHING_TYPES[0]);
  const [style, setStyle] = useState(CLOTHING_STYLES[0]);
  const [condition, setCondition] = useState<ClothingCondition>('GOOD');
  const [description, setDescription] = useState('');
  const [tradePreferences, setTradePreferences] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when post loads
  useEffect(() => {
    console.log('EditPost - Post data:', post);
    console.log('EditPost - User UID:', user?.uid);
    console.log('EditPost - Post loading:', postLoading);

    // Wait for both post and user to load
    if (!post || !user) {
      console.log('Waiting for post or user to load...');
      return;
    }

    // Check if user is the owner
    if (post.authorId !== user.uid) {
      console.log('Not owner, redirecting...', {
        postAuthorId: post.authorId,
        userUid: user.uid
      });
      navigate(`/item/${id}`);
      return;
    }

    console.log('Setting form data from post...');
    setTitle(post.title);
    setBrand(post.brand);
    setSize(post.size);
    setType(post.type || 'T-Shirt');
    setStyle(post.style || 'Casual');
    setCondition(post.condition);
    setDescription(post.description);
    setTradePreferences(post.tradePreferences || '');
    setExistingImages(post.images || []);
  }, [post, user, id, navigate, postLoading]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Limit to 5 images total
    const totalImages = existingImages.length + images.length + files.length;
    if (totalImages > 5) {
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

    setImages(prev => [...prev, ...files]);
    setError(null);

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  // Remove new image
  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Remove existing image
  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !id) {
      setError('You must be logged in to edit a post');
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
    if (!type.trim()) {
      setError('Type is required');
      return;
    }
    if (!style.trim()) {
      setError('Style is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (existingImages.length === 0 && images.length === 0) {
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
      formData.append('size', size);
      formData.append('type', type);
      formData.append('style', style);
      formData.append('condition', condition);
      formData.append('description', description.trim());
      if (tradePreferences.trim()) {
        formData.append('tradePreferences', tradePreferences.trim());
      }

      // Send existing images as JSON array
      formData.append('images', JSON.stringify(existingImages));

      // Append new image files
      images.forEach((image) => {
        formData.append('images', image);
      });

      // Send to backend API
      await postsApi.update(id, formData);

      // Success - navigate to item view
      navigate(`/item/${id}`);
    } catch (err: any) {
      console.error('Error updating post:', err);
      const errorData = err.response?.data;
      if (errorData && errorData.errors) {
        const messages = errorData.errors.map((e: { message: string }) => e.message).join('\n');
        setError(`Please fix the following errors:\n${messages}`);
      } else if (errorData && errorData.error) {
        setError(errorData.error);
      } else {
        setError('Failed to update post. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (postLoading || !user) {
    return (
      <div className="flex justify-center mt-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="font-fayte text-2xl text-tradey-red mb-4">Post not found</h2>
        <button onClick={() => navigate('/profile')} className="text-tradey-blue hover:underline">
          Back to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-fayte text-5xl md:text-6xl text-tradey-black mb-2 tracking-tight uppercase">
          Edit Post
        </h1>
        <p className="font-sans text-tradey-black/60 text-sm">
          Update your item details
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

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="font-sans text-tradey-black/60 text-xs mb-2">Current Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((imageUrl, index) => (
                  <div key={`existing-${index}`} className="relative aspect-[3/4] bg-gray-100 group">
                    <img
                      src={imageUrl}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4 stroke-tradey-black" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image previews */}
          {imagePreviews.length > 0 && (
            <div className="mb-4">
              <p className="font-sans text-tradey-black/60 text-xs mb-2">New Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative aspect-[3/4] bg-gray-100 group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4 stroke-tradey-black" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload button */}
          {(existingImages.length + imagePreviews.length) < 5 && (
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
                  Click to upload more images
                </p>
                <p className="font-sans text-tradey-black/40 text-xs">
                  JPG, PNG or WebP (max 5MB each, up to 5 images total)
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
            {existingImages.length + imagePreviews.length} / 5 images
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
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-4 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm focus:outline-none focus:border-tradey-red transition-colors cursor-pointer bg-white"
            >
              {CLOTHING_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block font-sans text-tradey-black/80 text-sm font-medium mb-2">
              Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm focus:outline-none focus:border-tradey-red transition-colors cursor-pointer bg-white"
            >
              {CLOTHING_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Style */}
          <div>
            <label className="block font-sans text-tradey-black/80 text-sm font-medium mb-2">
              Style *
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm focus:outline-none focus:border-tradey-red transition-colors cursor-pointer bg-white"
            >
              {CLOTHING_STYLES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
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
            onClick={() => navigate(`/item/${id}`)}
            disabled={loading}
            className="px-8 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm hover:border-tradey-black transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || (existingImages.length === 0 && images.length === 0)}
            className="flex-1 px-8 py-3 bg-tradey-red text-white font-sans text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner />
                <span>Updating...</span>
              </>
            ) : (
              'Update Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
