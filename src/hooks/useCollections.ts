import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useCollections() {
  const collections = useLiveQuery(() => db.collections.toArray(), []);
  return collections ?? [];
}

export function useCollection(id: string | undefined) {
  const collection = useLiveQuery(() => (id ? db.collections.get(id) : undefined), [id]);
  return collection;
}

export function useCollectionsForRecipe(recipeId: string | undefined) {
  const collections = useLiveQuery(
    async () => {
      if (!recipeId) return [];
      const all = await db.collections.toArray();
      return all.filter((c) => c.recipeIds.includes(recipeId));
    },
    [recipeId]
  );
  return collections ?? [];
}
