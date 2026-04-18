import { useState } from 'react';
import { X, AlertTriangle, FileText, Trash2 } from 'lucide-react';

function DeleteConfirmModal({ application, onConfirm, onCancel }) {
  const [isFailed, setIsFailed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleDelete = () => {
    if (isFailed && feedback.trim()) {
      console.log(`复盘记录: ${application.companyName} - ${feedback}`);
    }
    onConfirm(application.id);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 bg-red-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="text-sm font-bold text-slate-800">确认删除</h2>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-white/80 text-gray-400 hover:text-slate-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {application.companyName.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">{application.companyName}</p>
              <p className="text-xs text-gray-400">{application.position}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isFailed}
                onChange={e => { setIsFailed(e.target.checked); setShowFeedback(e.target.checked); }}
                className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-200 focus:ring-2 cursor-pointer"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">是因为面试挂了吗？</span>
            </label>

            {showFeedback && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 space-y-2">
                <div className="flex items-center gap-1.5">
                  <FileText size={14} className="text-amber-500" />
                  <p className="text-xs font-semibold text-amber-700">建议先记录复盘再删除</p>
                </div>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="写下这次面试的收获和不足..."
                  rows={2}
                  className="w-full px-2 py-1.5 bg-white border border-amber-200 rounded-lg text-xs text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-slate-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold"
            >
              取消
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-red-500/20"
            >
              <Trash2 size={14} />
              <span>确认删除</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
