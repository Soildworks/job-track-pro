import { useState, useEffect } from 'react';
import { X, Trash2, Plus, FileText, AlertCircle } from 'lucide-react';

function ManageResumesModal({ versions, onClose, onUpdate }) {
  const [newVersion, setNewVersion] = useState('');
  const [localVersions, setLocalVersions] = useState(versions);

  useEffect(() => {
    setLocalVersions(versions);
  }, [versions]);

  const handleAdd = () => {
    const trimmed = newVersion.trim();
    if (!trimmed || localVersions.includes(trimmed)) {
      setNewVersion('');
      return;
    }
    const updated = [...localVersions, trimmed];
    setLocalVersions(updated);
    onUpdate(updated);
    setNewVersion('');
  };

  const handleDelete = (versionToDelete) => {
    if (localVersions.length <= 1) return;
    const updated = localVersions.filter((v) => v !== versionToDelete);
    setLocalVersions(updated);
    onUpdate(updated);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            <h3 className="text-base font-bold text-slate-800">简历版本管理</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {localVersions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle size={32} className="text-gray-300 mb-3" />
              <p className="text-sm text-gray-400 font-medium">请至少添加一个简历版本</p>
            </div>
          ) : (
            localVersions.map((version) => (
              <div
                key={version}
                className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium text-slate-700">{version}</span>
                <button
                  onClick={() => handleDelete(version)}
                  disabled={localVersions.length <= 1}
                  className={`p-1.5 rounded-lg transition-colors ${
                    localVersions.length <= 1
                      ? 'text-gray-200 cursor-not-allowed'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                  title="删除此版本"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-5 pb-5">
          <div className="flex gap-2">
            <input
              type="text"
              value={newVersion}
              onChange={(e) => setNewVersion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入新版本名称..."
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-700 placeholder-gray-400 transition-all"
            />
            <button
              onClick={handleAdd}
              disabled={!newVersion.trim()}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                newVersion.trim()
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/20'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Plus size={14} />
              <span>添加</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageResumesModal;
