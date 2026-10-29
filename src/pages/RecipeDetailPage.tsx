import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '../hooks/useRecipes';
import { useCollections } from '../hooks/useCollections';
import { deleteRecipe, addRecipeToCollection } from '../db';
import RecipeDetailView from '../components/RecipeDetail';
import AddToCollectionModal from '../components/AddToCollectionModal';

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe } = useRecipe(id);
  const collections = useCollections();
  const [showAddModal, setShowAddModal] = useState(false);

  if (!recipe) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>菜谱不存在</p>
        <button onClick={() => navigate('/')} className="mt-2 text-sm text-orange-500">
          返回首页
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    const confirmed = confirm(
      `确定要删除「${recipe.title}」吗？\n该菜谱将从所有合集中移除。`
    );
    if (!confirmed) return;
    await deleteRecipe(recipe.id);
    navigate('/');
  };

  const handleAddToCollection = async (collectionId: string) => {
    await addRecipeToCollection(collectionId, recipe.id);
  };

  return (
    <>
      <div className="px-4 py-3 flex items-center border-b border-gray-100 bg-white">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="ml-2 text-base font-medium text-gray-900">菜谱详情</h1>
      </div>
      <RecipeDetailView
        recipe={recipe}
        onEdit={() => navigate(`/recipes/${recipe.id}/edit`)}
        onDelete={handleDelete}
        onAddToCollection={() => setShowAddModal(true)}
      />
      {showAddModal && (
        <AddToCollectionModal
          recipeId={recipe.id}
          recipeTitle={recipe.title}
          collections={collections}
          onAdd={handleAddToCollection}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  );
}
