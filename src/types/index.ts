export type Ingredient = {
  id: string;
  name: string;
  amount?: string;
  unit?: string;
};

export type Step = {
  id: string;
  text: string;
};

export type VideoLink = {
  id: string;
  platform: 'douyin';
  url: string;
  rawText?: string;
  title?: string;
};

export type Recipe = {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  servings?: string;
  priority: number;
  ingredients: Ingredient[];
  steps: Step[];
  notes?: string;
  videoLinks: VideoLink[];
  createdAt: number;
  updatedAt: number;
};

export type Collection = {
  id: string;
  name: string;
  description?: string;
  recipeIds: string[];
  sortMode: 'priority' | 'manual';
  createdAt: number;
  updatedAt: number;
};

export type RecipeWithImage = Recipe & {
  coverImage?: Blob;
};

export type BackupData = {
  recipes: Recipe[];
  collections: Collection[];
  images: Record<string, string>; // recipeId -> base64
};
