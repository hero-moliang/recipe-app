import { v4 as uuidv4 } from 'uuid';
import type { Ingredient } from '../types';

type Props = {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
};

export default function IngredientEditor({ ingredients, onChange }: Props) {
  const add = () => {
    onChange([...ingredients, { id: uuidv4(), name: '', amount: '', unit: '' }]);
  };

  const remove = (id: string) => {
    onChange(ingredients.filter((i) => i.id !== id));
  };

  const update = (id: string, field: keyof Ingredient, value: string) => {
    onChange(
      ingredients.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const arr = [...ingredients];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    onChange(arr);
  };

  const moveDown = (index: number) => {
    if (index >= ingredients.length - 1) return;
    const arr = [...ingredients];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    onChange(arr);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">原材料</label>
      {ingredients.map((item, index) => (
        <div key={item.id} className="flex items-center gap-1.5">
          <div className="flex-1 grid grid-cols-[1fr_80px_60px] gap-1.5">
            <input
              type="text"
              value={item.name}
              onChange={(e) => update(item.id, 'name', e.target.value)}
              placeholder="名称"
              className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none"
            />
            <input
              type="text"
              value={item.amount ?? ''}
              onChange={(e) => update(item.id, 'amount', e.target.value)}
              placeholder="数量"
              className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none"
            />
            <input
              type="text"
              value={item.unit ?? ''}
              onChange={(e) => update(item.id, 'unit', e.target.value)}
              placeholder="单位"
              className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => moveUp(index)}
              disabled={index === 0}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs leading-none"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => moveDown(index)}
              disabled={index === ingredients.length - 1}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs leading-none"
            >
              ▼
            </button>
          </div>
          <button
            type="button"
            onClick={() => remove(item.id)}
            className="text-red-400 hover:text-red-600 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2 text-sm text-orange-600 border border-dashed border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
      >
        + 添加原材料
      </button>
    </div>
  );
}
