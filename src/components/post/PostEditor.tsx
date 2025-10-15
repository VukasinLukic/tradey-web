import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useUiStore } from '../../store/uiStore';
import { uploadPostImages } from '../../firebase/storageService';

import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ImageUploader } from './ImageUploader';
import { ClothingConditions } from '../../types/entities';
import type { Post, ClothingCondition } from '../../types/entities';

export function PostEditor() {
  const navigate = useNavigate();
  const { userProfile } = useUserProfile(auth.currentUser?.uid);
  const showToast = useUiStore((state) => state.showToast);
  
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState<ClothingCondition>('GOOD');
  const [description, setDescription] = useState('');
  const [tradePreferences, setTradePreferences] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!auth.currentUser || !userProfile) {
      return showToast("You must be logged in to post.", 'error');
    }
    if (files.length === 0) {
      return showToast("Please upload at least one image.", 'error');
    }
    if (!title || !brand || !size || !description) {
      return showToast("Please fill out all required fields.", 'error');
    }

    setLoading(true);

    try {
      const imageUrls = await uploadPostImages(files);
      
      const newPost: Omit<Post, 'id'> = {
        title,
        description,
        brand,
        condition,
        size,
        images: imageUrls,
        tradePreferences,
        authorId: auth.currentUser.uid,
        authorUsername: userProfile.username,
        authorLocation: userProfile.location,
        createdAt: serverTimestamp(),
        isAvailable: true,
      };

      await addDoc(collection(db, "posts"), newPost);
      
      showToast("Post created successfully!", 'success');
      navigate('/profile');

    } catch (err) {
      console.error("Error creating post:", err);
      showToast("Failed to create post. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <ImageUploader onFilesChange={setFiles} />
      </div>
      
      <Input id="title" label="Title / Item Name" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input id="brand" label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
      <Input id="size" label="Size (e.g., M, 42, L)" value={size} onChange={(e) => setSize(e.target.value)} required />
      
      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-gray-300 mb-1">Condition</label>
        <select
          id="condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value as ClothingCondition)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {Object.entries(ClothingConditions).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Describe the item, its history, any flaws..."
        ></textarea>
      </div>

      <div className="md:col-span-2">
        <Input
          id="tradePreferences"
          label="I would NOT trade this for..."
          value={tradePreferences}
          onChange={(e) => setTradePreferences(e.target.value)}
          placeholder="e.g., T-shirts, non-branded items..."
        />
      </div>

      <div className="md:col-span-2 text-right">
        <div className="w-full md:w-auto md:inline-block">
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Post'}
          </Button>
        </div>
      </div>
    </form>
  );
}
