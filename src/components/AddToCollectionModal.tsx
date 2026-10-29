import { useState } from 'react';
import type { Collection } from '../types';

type Props = {
  recipeId: string;
  recipeTitle: string;
  collections: Collection[];
  onAdd: (collectionId: string) => void;
  onClose: () => void;
};

export default function AddToCollectionModal({ recipeId, recipeTitle, collections, onAdd, onClose }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Filter out collections that already contain this recipe
  const availableCollections = collections.filter((c) => !c.recipeIds.includes(recipeId));

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

  const handleConfirm = () => {
    for (const id of selected) {
      onAdd(id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-t-xl sm:rounded-xl max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            将「{recipeTitle}」加入合集
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {availableCollections.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">所有合集都已包含此菜谱</p>
          ) : (
            availableCollections.map((col) => (
              <label
                key={col.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.has(col.id)}
                  onChange={() => toggle(col.id)}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                />
                <span className="text-sm text-gray-700">{col.name}</span>
                <span className="text-xs text-gray-400 ml-auto">{col.recipeIds.length} 道菜</span>
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
            确认加入（{selected.size}）
          </button>
        </div>
      </div>
    </div>
  );
}
