import { useState, useEffect } from 'react';
import { X, Building2, Briefcase, Calendar, Link2, FileText, Settings2, Video, Clock } from 'lucide-react';

const SOURCE_OPTIONS = ['官网', 'Boss直聘', '内推', '猎头', '拉勾', '牛客', '其他'];

function AddModal({ initialData, onClose, onSubmit, resumeVersions, onManageResumes }) {
  const isEdit = !!initialData;
  const isInterviewMode = initialData?.status === 'INTERVIEW';

  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [deadline, setDeadline] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [notes, setNotes] = useState('');
  const [resumeTag, setResumeTag] = useState('');
  const [source, setSource] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName || '');
      setPosition(initialData.position || '');
      setDeadline(initialData.deadline || '');
      setApplyLink(initialData.applyLink || '');
      setNotes(initialData.notes || '');
      setResumeTag(initialData.resumeTag || '');
      setSource(initialData.source || '');
      setInterviewTime(initialData.interviewTime || '');
      setMeetingLink(initialData.meetingLink || '');
    } else {
      const today = new Date();
      setCompanyName('');
      setPosition('');
      setDeadline(today.toISOString().split('T')[0]);
      setApplyLink('');
      setNotes('');
      setResumeTag('');
      setSource('');
      setInterviewTime('');
      setMeetingLink('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim() || !position.trim() || !deadline) return;

    const appData = {
      id: initialData ? initialData.id : Date.now().toString(),
      companyName: companyName.trim(),
      position: position.trim(),
      status: initialData ? initialData.status : 'WISHLIST',
      deadline,
      applyLink: applyLink.trim() || '',
      notes: notes.trim() || '',
      resumeTag,
      source,
      interviewTime: interviewTime.trim() || '',
      meetingLink: meetingLink.trim() || '',
      prepared: initialData ? initialData.prepared : false,
    };

    onSubmit(appData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-700 placeholder-gray-400 transition-all";

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            {isEdit ? '编辑岗位详情' : '新增求职申请'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              公司名称 <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="例如：美团"
                className={inputClass}
                required
              />
            </div>
          </div>

          {isInterviewMode && (
            <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 space-y-3">
              <p className="text-xs font-semibold text-orange-600 flex items-center gap-1.5">
                <Video size={13} />
                <span>面试信息</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    面试时间
                  </label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="datetime-local"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    会议链接
                  </label>
                  <div className="relative">
                    <Video size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      placeholder="https://meeting..."
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              岗位名称 <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="例如：前端开发工程师"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                截止日期 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                投递途径
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-700 transition-all"
              >
                <option value="">请选择</option>
                {SOURCE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600">
                简历版本
              </label>
              <button
                type="button"
                onClick={onManageResumes}
                className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-primary-light transition-colors"
                title="管理简历版本"
              >
                <Settings2 size={13} />
              </button>
            </div>
            <select
              value={resumeTag}
              onChange={(e) => setResumeTag(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-700 transition-all"
            >
              <option value="">不选择</option>
              {resumeVersions.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              投递链接
            </label>
            <div className="relative">
              <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="url"
                value={applyLink}
                onChange={(e) => setApplyLink(e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              备注
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-3.5 text-gray-300" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="补充说明..."
                rows={3}
                className={`${inputClass} pl-10 resize-none`}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-slate-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors text-sm font-semibold shadow-sm shadow-primary/20"
            >
              {isEdit ? '保存修改' : '确认添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModal;
