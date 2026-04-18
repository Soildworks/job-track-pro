import { KanbanColumn } from './KanbanColumn';

const ACTIVE_STATUSES = [
  'WISHLIST',
  'APPLIED',
  'ASSESSMENT',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
];

export function KanbanBoard({ applications, onStatusChange, onDelete, onUpdateNotes, onUpdatePrepared, onEdit, onUpdateRejectReason }) {
  return (
    <div className="flex-1 overflow-x-auto kanban-board-container">
      <div className="flex gap-4 min-w-max p-6">
        {ACTIVE_STATUSES.map((status) => {
          const filteredApps = applications.filter((app) => app.status === status);
          return (
            <KanbanColumn
              key={status}
              status={status}
              applications={filteredApps}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onUpdateNotes={onUpdateNotes}
              onUpdatePrepared={onUpdatePrepared}
              onEdit={onEdit}
              onUpdateRejectReason={onUpdateRejectReason}
            />
          );
        })}
      </div>
    </div>
  );
}
