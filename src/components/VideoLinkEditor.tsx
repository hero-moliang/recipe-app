import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { extractDouyinUrl, openDouyinUrl } from '../utils/douyin';
import type { VideoLink } from '../types';

type Props = {
  videoLinks: VideoLink[];
  onChange: (links: VideoLink[]) => void;
};

export default function VideoLinkEditor({ videoLinks, onChange }: Props) {
  const [pasteText, setPasteText] = useState('');

  const addFromPaste = () => {
    if (!pasteText.trim()) return;
    const url = extractDouyinUrl(pasteText);
    if (!url) {
      alert('未识别到抖音链接，请粘贴抖音分享文案');
      return;
    }
    const newLink: VideoLink = {
      id: uuidv4(),
      platform: 'douyin',
      url,
      rawText: pasteText.trim(),
    };
    onChange([...videoLinks, newLink]);
    setPasteText('');
  };

  const remove = (id: string) => {
    onChange(videoLinks.filter((l) => l.id !== id));
  };

  const updateTitle = (id: string, title: string) => {
    onChange(videoLinks.map((l) => (l.id === id ? { ...l, title } : l)));
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('链接已复制');
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('链接已复制');
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">抖音视频</label>

      {/* Paste input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder="粘贴抖音分享文案"
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none"
        />
        <button
          type="button"
          onClick={addFromPaste}
          className="px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          提取
        </button>
      </div>

      {/* Existing links */}
      {videoLinks.map((link) => (
        <div key={link.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 truncate flex-1 mr-2">{link.url}</span>
            <button
              type="button"
              onClick={() => remove(link.id)}
              className="text-red-400 hover:text-red-600 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            value={link.title ?? ''}
            onChange={(e) => updateTitle(link.id, e.target.value)}
            placeholder="备注标题（可选）"
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:border-orange-400 outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => openDouyinUrl(link.url)}
              className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              看视频
            </button>
            <button
              type="button"
              onClick={() => copyUrl(link.url)}
              className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              复制链接
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
