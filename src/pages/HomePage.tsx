import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecipeSearch } from '../hooks/useRecipes';
import RecipeCard from '../components/RecipeCard';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const recipes = useRecipeSearch(query);

  return (
    <div className="px-4 py-3">
      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索菜谱、标签、原材料..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Recipe grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-16">
          {query ? (
            <p className="text-gray-400">没有找到「{query}」相关的菜谱</p>
          ) : (
            <>
              <div className="text-4xl mb-3">🍳</div>
              <p className="text-gray-500 mb-4">还没有菜谱，开始记录你会做的菜吧</p>
              <Link
                to="/recipes/new"
                className="inline-block px-5 py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                新建菜谱
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {recipes.map((recipe) => (
            <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
              <RecipeCard
                recipeId={recipe.id}
                title={recipe.title}
                priority={recipe.priority}
                tags={recipe.tags}
              />
            </Link>
          ))}
        </div>
      )}

      {/* FAB: New recipe */}
      <Link
        to="/recipes/new"
        className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors z-20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
}
