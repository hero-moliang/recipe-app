import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  db,
  getAllRecipes,
  getAllCollections,
  getAllImages,
  clearAllData,
  importRecipes,
  importCollections,
  importImages,
  getRecipe,
} from '../db';
import type { Recipe, Collection } from '../types';

export async function exportBackup(): Promise<void> {
  const recipes = await getAllRecipes();
  const collections = await getAllCollections();
  const images = await getAllImages();

  const zip = new JSZip();

  zip.file('recipes.json', JSON.stringify(recipes, null, 2));
  zip.file('collections.json', JSON.stringify(collections, null, 2));

  const imgFolder = zip.folder('images')!;
  for (const { id, blob } of images) {
    imgFolder.file(`${id}.jpg`, blob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(content, `recipe-backup-${timestamp}.zip`);
}

export type ImportMode = 'merge' | 'overwrite';

export async function importBackup(
  file: File,
  mode: ImportMode,
  onProgress?: (msg: string) => void
): Promise<void> {
  const zip = await JSZip.loadAsync(file);

  const recipesJson = await zip.file('recipes.json')?.async('string');
  const collectionsJson = await zip.file('collections.json')?.async('string');

  if (!recipesJson) {
    throw new Error('无效的备份文件：缺少 recipes.json');
  }

  const recipes: Recipe[] = JSON.parse(recipesJson);
  const collections: Collection[] = collectionsJson ? JSON.parse(collectionsJson) : [];

  await db.transaction('rw', [db.recipes, db.collections, db.images], async () => {
    if (mode === 'overwrite') {
      onProgress?.('清空现有数据...');
      await clearAllData();
    }

    onProgress?.('导入菜谱数据...');
    await importRecipes(recipes);

    onProgress?.('导入合集数据...');
    await importCollections(collections);

    // Import images
    const imgFolder = zip.folder('images');
    if (imgFolder) {
      const imageFiles = Object.keys(imgFolder.files).filter(
        (name) => !imgFolder.files[name].dir && name !== 'images/'
      );

      const imageMap: Record<string, Blob> = {};
      for (const fileName of imageFiles) {
        const blob = await zip.file(fileName)?.async('blob');
        if (blob) {
          const recipeId = fileName.replace('images/', '').replace('.jpg', '');
          if (mode === 'overwrite' || (await getRecipe(recipeId))) {
            imageMap[recipeId] = blob;
          }
        }
      }
      if (Object.keys(imageMap).length > 0) {
        onProgress?.('导入封面图片...');
        await importImages(imageMap);
      }
    }
  });

  onProgress?.('导入完成！');
}
