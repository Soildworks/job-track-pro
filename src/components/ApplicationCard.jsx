import { useState, useRef, useEffect } from 'react';
import { Flame, Clock, Trash2, ChevronDown, Link as LinkIcon, MoreVertical, Search, FileEdit, CheckCircle2, Circle, Video, GripVertical } from 'lucide-react';
import { statusLabels, statusColors } from '../utils/statusUtils';
import { getAvatarGradient, getInitials, getSourceTag, getSourceColor } from '../utils/avatarUtils';
import DeleteConfirmModal from './DeleteConfirmModal';

const RESUME_TAG_COLORS = {
  '通用版': 'bg-slate-50 text-slate-600 border-slate-200',
  '算法版': 'bg-indigo-50 text-indigo-600 border-indigo-200',
  '前端专项': 'bg-blue-50 text-blue-600 border-blue-200',
  '全栈版': 'bg-violet-50 text-violet-600 border-violet-200',
};

function getDeadlineStatus(deadline) {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate - now;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffHours <= 24 && diffHours > 0) {
    return { leftBorder: 'border-l-red-500', icon: Flame, iconColor: 'text-red-500', badge: 'bg-red-50 text-red-600 border border-red-100', label: '🔥 24h内' };
  }
  if (diffDays <= 3 && diffDays > 0) {
    return { leftBorder: 'border-l-orange-400', icon: Clock, iconColor: 'text-orange-500', badge: 'bg-orange-50 text-orange-600 border border-orange-100', label: '⏳ 3天内' };
  }
  return { leftBorder: 'border-l-transparent', icon: null, iconColor: '', badge: '', label: '' };
}

