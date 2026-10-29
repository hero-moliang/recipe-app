import { useState, type KeyboardEvent } from 'react';

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

export default function TagInput({ tags, onChange }: Props) {
  const [input, setInput] = useState('');

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-lg bg-white min-h-[42px] focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-orange-50 text-orange-600 rounded-full"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-orange-400 hover:text-orange-700"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? '输入标签，回车添加' : ''}
        className="flex-1 min-w-[80px] text-sm outline-none bg-transparent"
      />
    </div>
  );
}
