import { useState, useEffect, useRef } from 'react';
import { X, Undo2, Trash2, Trash, AlertTriangle } from 'lucide-react';

function TrashModal({ trash, onClose, onRestore, onPurge, onEmpty }) {
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatDeleteTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Trash size={18} className="text-slate-500" />
            <h2 className="text-lg font-bold text-slate-800">回收站</h2>
            {trash.length > 0 && (
              <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded-full text-xs font-bold">{trash.length}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {trash.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <p className="text-sm text-gray-400 font-medium">回收站是空的</p>
              <p className="text-xs text-gray-300 mt-1">已删除的申请将出现在这里</p>
            </div>
          ) : (
            <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
              {trash.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700 truncate">{item.companyName}</span>
                      <span className="text-xs text-gray-400">-</span>
                      <span className="text-xs text-slate-500 truncate">{item.position}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">删除于 {formatDeleteTime(item.deletedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onRestore(item.id)}
                      className="flex items-center gap-1 px-2 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                      title="恢复"
                    >
                      <Undo2 size={12} />
                      <span>恢复</span>
                    </button>
                    <button
                      onClick={() => onPurge(item.id)}
                      className="flex items-center gap-1 px-2 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                      title="彻底删除"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {trash.length > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">共 {trash.length} 条已删除的申请</span>
              <button
                onClick={() => setShowEmptyConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
              >
                <Trash2 size={13} />
                <span>清空回收站</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showEmptyConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-red-50/50">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" />
                <h3 className="text-lg font-bold text-red-600">清空回收站</h3>
              </div>
              <button
                onClick={() => setShowEmptyConfirm(false)}
                className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 text-center">
                此操作将<span className="font-bold text-red-500">永久删除</span>回收站中的 {trash.length} 条申请。<br />
                此操作<span className="font-bold text-red-500">不可撤销</span>。
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEmptyConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-slate-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  取消
                </button>
                <button
                  onClick={() => { onEmpty(); setShowEmptyConfirm(false); }}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-semibold shadow-sm shadow-red-500/20"
                >
                  确认清空
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrashModal;