export function ApplicationCard({ application, onStatusChange, onDelete, onUpdateNotes, onUpdatePrepared, onEdit, onUpdateRejectReason }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(application.notes || '');
  const [isEditingRejectReason, setIsEditingRejectReason] = useState(false);
  const [rejectReasonDraft, setRejectReasonDraft] = useState(application.rejectReason || '');
  const [countdown, setCountdown] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    }
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  useEffect(() => {
    if (!application.interviewTime) return;

    function updateCountdown() {
      const now = new Date();
      const interviewDate = new Date(application.interviewTime);
      const diffMs = interviewDate - now;

      if (diffMs <= 0) {
        setCountdown('进行中');
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setCountdown(`${days}天 ${hours}小时`);
      } else if (hours > 0) {
        setCountdown(`${hours}小时 ${minutes}分`);
      } else {
        setCountdown(`${minutes}分钟`);
      }
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, [application.interviewTime]);

  const handleChange = (e) => onStatusChange(application.id, e.target.value);

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setShowMenu(false);
    onDelete(application);
  };

  const handleEdit = () => {
    setShowMenu(false);
    onEdit(application);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(application.id, notesDraft);
    setIsEditingNotes(false);
  };

  const handleSaveRejectReason = () => {
    onUpdateRejectReason(application.id, rejectReasonDraft);
    setIsEditingRejectReason(false);
  };

  const handleSearchInterview = () => {
    const query = encodeURIComponent(`${application.companyName} ${application.position} 面经`);
    window.open(`https://www.nowcoder.com/search?query=${query}&type=post`, '_blank', 'noopener,noreferrer');
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    if (application.applyLink) window.open(application.applyLink, '_blank', 'noopener,noreferrer');
  };

  const handleTogglePrepared = () => {
    onUpdatePrepared(application.id, !application.prepared);
  };

  const handleMeetingLinkClick = (e) => {
    e.preventDefault();
    if (application.meetingLink) window.open(application.meetingLink, '_blank', 'noopener,noreferrer');
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', application.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-40', 'scale-95');
  };

  const deadlineStatus = getDeadlineStatus(application.deadline);
  const IconComponent = deadlineStatus.icon;
  const gradient = getAvatarGradient(application.companyName);
  const initials = getInitials(application.companyName);
  const source = application.source || '';
  const sourceColor = getSourceColor(source);
  const tagColor = application.resumeTag ? RESUME_TAG_COLORS[application.resumeTag] || 'bg-gray-50 text-gray-500 border-gray-200' : null;

  const isInterview = application.status === 'INTERVIEW';
  const isAssessment = application.status === 'ASSESSMENT';
  const showDeadline = !isInterview && !isAssessment;
  const showEventTime = (isInterview && application.interviewTime) || (isAssessment && application.deadline);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-xl border border-gray-100 border-l-4 ${deadlineStatus.leftBorder} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden cursor-grab active:cursor-grabbing ${application.prepared ? 'ring-1 ring-primary/20' : ''}`}
    >
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="p-1 rounded-md text-gray-300 cursor-grab">
          <GripVertical size={12} />
        </div>
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {isInterview && application.meetingLink && (
          <a href={application.meetingLink} onClick={handleMeetingLinkClick} className="p-1.5 rounded-lg text-primary hover:bg-primary-light transition-colors" title="进入面试">
            <Video size={14} />
          </a>
        )}
        <a href={application.applyLink || '#'} onClick={handleLinkClick} className={`p-1.5 rounded-lg transition-colors ${application.applyLink ? 'text-gray-300 hover:text-primary hover:bg-primary-light' : 'text-gray-200 cursor-not-allowed'}`} title={application.applyLink ? '打开投递链接' : '暂无链接'}>
          <LinkIcon size={14} />
        </a>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-lg text-gray-300 hover:text-slate-600 hover:bg-gray-100 transition-colors" title="更多操作">
            <MoreVertical size={14} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-100 shadow-xl z-50 py-2 overflow-hidden">
              <button onClick={handleEdit} className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-primary-light transition-colors">
                <FileEdit size={15} />
                <span className="font-medium">编辑岗位详情</span>
              </button>

              <button onClick={() => { setShowMenu(false); setShowDeleteModal(true); }} className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 size={15} />
                <span>删除此申请</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3 mb-2.5 pr-14">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-800 truncate">{application.companyName}</h3>
            <p className="text-xs text-slate-500 truncate mt-0.5">{application.position}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
            {statusLabels[application.status]}
          </span>
          {source && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${sourceColor}`}>{source}</span>
          )}
          {tagColor && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${tagColor}`}>{application.resumeTag}</span>
          )}
        </div>

        {showEventTime && (
          <div className={`mb-3 flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${
            isInterview ? 'bg-primary-light/50 border-primary/10' : 'bg-amber-50/50 border-amber-100'
          }`}>
            <Clock size={12} className={`flex-shrink-0 ${isInterview ? 'text-primary' : 'text-amber-500'}`} />
            <span className="text-xs font-semibold text-slate-700">
              {isInterview ? application.interviewTime.replace('T', ' ') : application.deadline}
            </span>
            {countdown && (
              <span className={`text-xs font-bold ml-auto ${
                countdown === '进行中' ? 'text-red-500 animate-pulse' : isInterview ? 'text-primary' : 'text-amber-500'
              }`}>{countdown}</span>
            )}
          </div>
        )}

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-y-2 mb-3">
          {isInterview && (
            <div className="flex items-center gap-2">
              <button onClick={handleSearchInterview} className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors">
                <Search size={11} />
                <span>查面经</span>
              </button>
              {!isEditingNotes ? (
                <button onClick={() => { setNotesDraft(application.notes || ''); setIsEditingNotes(true); }} className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors">
                  <FileEdit size={11} />
                  <span>写复盘</span>
                </button>
              ) : (
                <div className="flex-1 space-y-1.5">
                  <textarea
                    value={notesDraft}
                    onChange={e => setNotesDraft(e.target.value)}
                    placeholder="记录面试要点..."
                    rows={2}
                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                  <div className="flex gap-1.5">
                    <button onClick={handleSaveNotes} className="px-2.5 py-1 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-dark transition-colors">保存</button>
                    <button onClick={() => setIsEditingNotes(false)} className="px-2.5 py-1 text-gray-500 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors">取消</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {application.notes && !isEditingNotes && (
            <div className="px-2.5 py-1.5 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 line-clamp-2">{application.notes}</p>
            </div>
          )}

          {isInterview && (
            <label className="flex items-center gap-2 cursor-pointer group/ck" onClick={handleTogglePrepared}>
              {application.prepared ? (
                <CheckCircle2 size={14} className="text-primary flex-shrink-0" />
              ) : (
                <Circle size={14} className="text-gray-300 group-hover/ck:text-gray-400 flex-shrink-0" />
              )}
              <span className={`text-xs font-medium ${application.prepared ? 'text-primary' : 'text-gray-400 group-hover/ck:text-gray-500'}`}>
                {application.prepared ? '已准备 ✓' : '已准备'}
              </span>
            </label>
          )}
        </div>

        {application.status === 'REJECTED' && (
          <div className="mb-3">
            {!isEditingRejectReason ? (
              <button
                onClick={() => { setRejectReasonDraft(application.rejectReason || ''); setIsEditingRejectReason(true); }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 bg-red-50/50 border border-red-100 rounded-lg text-xs text-slate-500 hover:bg-red-50 transition-colors"
              >
                <span className="text-xs">📋</span>
                <span>{application.rejectReason || '点击填写未通过原因...'}</span>
              </button>
            ) : (
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {['简历不符', '技术不足', '笔试未过', 'HR评估', 'HC已满', '薪资不匹配'].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setRejectReasonDraft(reason)}
                      className={`px-2 py-0.5 rounded-md text-xs border transition-colors ${
                        rejectReasonDraft === reason
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate-600 border-gray-200 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <textarea
                  value={rejectReasonDraft}
                  onChange={e => setRejectReasonDraft(e.target.value)}
                  placeholder="补充其他原因..."
                  rows={2}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
                <div className="flex gap-1.5">
                  <button onClick={handleSaveRejectReason} className="px-2.5 py-1 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-dark transition-colors">保存</button>
                  <button onClick={() => setIsEditingRejectReason(false)} className="px-2.5 py-1 text-gray-500 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors">取消</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {showDeadline && (
              <>
                <span className="text-xs text-gray-400">{application.deadline}</span>
                {IconComponent && (
                  <>
                    <IconComponent size={12} className={deadlineStatus.iconColor} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${deadlineStatus.badge}`}>{deadlineStatus.label}</span>
                  </>
                )}
              </>
            )}
          </div>

          <div className="relative">
            <select value={application.status} onChange={handleChange} className="appearance-none text-xs px-2 py-1.5 pr-6 bg-gray-50 border border-gray-200 rounded-lg text-slate-600 font-medium cursor-pointer hover:border-gray-300 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="WISHLIST">清单</option>
              <option value="APPLIED">已投</option>
              <option value="ASSESSMENT">测评</option>
              <option value="INTERVIEW">面试</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">拒绝</option>
            </select>
            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          application={application}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
