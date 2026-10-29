import { v4 as uuidv4 } from 'uuid';
import type { Step } from '../types';

type Props = {
  steps: Step[];
  onChange: (steps: Step[]) => void;
};

export default function StepEditor({ steps, onChange }: Props) {
  const add = () => {
    onChange([...steps, { id: uuidv4(), text: '' }]);
  };

  const remove = (id: string) => {
    onChange(steps.filter((s) => s.id !== id));
  };

  const update = (id: string, text: string) => {
    onChange(steps.map((s) => (s.id === id ? { ...s, text } : s)));
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const arr = [...steps];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    onChange(arr);
  };

  const moveDown = (index: number) => {
    if (index >= steps.length - 1) return;
    const arr = [...steps];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    onChange(arr);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">步骤</label>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start gap-2">
          <span className="flex-shrink-0 w-6 h-8 flex items-center justify-center text-xs font-medium text-gray-400">
            {index + 1}
          </span>
          <textarea
            value={step.text}
            onChange={(e) => update(step.id, e.target.value)}
            placeholder={`步骤 ${index + 1}`}
            rows={2}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none resize-none"
          />
          <div className="flex flex-col pt-1">
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
              disabled={index === steps.length - 1}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs leading-none"
            >
              ▼
            </button>
          </div>
          <button
            type="button"
            onClick={() => remove(step.id)}
            className="text-red-400 hover:text-red-600 p-1 mt-1"
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
        + 添加步骤
      </button>
    </div>
  );
}
