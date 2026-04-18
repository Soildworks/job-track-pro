import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { mockApplications } from './data/mockData';
import AddModal from './components/AddModal';
import Confetti from './components/Confetti';
import ManageResumesModal from './components/ManageResumesModal';
import './App.css';

const STORAGE_KEY = 'meituan_job_kanban_data';
const RESUME_VERSIONS_KEY = 'meituan_resume_versions';
const DEFAULT_RESUME_VERSIONS = ['通用版', '前端专项版', '美团专项版', '全栈版'];

function App() {
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
    return mockApplications;
  });

  const [resumeVersions, setResumeVersions] = useState(() => {
    try {
      const saved = localStorage.getItem(RESUME_VERSIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load resume versions:', e);
    }
    return DEFAULT_RESUME_VERSIONS;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [showManageResumesModal, setShowManageResumesModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyPriority, setShowOnlyPriority] = useState(false);
  const prevStatusRef = useRef({});

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    applications.forEach((app) => {
      const prevStatus = prevStatusRef.current[app.id];
      if (prevStatus && prevStatus !== 'OFFER' && app.status === 'OFFER') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      prevStatusRef.current[app.id] = app.status;
    });
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(RESUME_VERSIONS_KEY, JSON.stringify(resumeVersions));
    } catch (e) {
      console.error('Failed to save resume versions:', e);
    }
  }, [resumeVersions]);

  const handleAddApplication = () => {
    setEditingApp(null);
    setShowAddModal(true);
  };

  const handleEditApplication = (app) => {
    setEditingApp(app);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingApp(null);
  };

  const handleModalSubmit = (appData) => {
    if (appData.id) {
      setApplications((prev) =>
        prev.map((app) => (app.id === appData.id ? appData : app))
      );
    } else {
      setApplications((prev) => [...prev, appData]);
    }
    setShowAddModal(false);
    setEditingApp(null);
  };

  const updateStatus = useCallback((id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  }, []);

  const deleteApplication = useCallback((id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  }, []);

  const updateNotes = useCallback((id, notes) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, notes } : app))
    );
  }, []);

  const updatePrepared = useCallback((id, prepared) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, prepared } : app))
    );
  }, []);

  const updateRejectReason = useCallback((id, rejectReason) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, rejectReason } : app))
    );
  }, []);

  const handleExport = () => {
    const dataStr = JSON.stringify(applications, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `求职申请看板_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (data) => {
    if (Array.isArray(data)) {
      setApplications(data);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RESUME_VERSIONS_KEY);
    window.location.reload();
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = searchQuery
      ? app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.position.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesPriority = showOnlyPriority
      ? app.status === 'ASSESSMENT' || app.status === 'INTERVIEW'
      : true;

    return matchesSearch && matchesPriority;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTogglePriority = () => {
    setShowOnlyPriority((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen bg-bg">
      <Header
        onAddApplication={handleAddApplication}
        applications={applications}
        onSearch={handleSearch}
        onTogglePriority={handleTogglePriority}
        showOnlyPriority={showOnlyPriority}
        searchQuery={searchQuery}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
      />

      <KanbanBoard
        applications={filteredApplications}
        onStatusChange={updateStatus}
        onDelete={deleteApplication}
        onUpdateNotes={updateNotes}
        onUpdatePrepared={updatePrepared}
        onEdit={handleEditApplication}
        onUpdateRejectReason={updateRejectReason}
      />

      {showAddModal && (
        <AddModal
          initialData={editingApp}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          resumeVersions={resumeVersions}
          onManageResumes={() => setShowManageResumesModal(true)}
        />
      )}

      {showManageResumesModal && (
        <ManageResumesModal
          versions={resumeVersions}
          onClose={() => setShowManageResumesModal(false)}
          onUpdate={setResumeVersions}
        />
      )}

      {showConfetti && <Confetti />}
    </div>
  );
}

export default App;
