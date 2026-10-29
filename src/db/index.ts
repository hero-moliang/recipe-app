import Dexie, { type Table } from 'dexie';
import type { Recipe, Collection } from '../types';

class RecipeDatabase extends Dexie {
  recipes!: Table<Recipe, string>;
  collections!: Table<Collection, string>;
  images!: Table<{ id: string; blob: Blob }, string>;

  constructor() {
    super('RecipeApp');
    this.version(1).stores({
      recipes: 'id, title, priority, createdAt, updatedAt, *tags',
      collections: 'id, name, createdAt, updatedAt',
      images: 'id',
    });
  }
}

export const db = new RecipeDatabase();

// --- Recipe CRUD ---

export async function getAllRecipes(): Promise<Recipe[]> {
  return db.recipes.toArray();
}

export async function getRecipe(id: string): Promise<Recipe | undefined> {
  return db.recipes.get(id);
}

export async function getNextPriority(): Promise<number> {
  const all = await db.recipes.toArray();
  if (all.length === 0) return 1;
  return Math.max(...all.map((r) => r.priority)) + 1;
}

export async function saveRecipe(recipe: Recipe): Promise<void> {
  await db.recipes.put(recipe);
}

export async function deleteRecipe(id: string): Promise<void> {
  await db.transaction('rw', [db.recipes, db.collections, db.images], async () => {
    await db.recipes.delete(id);
    await db.images.delete(id);
    // Remove from all collections
    const collections = await db.collections.toArray();
    for (const col of collections) {
      if (col.recipeIds.includes(id)) {
        col.recipeIds = col.recipeIds.filter((rid) => rid !== id);
        col.updatedAt = Date.now();
        await db.collections.put(col);
      }
    }
  });
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const q = query.toLowerCase().trim();
  if (!q) return getAllRecipes();
  const all = await db.recipes.toArray();
  return all.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q)) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(q))
  );
}

export async function getSortedRecipes(): Promise<Recipe[]> {
  const all = await db.recipes.toArray();
  return all.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.updatedAt - a.updatedAt;
  });
}

// --- Image CRUD ---

export async function getImage(recipeId: string): Promise<Blob | undefined> {
  const record = await db.images.get(recipeId);
  return record?.blob;
}

export async function saveImage(recipeId: string, blob: Blob): Promise<void> {
  await db.images.put({ id: recipeId, blob });
}

export async function deleteImage(recipeId: string): Promise<void> {
  await db.images.delete(recipeId);
}

// --- Collection CRUD ---

export async function getAllCollections(): Promise<Collection[]> {
  return db.collections.toArray();
}

export async function getCollection(id: string): Promise<Collection | undefined> {
  return db.collections.get(id);
}

export async function saveCollection(collection: Collection): Promise<void> {
  await db.collections.put(collection);
}

export async function deleteCollection(id: string): Promise<void> {
  await db.collections.delete(id);
}

export async function addRecipeToCollection(collectionId: string, recipeId: string): Promise<void> {
  const col = await db.collections.get(collectionId);
  if (!col) return;
  if (!col.recipeIds.includes(recipeId)) {
    col.recipeIds.push(recipeId);
    col.updatedAt = Date.now();
    await db.collections.put(col);
  }
}

export async function removeRecipeFromCollection(collectionId: string, recipeId: string): Promise<void> {
  const col = await db.collections.get(collectionId);
  if (!col) return;
  col.recipeIds = col.recipeIds.filter((id) => id !== recipeId);
  col.updatedAt = Date.now();
  await db.collections.put(col);
}

export async function updateCollectionSortOrder(collectionId: string, recipeIds: string[]): Promise<void> {
  const col = await db.collections.get(collectionId);
  if (!col) return;
  col.recipeIds = recipeIds;
  col.updatedAt = Date.now();
  await db.collections.put(col);
}

export async function getCollectionsForRecipe(recipeId: string): Promise<Collection[]> {
  const all = await db.collections.toArray();
  return all.filter((c) => c.recipeIds.includes(recipeId));
}

// --- Backup helpers ---

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', [db.recipes, db.collections, db.images], async () => {
    await db.recipes.clear();
    await db.collections.clear();
    await db.images.clear();
  });
}

export async function importRecipes(recipes: Recipe[]): Promise<void> {
  await db.recipes.bulkPut(recipes);
}

export async function importCollections(collections: Collection[]): Promise<void> {
  await db.collections.bulkPut(collections);
}

export async function importImages(imageMap: Record<string, Blob>): Promise<void> {
  const entries = Object.entries(imageMap).map(([id, blob]) => ({ id, blob }));
  if (entries.length > 0) {
    await db.images.bulkPut(entries);
  }
}

export async function getAllImages(): Promise<{ id: string; blob: Blob }[]> {
  return db.images.toArray();
}
