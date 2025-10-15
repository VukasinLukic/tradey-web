import { useParams } from 'react-router-dom';
import { usePost } from '../hooks/usePost';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { ClothingConditions } from '../types/entities';
import { useState } from 'react';

export function ItemViewPage() {
  const { id } = useParams<{ id: string }>();
  const { post, loading } = usePost(id);
  const [mainImage, setMainImage] = useState<string | null>(null);

  if (loading) {
    return <div className="flex justify-center mt-16"><Spinner size="lg" /></div>;
  }

  if (!post) {
    return <div className="text-center text-red-500">Post not found.</div>;
  }

  const images = post.images || [];
  const currentMainImage = mainImage || images[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Image Gallery */}
      <div className="lg:col-span-2">
        <div className="aspect-square bg-gray-900 rounded-lg mb-4 overflow-hidden">
          <img src={currentMainImage} alt={post.title} className="w-full h-full object-cover"/>
        </div>
        <div className="flex gap-2">
          {images.map((img, index) => (
            <button key={index} onClick={() => setMainImage(img)} className={`w-20 h-20 rounded-md overflow-hidden ${img === currentMainImage ? 'ring-2 ring-red-500' : ''}`}>
              <img src={img} alt={`${post.title} thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
            </button>
          ))}
        </div>
      </div>

      {/* Post Details */}
      <div className="lg:col-span-1">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-xl text-gray-400 mt-1">{post.brand}</p>
        <hr className="border-gray-800 my-4" />
        <div className="space-y-3 text-sm">
          <p><span className="font-semibold text-gray-400">Condition:</span> {ClothingConditions[post.condition as keyof typeof ClothingConditions]}</p>
          <p><span className="font-semibold text-gray-400">Size:</span> {post.size}</p>
          <p><span className="font-semibold text-gray-400">Location:</span> {post.authorLocation}</p>
          <p className="font-semibold text-gray-400">Description:</p>
          <p className="text-gray-300 whitespace-pre-wrap">{post.description}</p>
          <p className="font-semibold text-gray-400 pt-2">Would NOT trade for:</p>
          <p className="text-gray-300">{post.tradePreferences || 'N/A'}</p>
        </div>
        <div className="mt-8">
          <Button>Start a Trade</Button>
        </div>
      </div>
    </div>
  );
} 