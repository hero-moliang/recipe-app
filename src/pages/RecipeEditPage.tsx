import { useNavigate, useParams } from 'react-router-dom';
import { useRecipe } from '../hooks/useRecipes';
import RecipeForm from '../components/RecipeForm';

export default function RecipeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe } = useRecipe(id);

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

  return (
    <div>
      <div className="px-4 py-3 flex items-center border-b border-gray-100 bg-white">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="ml-2 text-base font-medium text-gray-900">编辑菜谱</h1>
      </div>
      <RecipeForm mode="edit" existingRecipe={recipe} />
    </div>
  );
}
