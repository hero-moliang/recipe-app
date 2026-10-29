import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCollection } from '../hooks/useCollections';
import { useRecipes } from '../hooks/useRecipes';
import { saveCollection, updateCollectionSortOrder } from '../db';
import SortableRecipeGrid from '../components/SortableRecipeGrid';
import AddRecipesModal from '../components/AddRecipesModal';

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const collection = useCollection(id);
  const allRecipes = useRecipes();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const recipesInCollection = useMemo(() => {
    if (!collection) return [];
    return allRecipes.filter((r) => collection.recipeIds.includes(r.id));
  }, [collection, allRecipes]);

  const sortedByPriority = useMemo(() => {
    return [...recipesInCollection].sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return b.updatedAt - a.updatedAt;
    });
  }, [recipesInCollection]);

  const orderedIds =
    collection?.sortMode === 'priority'
      ? sortedByPriority.map((r) => r.id)
      : collection?.recipeIds.filter((rid) => recipesInCollection.some((r) => r.id === rid)) ?? [];

  if (!collection) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>合集不存在</p>
        <button onClick={() => navigate('/collections')} className="mt-2 text-sm text-orange-500">
          返回合集列表
        </button>
      </div>
    );
  }

  const handleSortModeChange = async (mode: 'priority' | 'manual') => {
    if (mode === collection.sortMode) return;
    await saveCollection({ ...collection, sortMode: mode, updatedAt: Date.now() });
  };

  const handleReorder = async (newIds: string[]) => {
    try {
      await updateCollectionSortOrder(collection.id, newIds);
    } catch {
      alert('排序保存失败，请重试');
    }
  };

  const handleAddRecipes = async (recipeIds: string[]) => {
    const updated = { ...collection };
    for (const rid of recipeIds) {
      if (!updated.recipeIds.includes(rid)) {
        updated.recipeIds.push(rid);
      }
    }
    updated.updatedAt = Date.now();
    await saveCollection(updated);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    await saveCollection({
      ...collection,
      name: editName.trim(),
      description: editDesc.trim() || undefined,
      updatedAt: Date.now(),
    });
    setEditing(false);
  };

  const startEditing = () => {
    setEditName(collection.name);
    setEditDesc(collection.description ?? '');
    setEditing(true);
  };

  const isManual = collection.sortMode === 'manual';

  return (
    <div className="px-4 py-3">
      {/* Header */}
      <div className="flex items-center mb-3">
        <button onClick={() => navigate('/collections')} className="text-gray-600 hover:text-gray-900 mr-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-lg font-semibold text-gray-900 w-full outline-none border-b border-orange-400"
              autoFocus
            />
          ) : (
            <h1 className="text-lg font-semibold text-gray-900 truncate">{collection.name}</h1>
          )}
        </div>
        <button
          onClick={editing ? handleSaveEdit : startEditing}
          className="ml-2 text-sm text-orange-500 hover:text-orange-600"
        >
          {editing ? '保存' : '编辑'}
        </button>
      </div>

      {/* Description */}
      {(collection.description || editing) && (
        <div className="mb-3">
          {editing ? (
            <input
              type="text"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="合集简介（可选）"
              className="w-full text-sm text-gray-600 outline-none border-b border-gray-200 focus:border-orange-400 pb-1"
            />
          ) : (
            <p className="text-sm text-gray-500">{collection.description}</p>
          )}
        </div>
      )}

      {/* Sort mode toggle + add button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => handleSortModeChange('priority')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
              !isManual ? 'bg-white text-orange-600 shadow-sm font-medium' : 'text-gray-500'
            }`}
          >
            按优先级
          </button>
          <button
            onClick={() => handleSortModeChange('manual')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
              isManual ? 'bg-white text-orange-600 shadow-sm font-medium' : 'text-gray-500'
            }`}
          >
            按手动顺序
          </button>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          + 添加菜谱
        </button>
      </div>

      {/* Recipe grid */}
      <SortableRecipeGrid
        recipes={recipesInCollection}
        orderedIds={orderedIds}
        showHandle={isManual}
        onReorder={isManual ? handleReorder : undefined}
      />

      {/* Hint for manual mode */}
      {isManual && recipesInCollection.length > 0 && (
        <div className="mt-4 space-y-1">
          <p className="text-xs text-gray-400 mb-1">长按拖拽手柄排序 · 点击菜谱查看详情</p>
        </div>
      )}

      {/* Add recipes modal */}
      {showAddModal && (
        <AddRecipesModal
          collectionId={collection.id}
          collectionName={collection.name}
          recipes={allRecipes}
          existingRecipeIds={collection.recipeIds}
          onAdd={handleAddRecipes}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
