import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useCollections } from '../hooks/useCollections';
import { saveCollection, deleteCollection } from '../db';

export default function CollectionsPage() {
  const collections = useCollections();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const id = uuidv4();
    const now = Date.now();
    await saveCollection({
      id,
      name: newName.trim(),
      description: undefined,
      recipeIds: [],
      sortMode: 'priority',
      createdAt: now,
      updatedAt: now,
    });
    setNewName('');
    setShowCreate(false);
    navigate(`/collections/${id}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除合集「${name}」吗？\n合集中的菜谱不会被删除。`)) return;
    await deleteCollection(id);
  };

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">菜谱合集</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          新建合集
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-gray-500 mb-4">还没有合集，创建一个来组织你的菜谱</p>
        </div>
      ) : (
        <div className="space-y-2">
          {collections.map((col) => (
            <div key={col.id} className="flex items-center bg-white rounded-lg border border-gray-100 shadow-sm">
              <Link
                to={`/collections/${col.id}`}
                className="flex-1 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{col.name}</span>
                  <span className="text-xs text-gray-400">{col.recipeIds.length} 道菜</span>
                </div>
                {col.description && (
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{col.description}</p>
                )}
              </Link>
              <button
                onClick={() => handleDelete(col.id, col.name)}
                className="px-3 py-3 text-gray-400 hover:text-red-500"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white w-full max-w-sm mx-4 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-3">新建合集</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="合集名称"
              autoFocus
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="flex-1 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                创建
              </button>
              <button
                onClick={() => { setShowCreate(false); setNewName(''); }}
                className="flex-1 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
