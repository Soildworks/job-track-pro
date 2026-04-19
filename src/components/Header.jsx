import { Plus, Briefcase, CheckCircle, Clock, TrendingUp, Award, Target, Flame, Search, Eye, Trash } from 'lucide-react';
import SettingsDropdown from './SettingsDropdown';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function ConversionFunnel({ applications }) {
  const total = applications.length;
  const applied = applications.filter(a => a.status === 'APPLIED').length;
  const assessment = applications.filter(a => a.status === 'ASSESSMENT').length;
  const interview = applications.filter(a => a.status === 'INTERVIEW').length;
  const offer = applications.filter(a => a.status === 'OFFER').length;

  const steps = [
    { label: '已投递', count: applied, pct: total ? ((applied / total) * 100).toFixed(0) : 0, color: 'bg-primary' },
    { label: '测评中', count: assessment, pct: total ? ((assessment / total) * 100).toFixed(0) : 0, color: 'bg-primary/80' },
    { label: '面试中', count: interview, pct: total ? ((interview / total) * 100).toFixed(0) : 0, color: 'bg-primary/60' },
    { label: 'Offer', count: offer, pct: total ? ((offer / total) * 100).toFixed(0) : 0, color: 'bg-primary/40' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-gray-400" />
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">求职进度漏斗</p>
      </div>
      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-10 text-right">{step.label}</span>
            <div className="flex-1 h-5 bg-gray-50 rounded-full overflow-hidden">
              <div
                className={`h-full ${step.color} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                style={{ width: `${Math.max(step.pct, 4)}%` }}
              >
                {step.pct > 10 && (
                  <span className="text-xs font-semibold text-white">{step.pct}%</span>
                )}
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-700 w-6">{step.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriorityCenter({ applications }) {
  const highPriority = applications
    .filter(a => a.status === 'ASSESSMENT' || a.status === 'INTERVIEW')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  if (highPriority.length === 0) return null;

  const statusTag = {
    ASSESSMENT: { label: '测评', color: 'bg-amber-50 text-amber-600' },
    INTERVIEW: { label: '面试', color: 'bg-orange-50 text-orange-600' },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Target size={16} className="text-primary" />
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">今日高优</p>
        <span className="ml-auto bg-red-50 text-red-500 text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <Flame size={10} /> TOP 3
        </span>
      </div>
      <div className="space-y-2">
        {highPriority.map((app, idx) => (
          <div
            key={app.id}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              idx === 0 ? 'bg-red-50/50 border border-red-100/50' : 'bg-gray-50/50'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              idx === 0 ? 'bg-red-500 text-white' : idx === 1 ? 'bg-orange-400 text-white' : 'bg-gray-300 text-white'
            }`}>
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">{app.companyName}</p>
              <p className="text-xs text-gray-400 truncate">{app.position}</p>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${statusTag[app.status].color}`}>
              {statusTag[app.status].label}
            </span>
            <span className="text-xs text-gray-400 flex-shrink-0">{app.deadline}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Header({ onAddApplication, applications, trash, onSearch, onTogglePriority, showOnlyPriority, searchQuery, onExport, onImport, onReset, onOpenTrash }) {
  const interviewCount = applications.filter(a => a.status === 'INTERVIEW').length;
  const offerCount = applications.filter(a => a.status === 'OFFER').length;
  const appliedCount = applications.filter(a => a.status === 'APPLIED').length;
  const assessmentCount = applications.filter(a => a.status === 'ASSESSMENT').length;

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-full mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-primary rounded-xl flex items-center justify-center">
              <Briefcase size={18} className="text-white" />
            </div>
            <h1 className="text-base md:text-xl font-bold text-slate-800 tracking-tight">求职进度看板</h1>
          </div>

          <div className="header-actions flex items-center gap-2 md:gap-3">
            <button
              onClick={onOpenTrash}
              className="relative p-2.5 rounded-xl text-gray-500 hover:text-slate-700 hover:bg-gray-100 transition-colors"
              title="回收站"
            >
              <Trash size={18} />
              {trash.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {trash.length > 9 ? '9+' : trash.length}
                </span>
              )}
            </button>

            <SettingsDropdown onExport={onExport} onImport={onImport} onReset={onReset} />

            <div className="relative header-search-container md:w-auto">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="搜索公司或岗位..."
                className="header-search-input w-full md:w-64 pl-9 pr-4 py-2 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
              />
            </div>

            <button
              onClick={onTogglePriority}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all border ${
                showOnlyPriority
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              <Eye size={16} />
              <span>仅看高优</span>
            </button>

            <button
              onClick={onAddApplication}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium text-sm shadow-sm shadow-primary/20"
            >
              <Plus size={18} />
              <span>新增申请</span>
            </button>
          </div>
        </div>

        <div className="stats-grid grid grid-cols-5 gap-3 md:gap-4">
          <StatCard
            icon={CheckCircle}
            label="已投递"
            value={appliedCount}
            color="bg-blue-50 text-blue-500"
          />
          <StatCard
            icon={Clock}
            label="测评中"
            value={assessmentCount}
            color="bg-amber-50 text-amber-500"
          />
          <StatCard
            icon={Award}
            label="面试中"
            value={interviewCount}
            color="bg-orange-50 text-orange-500"
          />
          <StatCard
            icon={Award}
            label="Offer"
            value={offerCount}
            color="bg-emerald-50 text-emerald-500"
          />
          <div className="space-y-4">
            <ConversionFunnel applications={applications} />
            <PriorityCenter applications={applications} />
          </div>
        </div>
      </div>
    </header>
  );
}
