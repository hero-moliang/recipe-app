import { useState } from 'react';
import type { Recipe } from '../types';

type Props = {
  collectionId: string;
  collectionName: string;
  recipes: Recipe[];
  existingRecipeIds: string[];
  onAdd: (recipeIds: string[]) => void;
  onClose: () => void;
};

export default function AddRecipesModal({ collectionName, recipes, existingRecipeIds, onAdd, onClose }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const availableRecipes = recipes.filter((r) => !existingRecipeIds.includes(r.id));
  const filteredRecipes = search.trim()
    ? availableRecipes.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : availableRecipes;

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleConfirm = () => {
    onAdd(Array.from(selected));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-t-xl sm:rounded-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            添加菜谱到「{collectionName}」
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索菜谱..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-orange-400 outline-none"
          />
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {filteredRecipes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              {search ? '没有找到匹配的菜谱' : '没有可添加的菜谱'}
            </p>
          ) : (
            filteredRecipes.map((recipe) => (
              <label
                key={recipe.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.has(recipe.id)}
                  onChange={() => toggle(recipe.id)}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                />
                <span className="text-sm text-gray-700">{recipe.title}</span>
                <span className="text-xs text-gray-400 ml-auto">P{recipe.priority}</span>
              </label>
            ))
          )}
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleConfirm}
            disabled={selected.size === 0}
            className="w-full py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            添加（{selected.size}）
          </button>
        </div>
      </div>
    </div>
  );
}
