import { useLiveQuery } from 'dexie-react-hooks';
import { db, getSortedRecipes, searchRecipes, getNextPriority } from '../db';

export function useRecipes() {
  const recipes = useLiveQuery(() => getSortedRecipes(), []);
  return recipes ?? [];
}

export function useRecipe(id: string | undefined) {
  const recipe = useLiveQuery(() => (id ? db.recipes.get(id) : undefined), [id]);
  const image = useLiveQuery(() => (id ? db.images.get(id) : undefined), [id]);
  return {
    recipe,
    coverImage: image?.blob,
  };
}

export function useRecipeSearch(query: string) {
  const results = useLiveQuery(async () => {
    if (!query.trim()) return getSortedRecipes();
    return searchRecipes(query);
  }, [query]);
  return results ?? [];
}

export function useNextPriority() {
  return getNextPriority;
}
