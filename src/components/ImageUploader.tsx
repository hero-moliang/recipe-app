import { useState } from 'react';
import { compressImage } from '../utils/image';
import { saveImage, deleteImage, getImage } from '../db';
import { useEffect } from 'react';
import type { Recipe } from '../types';

type Props = {
  recipe: Pick<Recipe, 'id'>;
};

export default function ImageUploader({ recipe }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let url: string | null = null;
    getImage(recipe.id).then((blob) => {
      if (blob) {
        url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      }
    });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [recipe.id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const compressed = await compressImage(file);
      await saveImage(recipe.id, compressed);
      const url = URL.createObjectURL(compressed);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除封面图吗？')) return;
    await deleteImage(recipe.id);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">封面图</label>
      {previewUrl ? (
        <div className="relative group">
          <img src={previewUrl} alt="封面" className="w-full rounded-lg object-cover max-h-64" />
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <label className="px-2 py-1 text-xs bg-white/90 rounded shadow cursor-pointer hover:bg-white">
              替换
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
            <button
              onClick={handleDelete}
              className="px-2 py-1 text-xs bg-red-500/90 text-white rounded shadow hover:bg-red-600"
            >
              删除
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-colors">
          {loading ? (
            <span className="text-sm text-gray-500">压缩中...</span>
          ) : (
            <>
              <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm text-gray-500">点击上传封面图</span>
            </>
          )}
          <input type="file" accept="image/*" capture="environment" onChange={handleUpload} className="hidden" />
        </label>
      )}
    </div>
  );
}
