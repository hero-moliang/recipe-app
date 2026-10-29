import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { saveRecipe, getNextPriority } from '../db';
import TagInput from './TagInput';
import IngredientEditor from './IngredientEditor';
import StepEditor from './StepEditor';
import VideoLinkEditor from './VideoLinkEditor';
import ImageUploader from './ImageUploader';
import type { Recipe } from '../types';

type Props = {
  existingRecipe?: Recipe;
  mode: 'create' | 'edit';
};

export default function RecipeForm({ existingRecipe, mode }: Props) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [servings, setServings] = useState('');
  const [priority, setPriority] = useState(0);
  const [ingredients, setIngredients] = useState<Recipe['ingredients']>([]);
  const [steps, setSteps] = useState<Recipe['steps']>([]);
  const [notes, setNotes] = useState('');
  const [videoLinks, setVideoLinks] = useState<Recipe['videoLinks']>([]);
  const [recipeId] = useState(existingRecipe?.id ?? uuidv4());

  const [dirty, setDirty] = useState(false);
  const markDirty = () => setDirty(true);

  useEffect(() => {
    if (existingRecipe) {
      setTitle(existingRecipe.title);
      setDescription(existingRecipe.description ?? '');
      setTags(existingRecipe.tags);
      setServings(existingRecipe.servings ?? '');
      setPriority(existingRecipe.priority);
      setIngredients(existingRecipe.ingredients);
      setSteps(existingRecipe.steps);
      setNotes(existingRecipe.notes ?? '');
      setVideoLinks(existingRecipe.videoLinks);
    } else {
      getNextPriority().then(setPriority);
    }
  }, [existingRecipe]);

  // Unsaved changes warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入菜谱名称');
      return;
    }

    setSaving(true);
    try {
      const now = Date.now();
      const recipe: Recipe = {
        id: recipeId,
        title: title.trim(),
        description: description.trim() || undefined,
        tags,
        servings: servings.trim() || undefined,
        priority: priority || 1,
        ingredients: ingredients.filter((i) => i.name.trim()),
        steps: steps.filter((s) => s.text.trim()),
        notes: notes.trim() || undefined,
        videoLinks,
        createdAt: existingRecipe?.createdAt ?? now,
        updatedAt: now,
      };

      await saveRecipe(recipe);
      setDirty(false);
      navigate(`/recipes/${recipe.id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
      <h1 className="text-lg font-semibold text-gray-900">
        {mode === 'create' ? '新建菜谱' : '编辑菜谱'}
      </h1>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          菜谱名称 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); markDirty(); }}
          placeholder="例如：番茄炒蛋"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
        <textarea
          value={description}
          onChange={(e) => { setDescription(e.target.value); markDirty(); }}
          placeholder="简单描述、耗时等"
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none resize-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
        <TagInput tags={tags} onChange={(t) => { setTags(t); markDirty(); }} />
      </div>

      {/* Servings & Priority */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">份量</label>
          <input
            type="text"
            value={servings}
            onChange={(e) => { setServings(e.target.value); markDirty(); }}
            placeholder="2人份"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
          <input
            type="number"
            min={1}
            value={priority}
            onChange={(e) => { setPriority(Number(e.target.value) || 1); markDirty(); }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none"
          />
        </div>
      </div>

      {/* Cover Image */}
      <ImageUploader recipe={{ id: recipeId }} />

      {/* Ingredients */}
      <IngredientEditor ingredients={ingredients} onChange={(i) => { setIngredients(i); markDirty(); }} />

      {/* Steps */}
      <StepEditor steps={steps} onChange={(s) => { setSteps(s); markDirty(); }} />

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">注意事项</label>
        <textarea
          value={notes}
          onChange={(e) => { setNotes(e.target.value); markDirty(); }}
          placeholder="需要特别注意的点"
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none resize-none"
        />
      </div>

      {/* Video Links */}
      <VideoLinkEditor videoLinks={videoLinks} onChange={(l) => { setVideoLinks(l); markDirty(); }} />

      {/* Save / Cancel */}
      <div className="flex gap-3 pt-2 pb-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {saving ? '保存中...' : '保存'}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="flex-1 py-2.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  );
}
