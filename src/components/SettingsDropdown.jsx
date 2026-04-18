import { useState, useRef, useEffect } from 'react';
import { Settings, Download, Upload, X, Check, RotateCcw, AlertTriangle } from 'lucide-react';

const VALID_STATUSES = ['WISHLIST', 'APPLIED', 'ASSESSMENT', 'INTERVIEW', 'OFFER', 'REJECTED'];

function validateApplication(app) {
  if (!app || typeof app !== 'object') return false;
  if (!app.id || typeof app.id !== 'string' && typeof app.id !== 'number') return false;
  if (!app.companyName || typeof app.companyName !== 'string') return false;
  if (!app.position || typeof app.position !== 'string') return false;
  if (!app.status || !VALID_STATUSES.includes(app.status)) return false;
  if (!app.deadline || typeof app.deadline !== 'string') return false;
  return true;
}

function SettingsDropdown({ onExport, onImport, onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleExport = () => {
    onExport();
    setIsOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportText(event.target.result);
      setShowImportModal(true);
      setImportError('');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importText);

      if (!Array.isArray(data)) {
        setImportError('数据格式错误：顶层应为数组');
        return;
      }

      if (data.length === 0) {
        setImportError('数据为空：请导入包含申请的数组');
        return;
      }

      const invalidItems = data.filter((item) => !validateApplication(item));
      if (invalidItems.length > 0) {
        setImportError(`发现 ${invalidItems.length} 条脏数据，请检查 id/companyName/position/status 字段`);
        return;
      }

      onImport(data);
      setShowImportModal(false);
      setImportText('');
      setImportError('');
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 2000);
    } catch (e) {
      setImportError(`JSON 解析失败：${e.message}`);
    }
  };

  const handleReset = () => {
    onReset();
    setShowResetConfirm(false);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-xl text-gray-500 hover:text-slate-700 hover:bg-gray-100 transition-colors"
          title="设置"
        >
          <Settings size={18} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-gray-100 shadow-xl z-50 py-2 overflow-hidden">
            <button
              onClick={handleExport}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-primary-light transition-colors"
            >
              <Download size={15} />
              <span>导出数据 (JSON)</span>
            </button>

            <div className="my-1 border-t border-gray-100" />

            <label className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-primary-light transition-colors cursor-pointer">
              <Upload size={15} />
              <span>导入数据 (JSON)</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="my-1 border-t border-gray-100" />

            <button
              onClick={() => { setShowResetConfirm(true); setIsOpen(false); }}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <RotateCcw size={15} />
              <span>清空数据并初始化</span>
            </button>

            {importSuccess && (
              <div className="mx-2 mt-2 px-3 py-2 bg-green-50 text-green-600 text-xs font-medium rounded-lg flex items-center gap-1.5">
                <Check size={12} />
                <span>导入成功</span>
              </div>
            )}
          </div>
        )}
      </div>

      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-slate-800">导入数据</h3>
              <button
                onClick={() => { setShowImportModal(false); setImportText(''); setImportError(''); }}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                <AlertTriangle size={14} className="text-amber-500" />
                <span className="text-amber-600 text-xs font-medium">导入将覆盖当前所有数据，请确认 JSON 来源可靠</span>
              </div>

              <textarea
                value={importText}
                onChange={e => { setImportText(e.target.value); setImportError(''); }}
                placeholder="粘贴 JSON 数据或上传文件..."
                rows={10}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none font-mono"
              />

              {importError && (
                <div className="px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-medium">
                  {importError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowImportModal(false); setImportText(''); setImportError(''); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-slate-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  取消
                </button>
                <button
                  onClick={handleImport}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors text-sm font-semibold shadow-sm shadow-primary/20"
                >
                  确认导入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-red-50/50">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" />
                <h3 className="text-lg font-bold text-red-600">清空数据</h3>
              </div>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 text-center">
                此操作将<span className="font-bold text-red-500">永久删除</span>所有申请数据并恢复初始状态。<br />
                建议先<span className="font-semibold">导出数据</span>备份。
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-slate-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  取消
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-semibold shadow-sm shadow-red-500/20"
                >
                  确认清空
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsDropdown;
