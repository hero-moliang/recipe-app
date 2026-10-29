import { useState, useEffect } from 'react';
import { getImage } from '../db';
import { openDouyinUrl } from '../utils/douyin';

type Props = {
  recipe: {
    id: string;
    title: string;
    description?: string;
    tags: string[];
    servings?: string;
    priority: number;
    ingredients: { id: string; name: string; amount?: string; unit?: string }[];
    steps: { id: string; text: string }[];
    notes?: string;
    videoLinks: { id: string; platform: string; url: string; title?: string }[];
    createdAt: number;
    updatedAt: number;
  };
  onEdit: () => void;
  onDelete: () => void;
  onAddToCollection: () => void;
};

export default function RecipeDetail({ recipe, onEdit, onDelete, onAddToCollection }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    getImage(recipe.id).then((blob) => {
      if (blob) {
        url = URL.createObjectURL(blob);
        setImageUrl(url);
      }
    });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [recipe.id]);

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
      {/* Cover image */}
      {imageUrl && (
        <img src={imageUrl} alt={recipe.title} className="w-full rounded-xl object-cover max-h-72" />
      )}

      {/* Title and actions */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">{recipe.title}</h1>
        {recipe.description && (
          <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{recipe.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-400">优先级 {recipe.priority}</span>
          {recipe.servings && (
            <span className="text-xs text-gray-400">· {recipe.servings}</span>
          )}
        </div>
      </div>

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs bg-orange-50 text-orange-600 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Ingredients */}
      {recipe.ingredients.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-2">原材料</h2>
          <div className="bg-gray-50 rounded-lg divide-y divide-gray-100">
            {recipe.ingredients.map((item) => (
              <div key={item.id} className="flex justify-between px-3 py-2 text-sm">
                <span className="text-gray-700">{item.name}</span>
                <span className="text-gray-500">
                  {item.amount}
                  {item.unit && ` ${item.unit}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Steps */}
      {recipe.steps.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-2">步骤</h2>
          <div className="space-y-3">
            {recipe.steps.map((step, index) => (
              <div key={step.id} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed pt-0.5 whitespace-pre-wrap">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {recipe.notes && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-2">注意事项</h2>
          <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg whitespace-pre-wrap">
            {recipe.notes}
          </p>
        </div>
      )}

      {/* Video links */}
      {recipe.videoLinks.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-2">视频</h2>
          <div className="space-y-2">
            {recipe.videoLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0 mr-2">
                  {link.title && <p className="text-sm font-medium text-gray-700">{link.title}</p>}
                  <p className="text-xs text-gray-400 truncate">{link.url}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => openDouyinUrl(link.url)}
                    className="px-2.5 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    看视频
                  </button>
                  <button
                    onClick={() => copyUrl(link.url)}
                    className="px-2.5 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                  >
                    复制
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onEdit}
          className="flex-1 py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          编辑
        </button>
        <button
          onClick={onAddToCollection}
          className="flex-1 py-2.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          加入合集
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          删除
        </button>
      </div>
    </div>
  );
}
