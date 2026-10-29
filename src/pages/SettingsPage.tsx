import { useState, useRef } from 'react';
import { exportBackup, importBackup, type ImportMode } from '../utils/backup';

export default function SettingsPage() {
  const [importing, setImporting] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>('merge');
  const [progressMsg, setProgressMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      await exportBackup();
    } catch (err) {
      alert('导出失败：' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleImport = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    if (importMode === 'overwrite') {
      const confirmed = confirm(
        '覆盖模式将清空所有现有数据后再导入，此操作不可撤销！\n\n确定要继续吗？'
      );
      if (!confirmed) return;
    }

    setImporting(true);
    setProgressMsg('');
    try {
      await importBackup(file, importMode, setProgressMsg);
      alert('导入成功！');
      fileRef.current!.value = '';
    } catch (err) {
      alert('导入失败：' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setImporting(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
      <h1 className="text-lg font-semibold text-gray-900">设置</h1>

      {/* Export */}
      <section className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <h2 className="text-base font-medium text-gray-800 mb-2">备份数据</h2>
        <p className="text-sm text-gray-500 mb-3">
          导出所有菜谱、合集和封面图为 ZIP 文件
        </p>
        <button
          onClick={handleExport}
          className="w-full py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          📦 导出备份
        </button>
      </section>

      {/* Import */}
      <section className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <h2 className="text-base font-medium text-gray-800 mb-2">恢复数据</h2>
        <p className="text-sm text-gray-500 mb-3">从 ZIP 备份文件恢复数据</p>

        <div className="space-y-3">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="merge"
                checked={importMode === 'merge'}
                onChange={() => setImportMode('merge')}
                className="text-orange-500 focus:ring-orange-400"
              />
              <span className="text-sm text-gray-700">合并（同ID覆盖）</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="overwrite"
                checked={importMode === 'overwrite'}
                onChange={() => setImportMode('overwrite')}
                className="text-orange-500 focus:ring-orange-400"
              />
              <span className="text-sm text-gray-700">覆盖（清空后导入）</span>
            </label>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".zip"
            className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />

          {progressMsg && (
            <p className="text-xs text-orange-600">{progressMsg}</p>
          )}

          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full py-2.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {importing ? '导入中...' : '📥 导入备份'}
          </button>
        </div>
      </section>

      {/* About */}
      <section className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <h2 className="text-base font-medium text-gray-800 mb-2">关于</h2>
        <p className="text-sm text-gray-500">
          我的菜谱 v1.0.0
        </p>
        <p className="text-xs text-gray-400 mt-1">
          数据存储在浏览器本地，清除浏览器数据会导致数据丢失，请定期导出备份。
        </p>
      </section>
    </div>
  );
}
