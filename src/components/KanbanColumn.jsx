import { useState } from 'react';
import { ApplicationCard } from './ApplicationCard';
import { statusLabels } from '../utils/statusUtils';

const columnBarColors = {
  WISHLIST: 'bg-slate-400',
  APPLIED: 'bg-blue-500',
  ASSESSMENT: 'bg-purple-500',
  INTERVIEW: 'bg-orange-500',
  OFFER: 'bg-green-500',
  REJECTED: 'bg-red-400',
};

const columnBadgeColors = {
  WISHLIST: 'bg-slate-100 text-slate-600',
  APPLIED: 'bg-blue-50 text-blue-600',
  ASSESSMENT: 'bg-purple-50 text-purple-600',
  INTERVIEW: 'bg-orange-50 text-orange-600',
  OFFER: 'bg-green-50 text-green-600',
  REJECTED: 'bg-red-50 text-red-600',
};

export function KanbanColumn({ status, applications, onStatusChange, onDelete, onUpdateNotes, onUpdatePrepared, onEdit, onUpdateRejectReason }) {
  const barColor = columnBarColors[status] || 'bg-gray-400';
  const badgeColor = columnBadgeColors[status] || 'bg-gray-100 text-gray-600';
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const appId = e.dataTransfer.getData('text/plain');
    if (appId) {
      onStatusChange(appId, status);
    }
  };

  return (
    <div
      className={`flex-1 min-w-80 bg-gray-100/50 rounded-xl border border-gray-100 overflow-hidden transition-colors duration-200 ${
        isDragOver ? 'ring-2 ring-primary/40 bg-primary/5' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`h-1 ${barColor}`} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700 tracking-wide">
            {statusLabels[status]}
          </h2>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badgeColor}`}>
            {applications.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onUpdateNotes={onUpdateNotes}
              onUpdatePrepared={onUpdatePrepared}
              onEdit={onEdit}
              onUpdateRejectReason={onUpdateRejectReason}
            />
          ))}
          {applications.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">📭</span>
              </div>
              <p className="text-xs text-gray-400 font-medium">暂无申请</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
