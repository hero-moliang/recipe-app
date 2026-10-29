import { useEffect, useState } from 'react';
import { getImage } from '../db';

type Props = {
  recipeId: string;
  title: string;
  priority: number;
  tags: string[];
  className?: string;
};

export default function RecipeCard({ recipeId, title, priority, tags, className = '' }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    getImage(recipeId).then((blob) => {
      if (blob) {
        url = URL.createObjectURL(blob);
        setImageUrl(url);
      }
    });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [recipeId]);

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}
    >
      {/* Cover image */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block px-1.5 py-0.5 text-[10px] bg-orange-50 text-orange-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-gray-400">P{priority}</span>
        </div>
      </div>
    </div>
  );
}
