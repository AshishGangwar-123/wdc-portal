import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight, 
  UserCheck, 
  Send, 
  Clock, 
  BookOpen,
  X,
  RefreshCw,
  AlertCircle,
  Loader2,
  Mail, 
  Film,
  Lock,
  ShieldCheck,
  FileText,
  ExternalLink,
  Key,
  CalendarCheck,
  BrainCircuit,
  FileQuestion,
  Play,
  Circle,

} from 'lucide-react';
import gsap from 'gsap';

const LinkedInIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const API_BASE = '';

export default function AdminPanel({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Live data from backend SQLite DB
  const [workshops, setWorkshops] = useState([]);
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  // Filters & Modal States
  const [selectedWorkshopFilter, setSelectedWorkshopFilter] = useState('all');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [subscriberSearchQuery, setSubscriberSearchQuery] = useState('');
  const [copiedEmails, setCopiedEmails] = useState(false);
  const [showAddWorkshopModal, setShowAddWorkshopModal] = useState(false);
  const [showAddNotifModal, setShowAddNotifModal] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', image_url: '', linkedin_url: '' });
  const [submitting, setSubmitting] = useState(false);

  // End Workshop & Student Feedbacks Modal State
  const [showEndWorkshopModal, setShowEndWorkshopModal] = useState(false);
  const [endWorkshopTarget, setEndWorkshopTarget] = useState(null);
  const [endGroupPhotoUrl, setEndGroupPhotoUrl] = useState('');
  const [endFeedbackPrompt, setEndFeedbackPrompt] = useState('What did you learn in this workshop and how can we improve future sessions?');

  const [showFeedbacksModal, setShowFeedbacksModal] = useState(false);
  const [feedbacksList, setFeedbacksList] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);


  // Student Access & Credentials Modal State
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessStudent, setAccessStudent] = useState(null);
  const [accessAllowed, setAccessAllowed] = useState(1);
  const [accessPassword, setAccessPassword] = useState('');

  // Workshop Resources Modal State
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceWorkshop, setResourceWorkshop] = useState(null);
  const [workshopResources, setWorkshopResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    resource_type: 'Notes',
    link_url: '',
    description: '',
  });

  // Attendance State
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceWorkshop, setAttendanceWorkshop] = useState(null);
  const [attendanceWorkshopId, setAttendanceWorkshopId] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);

  // AI Test Maker Assistant & Tests State
  const [allTests, setAllTests] = useState([]);
  const [testWorkshopId, setTestWorkshopId] = useState('all');
  const [showAITestModal, setShowAITestModal] = useState(false);
  const [generatingTest, setGeneratingTest] = useState(false);
  const [testPromptData, setTestPromptData] = useState({
    topic: '',
    num_questions: 5,
    level: 'Intermediate',
    question_type: 'single_correct',
    workshop_id: '',
    title: '',
  });
  const [editorQuestions, setEditorQuestions] = useState([]);
  const [editingTestId, setEditingTestId] = useState(null);
  const [testDurationMins, setTestDurationMins] = useState(15);

  // New Media Showcase Form State
  const [newMedia, setNewMedia] = useState({
    title: '',
    url: '',
    media_type: 'video',
    category: 'Highlight',
  });

  // New Workshop Form State
  const [newWorkshop, setNewWorkshop] = useState({
    title: '',
    mentor: '',
    date: '',
    time: '18:00 IST',
    seats: 50,
    topics: '',
    color: '#00f2fe',
  });

  // New Notification Form State
  const [newNotif, setNewNotif] = useState({
    title: '',
    category: 'Announcement',
    related_workshop_id: '',
    date: new Date().toISOString().split('T')[0],
    time: '18:00 IST',
  });

  const adminContainerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      adminContainerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  // =====================================================================
  // LIVE DATA FETCH FROM BACKEND
  // =====================================================================
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setApiError(false);
    try {
      const [wsRes, notifRes, studRes, statsRes, subRes, galRes, teamRes] = await Promise.all([
        fetch(`${API_BASE}/api/workshops`),
        fetch(`${API_BASE}/api/notifications`),
        fetch(`${API_BASE}/api/students`),
        fetch(`${API_BASE}/api/stats`),
        fetch(`${API_BASE}/api/subscribers`),
        fetch(`${API_BASE}/api/gallery`),
        fetch(`${API_BASE}/api/team`),
      ]);

      if (!wsRes.ok || !notifRes.ok || !studRes.ok || !statsRes.ok || !subRes.ok || !galRes.ok) {
        throw new Error('API error');
      }

      const [wsData, notifData, studData, statsData, subData, galData, teamData] = await Promise.all([
        wsRes.json(),
        notifRes.json(),
        studRes.json(),
        statsRes.json(),
        subRes.json(),
        galRes.json(),
        teamRes.ok ? teamRes.json() : [],
      ]);

      setWorkshops(wsData);
      setNotifications(notifData);
      setStudents(studData);
      setStats(statsData);
      setSubscribers(subData);
      setGalleryMedia(galData);
      setTeamMembers(teamData || []);
    } catch (err) {
      console.error('Backend offline or error:', err);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // =====================================================================
  // ADD WORKSHOP — POST to backend
  // =====================================================================
  const handleAddWorkshop = async (e) => {
    e.preventDefault();
    if (!newWorkshop.title || !newWorkshop.date) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/workshops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newWorkshop.title,
          mentor: newWorkshop.mentor || 'WDC Lead Mentor',
          date: newWorkshop.date,
          time: newWorkshop.time,
          seats: Number(newWorkshop.seats),
          topics: newWorkshop.topics,
          color: newWorkshop.color,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setWorkshops((prev) => [created, ...prev]);
        setShowAddWorkshopModal(false);
        setNewWorkshop({ title: '', mentor: '', date: '', time: '18:00 IST', seats: 50, topics: '', color: '#00f2fe' });
        // Refresh stats
        const statsRes = await fetch(`${API_BASE}/api/stats`);
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch (err) {
      console.error('Failed to add workshop:', err);
      alert('Backend offline. Please start the FastAPI server.');
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================================
  // DELETE WORKSHOP — DELETE from backend
  // =====================================================================
  const handleDeleteWorkshop = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workshop from DB?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/workshops/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWorkshops((prev) => prev.filter((w) => w.id !== id));
        const statsRes = await fetch(`${API_BASE}/api/stats`);
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // =====================================================================
  // ADD NOTIFICATION — POST to backend
  // =====================================================================
  const handleAddNotification = async (e) => {
    e.preventDefault();
    if (!newNotif.title) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newNotif.title,
          category: newNotif.category,
          related_workshop_id: newNotif.related_workshop_id || null,
          date: newNotif.date,
          time: newNotif.time,
        }),
      });
      if (res.ok) {
        setShowAddNotifModal(false);
        setNewNotif({
          title: '',
          category: 'Announcement',
          related_workshop_id: '',
          date: new Date().toISOString().split('T')[0],
          time: '18:00 IST',
        });
        // Refetch notifications to get the newly added one with its DB id
        const notifRes = await fetch(`${API_BASE}/api/notifications`);
        if (notifRes.ok) setNotifications(await notifRes.json());
        const statsRes = await fetch(`${API_BASE}/api/stats`);
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch (err) {
      console.error('Failed to add notification:', err);
      alert('Backend offline. Please start the FastAPI server.');
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================================
  // DELETE NOTIFICATION — DELETE from backend
  // =====================================================================
  const handleDeleteNotification = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error('Delete notification failed:', err);
    }
  };

  // =====================================================================
  // ADD & DELETE GALLERY MEDIA — HERO SHOWCASE MANAGEMENT
  // =====================================================================
  const handleAddMedia = async (e) => {
    e.preventDefault();
    if (!newMedia.title.trim() || !newMedia.url.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMedia),
      });
      if (res.ok) {
        setShowAddMediaModal(false);
        setNewMedia({ title: '', url: '', media_type: 'video', category: 'Highlight' });
        fetchAllData();
      }
    } catch (e) {
      alert('Failed to add gallery media item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMedia = async (id) => {
    if (!window.confirm('Delete this gallery media item?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      alert('Delete failed');
    }
  };

  // =====================================================================
  // STUDENT ACCESS & CREDENTIALS HANDLERS
  // =====================================================================
  const handleOpenAccessModal = (student) => {
    setAccessStudent(student);
    setAccessAllowed(student.allowed === 1 ? 1 : 1); // default to 1 (Allowed) when opening
    setAccessPassword(student.password || 'wdc2026pass');
    setShowAccessModal(true);
  };

  const handleSaveAccess = async (e) => {
    e.preventDefault();
    if (!accessStudent) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/${accessStudent.id}/access`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allowed: Number(accessAllowed),
          password: accessPassword,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setStudents((prev) => prev.map((s) => (s.id === accessStudent.id ? updated : s)));
        setShowAccessModal(false);
      } else {
        alert('Failed to update student access');
      }
    } catch (err) {
      alert('Backend error updating student access');
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================================
  // WORKSHOP RESOURCES HANDLERS (Notes, Tests, Code, Materials)
  // =====================================================================
  const handleOpenResourceModal = async (workshop) => {
    setResourceWorkshop(workshop);
    setShowResourceModal(true);
    setLoadingResources(true);
    try {
      const res = await fetch(`${API_BASE}/api/workshops/${workshop.id}/resources`);
      if (res.ok) {
        setWorkshopResources(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoadingResources(false);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!newResource.title || !resourceWorkshop) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/workshops/${resourceWorkshop.id}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource),
      });

      if (res.ok) {
        const created = await res.json();
        setWorkshopResources((prev) => [created, ...prev]);
        setNewResource({ title: '', resource_type: 'Notes', link_url: '', description: '' });
      }
    } catch (err) {
      alert('Failed to add resource');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm('Delete this resource from workshop?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/workshops/resources/${resourceId}`, { method: 'DELETE' });
      if (res.ok) {
        setWorkshopResources((prev) => prev.filter((r) => r.id !== resourceId));
      }
    } catch (err) {
      alert('Failed to delete resource');
    }
  };

  // =====================================================================
  // ATTENDANCE SYSTEM HANDLERS
  // =====================================================================
  const handleOpenAttendanceModal = (workshop) => {
    setAttendanceWorkshop(workshop);
    setAttendanceWorkshopId(workshop.id);
    setShowAttendanceModal(true);
  };

  const fetchAttendanceData = useCallback(async (wsId, dateStr) => {
    if (!wsId) return;
    setLoadingAttendance(true);
    try {
      const res = await fetch(`${API_BASE}/api/workshops/${wsId}/attendance?date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        setAttendanceList(data);
      }
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setLoadingAttendance(false);
    }
  }, []);

  useEffect(() => {
    if (workshops.length > 0 && !attendanceWorkshopId) {
      setAttendanceWorkshopId(workshops[0].id);
    }
  }, [workshops, attendanceWorkshopId]);

  useEffect(() => {
    if (attendanceWorkshopId && attendanceDate) {
      fetchAttendanceData(attendanceWorkshopId, attendanceDate);
    }
  }, [attendanceWorkshopId, attendanceDate, fetchAttendanceData]);

  const handleSaveAttendance = async () => {
    if (!attendanceWorkshopId || !attendanceDate) return;
    setSavingAttendance(true);
    try {
      const res = await fetch(`${API_BASE}/api/workshops/${attendanceWorkshopId}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: attendanceDate,
          records: attendanceList,
        }),
      });
      if (res.ok) {
        alert('Daily attendance saved successfully!');
      }
    } catch (err) {
      alert('Failed to save attendance');
    } finally {
      setSavingAttendance(false);
    }
  };

  const setAllAttendanceStatus = (status) => {
    setAttendanceList((prev) => prev.map((item) => ({ ...item, status })));
  };

  // =====================================================================
  // AI TEST MAKER ASSISTANT HANDLERS
  // =====================================================================
  const fetchAllTests = useCallback(async () => {
    if (workshops.length === 0) return;
    try {
      const all = await Promise.all(
        workshops.map(async (ws) => {
          const res = await fetch(`${API_BASE}/api/workshops/${ws.id}/tests`);
          if (res.ok) return await res.json();
          return [];
        })
      );
      setAllTests(all.flat());
    } catch (err) {
      console.error('Failed to fetch tests:', err);
    }
  }, [workshops]);

  useEffect(() => {
    fetchAllTests();
  }, [fetchAllTests]);

  const handleOpenAITestMaker = (wsId = '') => {
    const targetWs = wsId || (workshops[0] ? workshops[0].id : '');
    const wsObj = workshops.find((w) => w.id === targetWs);
    setTestPromptData({
      topic: wsObj ? (Array.isArray(wsObj.topics) ? wsObj.topics.join(', ') : wsObj.topics || wsObj.title) : 'Web Development',
      num_questions: 5,
      level: 'Intermediate',
      question_type: 'single_correct',
      workshop_id: targetWs,
      title: wsObj ? `${wsObj.title} - AI Practice Test` : 'WDC Workshop Practice Test',
    });
    setEditorQuestions([]);
    setEditingTestId(null);
    setShowAITestModal(true);
  };

  const handleGenerateAITest = async (e) => {
    e.preventDefault();
    if (!testPromptData.topic.trim()) return;
    setGeneratingTest(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/generate-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: testPromptData.topic,
          num_questions: Number(testPromptData.num_questions),
          level: testPromptData.level,
          question_type: testPromptData.question_type,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEditorQuestions(data.questions || []);
      } else {
        alert('AI question generation failed');
      }
    } catch (err) {
      alert('Backend error generating test');
    } finally {
      setGeneratingTest(false);
    }
  };

  const handleSaveAndPublishTest = async (publishStatus = 'Draft') => {
    if (!testPromptData.workshop_id || !testPromptData.title || editorQuestions.length === 0) {
      alert('Please fill test details and generate/add questions.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/workshops/${testPromptData.workshop_id}/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTestId,
          title: testPromptData.title,
          description: `AI Generated Test on ${testPromptData.topic}`,
          level: testPromptData.level,
          type: testPromptData.question_type,
          duration_mins: Number(testDurationMins),
          total_questions: editorQuestions.length,
          questions: editorQuestions,
          status: publishStatus,
          is_live: 0,
        }),
      });

      if (res.ok) {
        setShowAITestModal(false);
        fetchAllTests();
        alert(`Test ${publishStatus === 'Published' ? 'published to students' : 'saved as draft'}!`);
      }
    } catch (err) {
      alert('Failed to save test');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTestLive = async (testId, currentLive) => {
    const newLive = currentLive === 1 ? 0 : 1;
    try {
      const res = await fetch(`${API_BASE}/api/tests/${testId}/toggle-live`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_live: newLive }),
      });
      if (res.ok) {
        setAllTests((prev) => prev.map((t) => (t.id === testId ? { ...t, is_live: newLive } : t)));
      }
    } catch (err) {
      alert('Failed to toggle live test status');
    }
  };

  const handleToggleTestPublish = async (testId, currentStatus) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      const res = await fetch(`${API_BASE}/api/tests/${testId}/toggle-publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAllTests((prev) => prev.map((t) => (t.id === testId ? { ...t, status: newStatus } : t)));
      }
    } catch (err) {
      alert('Failed to toggle publish status');
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/tests/${testId}`, { method: 'DELETE' });
      if (res.ok) {
        setAllTests((prev) => prev.filter((t) => t.id !== testId));
      }
    } catch (err) {
      alert('Failed to delete test');
    }
  };

  // Filter Enrolled Students by selected workshop & search query
  const filteredStudents = students.filter((student) => {
    const matchesWorkshop =
      selectedWorkshopFilter === 'all' || student.workshop_id === selectedWorkshopFilter;
    const matchesSearch =
      (student.name || '').toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      (student.id || '').toLowerCase().includes(studentSearchQuery.toLowerCase());
    return matchesWorkshop && matchesSearch;
  });

  // Computed overview stats from live DB
  const totalEnrolled = workshops.reduce((s, w) => s + (w.enrolled || 0), 0);
  const totalSeats = workshops.reduce((s, w) => s + (w.seats || 0), 0);
  const occupancyPct = totalSeats > 0 ? Math.round((totalEnrolled / totalSeats) * 100) : 0;

  return (
    <div
      ref={adminContainerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        paddingTop: '110px',
        paddingBottom: '60px',
        background: '#080914',
      }}
    >
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1" style={{ top: '5%', left: '10%' }} />
      <div className="bg-orb bg-orb-2" style={{ bottom: '10%', right: '10%' }} />
      <div className="bg-grid" />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        {/* Admin Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontFamily: 'Fira Code',
                  fontSize: '0.8rem',
                  color: '#00f2fe',
                  background: 'rgba(0, 242, 254, 0.1)',
                  padding: '4px 12px',
                  borderRadius: '99px',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                }}
              >
                ● WDC ADMIN DASHBOARD v3.0 — LIVE DB
              </span>
              {apiError && (
                <span style={{ color: '#ef4444', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} /> Backend offline — Start FastAPI server
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px' }}>
              <img
                src="/wdc_logo.png"
                alt="WDC Logo"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid rgba(255, 115, 0, 0.5)',
                  boxShadow: '0 0 20px rgba(255, 115, 0, 0.4)'
                }}
              />
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>
                Web Development Club <span className="text-gradient">Control Center</span>
              </h1>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={fetchAllData}
              className="glass-btn"
              style={{ padding: '10px 16px', fontSize: '0.85rem' }}
              title="Refresh data from DB"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <button
              onClick={() => setShowAddWorkshopModal(true)}
              className="glass-btn glass-btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Plus size={18} /> Add Workshop
            </button>

            <button
              onClick={() => setShowAddNotifModal(true)}
              className="glass-btn"
              style={{ padding: '10px 18px', fontSize: '0.9rem', borderColor: 'rgba(121, 40, 202, 0.4)' }}
            >
              <Bell size={16} color="#7928ca" /> New Notification
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '16px',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
            { id: 'workshops', label: `Workshops (${workshops.length})`, icon: Calendar },
            { id: 'students', label: `Enrolled Students (${students.length})`, icon: Users },
            { id: 'notifications', label: `Notifications (${notifications.length})`, icon: Bell },
            { id: 'subscribers', label: `Email Subscribers (${subscribers.length})`, icon: Mail },
            { id: 'gallery', label: `Media Gallery (${galleryMedia.length})`, icon: Film },
            { id: 'team', label: `🃏 Core Team Deck (${teamMembers.length})`, icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  background: isActive ? 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(121, 40, 202, 0.15))' : 'rgba(255,255,255,0.03)',
                  border: isActive ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: isActive ? '#00f2fe' : '#94a3b8',
                  fontFamily: 'Outfit',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: '14px', color: '#94a3b8' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontFamily: 'Fira Code' }}>Loading live system data...</span>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* =================================================================== */}
        {!loading && activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Stat Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Total Enrolled Students</span>
                  <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0,242,254,0.1)', color: '#00f2fe' }}>
                    <Users size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit' }}>{students.length}</div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpRight size={14} /> Live System
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Active Workshops</span>
                  <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(121,40,202,0.15)', color: '#7928ca' }}>
                    <Calendar size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit' }}>{workshops.length}</div>
                <div style={{ fontSize: '0.78rem', color: '#00f2fe', marginTop: '6px' }}>
                  {workshops[0] ? `Next: ${workshops[0].date}` : 'No workshops yet'}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Seat Occupancy</span>
                  <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                    <UserCheck size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit' }}>{occupancyPct}%</div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '6px' }}>
                  {totalEnrolled} / {totalSeats} Total Seats Filled
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Broadcast Notifications</span>
                  <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,0,122,0.15)', color: '#ff007a' }}>
                    <Bell size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit' }}>{notifications.length}</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                  {notifications.filter(n => n.active).length} Live | {notifications.filter(n => !n.active).length} Archived
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Email Subscribers</span>
                  <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0,242,254,0.15)', color: '#00f2fe' }}>
                    <Mail size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit' }}>{subscribers.length}</div>
                <div style={{ fontSize: '0.78rem', color: '#00f2fe', marginTop: '6px' }}>
                  Alerts Enabled for Upcoming Workshops
                </div>
              </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Student Registrations</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Latest registered students (live)</p>
                </div>
                <button
                  onClick={() => setActiveTab('students')}
                  className="glass-btn"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  View All Enrolled <ChevronRight size={14} />
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 16px' }}>Ticket ID</th>
                      <th style={{ padding: '12px 16px' }}>Student Name</th>
                      <th style={{ padding: '12px 16px' }}>Email & Phone</th>
                      <th style={{ padding: '12px 16px' }}>Workshop</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 5).map((student) => (
                      <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 16px', fontFamily: 'Fira Code', color: '#00f2fe', fontSize: '0.82rem' }}>{student.id}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#f8fafc' }}>{student.name}</td>
                        <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.85rem' }}>
                          <div>{student.email}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{student.phone}</div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#e2e8f0', fontSize: '0.85rem' }}>{student.workshop_title}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                          No students registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: WORKSHOPS MANAGER */}
        {/* =================================================================== */}
        {!loading && activeTab === 'workshops' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manage Club Workshops</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>All data is live — changes instantly available to AI Agent</p>
              </div>

              <button
                onClick={() => setShowAddWorkshopModal(true)}
                className="glass-btn glass-btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                <Plus size={18} /> Add New Workshop
              </button>
            </div>

            {/* Workshops Cards Grid */}
            {workshops.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                No workshops in DB yet. Add your first workshop!
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                {workshops.map((ws) => (
                  <div
                    key={ws.id}
                    className="glass-panel"
                    style={{
                      padding: '28px',
                      borderRadius: '24px',
                      border: `1px solid ${ws.color || '#00f2fe'}35`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'Fira Code', color: ws.color || '#00f2fe', background: `${ws.color || '#00f2fe'}15`, padding: '4px 10px', borderRadius: '6px' }}>
                          {ws.id}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                          {ws.status}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>{ws.title}</h3>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
                        Mentor: <span style={{ color: '#f8fafc', fontWeight: 600 }}>{ws.mentor}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '20px' }}>
                        <div>🗓 {ws.date}</div>
                        <div>⏰ {ws.time}</div>
                      </div>

                      {/* Seat progress bar */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                          <span style={{ color: '#94a3b8' }}>Enrolled Capacity</span>
                          <span style={{ color: ws.color || '#00f2fe', fontWeight: 700 }}>
                            {ws.enrolled} / {ws.seats} Seats ({ws.seats > 0 ? Math.round((ws.enrolled / ws.seats) * 100) : 0}%)
                          </span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${ws.seats > 0 ? (ws.enrolled / ws.seats) * 100 : 0}%`, height: '100%', background: ws.color || '#00f2fe' }} />
                        </div>
                      </div>

                      {/* Topic Tags */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
                        {(Array.isArray(ws.topics) ? ws.topics : []).map((t, idx) => (
                          <span key={idx} style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Registered Students Section inside Workshop Card */}
                    {(() => {
                      const wsStudents = students.filter((s) => s.workshop_id === ws.id);
                      return (
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: ws.color || '#00f2fe', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Users size={14} /> Registered Candidates ({wsStudents.length})
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                              {ws.seats - wsStudents.length} Seats Left
                            </span>
                          </div>

                          {wsStudents.length === 0 ? (
                            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', color: '#64748b', fontSize: '0.78rem', textAlign: 'center' }}>
                              No candidate registered for this workshop yet.
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto', paddingRight: '4px' }}>
                              {wsStudents.map((st) => (
                                <div
                                  key={st.id}
                                  style={{
                                    padding: '8px 10px',
                                    borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.78rem',
                                  }}
                                >
                                  <div>
                                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{st.name}</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{st.email} {st.phone ? `• ${st.phone}` : ''}</div>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontFamily: 'Fira Code', fontSize: '0.7rem', color: '#00f2fe' }}>{st.id}</span>
                                    <div style={{ fontSize: '0.68rem', color: '#10b981' }}>{st.status || 'Confirmed'}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* EMBEDDED WORKSHOP AI TESTS & LIVE LOCK SECTION */}
                    {(() => {
                      const wsTests = allTests.filter((t) => t.workshop_id === ws.id);
                      return (
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <BrainCircuit size={14} /> Workshop AI Tests ({wsTests.length})
                            </span>

                            <button
                              onClick={() => handleOpenAITestMaker(ws.id)}
                              className="glass-btn glass-btn-primary"
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            >
                              + AI Test Maker
                            </button>
                          </div>

                          {wsTests.length === 0 ? (
                            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', color: '#64748b', fontSize: '0.78rem', textAlign: 'center' }}>
                              No AI test created for this workshop yet. Click "+ AI Test Maker" to generate!
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {wsTests.map((t) => {
                                const isLive = t.is_live === 1;

                                return (
                                  <div
                                    key={t.id}
                                    style={{
                                      padding: '10px 12px',
                                      borderRadius: '10px',
                                      background: 'rgba(255,255,255,0.03)',
                                      border: isLive ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.06)',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      gap: '8px',
                                    }}
                                  >
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{t.title}</span>
                                        <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: t.status === 'Published' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: t.status === 'Published' ? '#10b981' : '#f59e0b' }}>
                                          {t.status}
                                        </span>
                                      </div>
                                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                                        {t.total_questions || (t.questions ? t.questions.length : 0)} Qs • {t.level}
                                      </div>
                                    </div>

                                    {/* Live Lock Toggle Switch directly on Workshop Card */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <button
                                        onClick={() => handleToggleTestLive(t.id, t.is_live)}
                                        style={{
                                          padding: '4px 10px',
                                          borderRadius: '6px',
                                          background: isLive ? '#10b981' : 'rgba(239,68,68,0.2)',
                                          border: isLive ? '1px solid #10b981' : '1px solid rgba(239,68,68,0.4)',
                                          color: isLive ? '#fff' : '#ef4444',
                                          fontSize: '0.72rem',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                        }}
                                        title={isLive ? 'Click to Pause / Lock Test' : 'Click to Start Test Live for Students'}
                                      >
                                        {isLive ? <Play size={10} /> : <Lock size={10} />}
                                        {isLive ? 'LIVE' : 'Start Test Live'}
                                      </button>

                                      <button
                                        onClick={() => handleToggleTestPublish(t.id, t.status)}
                                        className="glass-btn"
                                        style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                                      >
                                        {t.status === 'Published' ? 'Unpublish' : 'Publish'}
                                      </button>

                                      <button
                                        onClick={() => handleDeleteTest(t.id)}
                                        style={{ padding: '4px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* End Workshop Status & Action */}
                    <div style={{ marginBottom: '14px' }}>
                      {ws.is_ended ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.78rem', padding: '6px 12px', borderRadius: '8px', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            ✓ Workshop Ended & Group Photo Published
                          </span>
                          <button
                            onClick={() => {
                              setEndWorkshopTarget(ws);
                              setShowFeedbacksModal(true);
                              setLoadingFeedbacks(true);
                              fetch(`${API_BASE}/api/workshops/${ws.id}/feedbacks`)
                                .then((r) => r.ok ? r.json() : [])
                                .then((data) => setFeedbacksList(data))
                                .catch(() => {})
                                .finally(() => setLoadingFeedbacks(false));
                            }}
                            className="glass-btn"
                            style={{ padding: '6px 14px', fontSize: '0.78rem', color: '#00f2fe', borderColor: 'rgba(0,242,254,0.4)', background: 'rgba(0,242,254,0.08)' }}
                          >
                            💬 View Student Feedbacks
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEndWorkshopTarget(ws);
                            setEndGroupPhotoUrl(ws.group_photo_url || '');
                            setEndFeedbackPrompt(ws.feedback_prompt || 'What did you learn in this workshop and how can we improve future sessions?');
                            setShowEndWorkshopModal(true);
                          }}
                          className="glass-btn"
                          style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.5)', fontWeight: 800 }}
                        >
                          🏁 End Workshop & Collect Feedback
                        </button>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', flexWrap: 'wrap' }}>

                      <button
                        onClick={() => handleOpenAttendanceModal(ws)}
                        className="glass-btn glass-btn-primary"
                        style={{ flex: 1, padding: '8px 10px', fontSize: '0.78rem', justifyContent: 'center' }}
                      >
                        <CalendarCheck size={14} /> Attendance Calendar
                      </button>

                      <button
                        onClick={() => handleOpenAITestMaker(ws.id)}
                        className="glass-btn"
                        style={{ padding: '8px 10px', fontSize: '0.78rem', justifyContent: 'center', borderColor: 'rgba(0,242,254,0.4)', color: '#00f2fe' }}
                      >
                        <BrainCircuit size={14} /> AI Test Maker
                      </button>

                      <button
                        onClick={() => handleOpenResourceModal(ws)}
                        className="glass-btn"
                        style={{ padding: '8px 10px', fontSize: '0.78rem', justifyContent: 'center' }}
                      >
                        <BookOpen size={14} /> Resources
                      </button>

                      <button
                        onClick={() => handleDeleteWorkshop(ws.id)}
                        style={{ padding: '8px 12px', borderRadius: '99px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: ENROLLED STUDENTS DATA DIRECTORY */}
        {/* =================================================================== */}
        {!loading && activeTab === 'students' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Enrolled Student Data Directory</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Live System — includes workshop form registrations</p>
              </div>

              <button
                onClick={() => {
                  const rows = filteredStudents.map(s => `${s.id},${s.name},${s.email},${s.phone},${s.workshop_title},${s.date},${s.status}`).join('\n');
                  const blob = new Blob([`ID,Name,Email,Phone,Workshop,Date,Status\n${rows}`], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'wdc_students.csv';
                  a.click();
                }}
                className="glass-btn"
                style={{ padding: '10px 18px', fontSize: '0.85rem' }}
              >
                <Download size={16} /> Export CSV
              </button>
            </div>

            {/* Controls Bar: Filter & Search */}
            <div
              className="glass-panel"
              style={{
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Filter size={16} color="#00f2fe" />
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Workshop Filter:</span>
                <select
                  value={selectedWorkshopFilter}
                  onChange={(e) => setSelectedWorkshopFilter(e.target.value)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'rgba(8, 9, 20, 0.9)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.88rem',
                  }}
                >
                  <option value="all">All Workshops ({students.length} Students)</option>
                  {workshops.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search name, email or ID..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '10px',
                    background: 'rgba(8, 9, 20, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Ticket ID</th>
                    <th style={{ padding: '12px 16px' }}>Student Name</th>
                    <th style={{ padding: '12px 16px' }}>Contact Email</th>
                    <th style={{ padding: '12px 16px' }}>WhatsApp Phone</th>
                    <th style={{ padding: '12px 16px' }}>Enrolled Workshop</th>
                    <th style={{ padding: '12px 16px' }}>Date</th>
                    <th style={{ padding: '12px 16px' }}>Resource Access</th>
                    <th style={{ padding: '12px 16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((st) => (
                      <tr key={st.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 16px', fontFamily: 'Fira Code', color: '#00f2fe', fontSize: '0.82rem' }}>{st.id}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#f8fafc' }}>{st.name}</td>
                        <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{st.email}</td>
                        <td style={{ padding: '14px 16px', color: '#94a3b8', fontFamily: 'Fira Code', fontSize: '0.82rem' }}>{st.phone}</td>
                        <td style={{ padding: '14px 16px', color: '#e2e8f0', fontSize: '0.85rem' }}>{st.workshop_title}</td>
                        <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.82rem' }}>{st.date}</td>
                        <td style={{ padding: '14px 16px' }}>
                          {st.allowed === 1 ? (
                            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} /> Allowed
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} /> Pending Approval
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => handleOpenAccessModal(st)}
                            className="glass-btn"
                            style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: st.allowed === 1 ? 'rgba(16,185,129,0.4)' : 'rgba(0,242,254,0.4)' }}
                          >
                            <ShieldCheck size={14} color={st.allowed === 1 ? '#10b981' : '#00f2fe'} /> Allow / Credentials
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                        No enrolled students found for the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: NOTIFICATIONS BROADCAST MANAGER */}
        {/* =================================================================== */}
        {!loading && activeTab === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>WDC Notification Broadcast</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Live System — AI Agent instantly reads new notifications</p>
              </div>

              <button
                onClick={() => setShowAddNotifModal(true)}
                className="glass-btn glass-btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                <Bell size={16} /> Broadcast New Notification
              </button>
            </div>

            {/* Notifications List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {notifications.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                  No notifications in DB. Broadcast your first announcement!
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="glass-panel"
                    style={{
                      padding: '20px 28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'rgba(0, 242, 254, 0.1)',
                          border: '1px solid rgba(0, 242, 254, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#00f2fe',
                        }}
                      >
                        <Bell size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>{n.title}</h4>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: '#94a3b8' }}>
                          <span>Category: <strong style={{ color: '#f8fafc' }}>{n.category}</strong></span>
                          <span>Date: {n.date}</span>
                          <span>Views: {n.views}</span>
                          {n.related_workshop_id && <span>Workshop: <strong style={{ color: '#00f2fe' }}>{n.related_workshop_id}</strong></span>}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: n.active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: n.active ? '#10b981' : '#64748b' }}>
                        {n.active ? '● LIVE BROADCAST' : 'ARCHIVED'}
                      </span>
                      <button
                        onClick={() => handleDeleteNotification(n.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: EMAIL SUBSCRIBERS DIRECTORY */}
        {activeTab === 'subscribers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Email Alerts Subscribers Directory</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Users who subscribed to receive instant email notifications for new workshops & announcements</p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    const emailsStr = subscribers.map((s) => s.email).join(', ');
                    if (!emailsStr) return alert('No subscriber emails to copy yet!');
                    navigator.clipboard.writeText(emailsStr);
                    setCopiedEmails(true);
                    setTimeout(() => setCopiedEmails(false), 3000);
                  }}
                  className="glass-btn glass-btn-primary"
                  style={{ padding: '10px 18px', fontSize: '0.85rem' }}
                >
                  <Mail size={16} /> {copiedEmails ? '✓ Copied All Emails!' : `Copy All ${subscribers.length} Emails`}
                </button>
              </div>
            </div>

            {/* Search Filter */}
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Search size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search subscriber by email address or subscription date..."
                value={subscriberSearchQuery}
                onChange={(e) => setSubscriberSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Subscribers Table */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Subscriber Email</th>
                    <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Subscription Date</th>
                    <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>Alert Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers
                    .filter((s) => s.email.toLowerCase().includes(subscriberSearchQuery.toLowerCase()) || (s.date && s.date.includes(subscriberSearchQuery)))
                    .map((sub, idx) => (
                      <tr
                        key={sub.email}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          transition: 'background 0.2s ease',
                        }}
                      >
                        <td style={{ padding: '16px 20px', color: '#64748b', fontFamily: 'Fira Code' }}>{idx + 1}</td>
                        <td style={{ padding: '16px 20px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={16} color="#00f2fe" /> {sub.email}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#94a3b8', fontFamily: 'Fira Code' }}>{sub.date || 'Active'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.78rem', fontWeight: 600 }}>
                            ● Active Email Alerts
                          </span>
                        </td>
                      </tr>
                    ))}
                  {subscribers.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
                        No email subscribers recorded yet. When students subscribe via the AI Assistant, their emails will appear here automatically.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CORE TEAM MEMBERS (3D PLAYING CARDS DECK) */}
        {activeTab === 'team' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>WDC Core Team Cards Deck</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Manage team members displayed as 3D interactive playing cards on the Landing Page</p>
              </div>

              <button
                onClick={() => setShowAddTeamModal(true)}
                className="glass-btn glass-btn-primary"
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
              >
                <Plus size={16} /> Add Team Member Card
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                    <img
                      src={member.image_url}
                      alt={member.name}
                      style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>{member.name}</div>
                      <div style={{ fontSize: '0.82rem', color: '#00f2fe', fontWeight: 600 }}>{member.role}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                    <a
                      href={member.linkedin_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.78rem', color: '#0077b5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <LinkedInIcon size={14} color="#0077b5" /> LinkedIn Profile
                    </a>
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete ${member.name} from Core Team deck?`)) return;
                        try {
                          const res = await fetch(`${API_BASE}/api/team/${member.id}`, { method: 'DELETE' });
                          if (res.ok) setTeamMembers((prev) => prev.filter((m) => m.id !== member.id));
                        } catch (e) { alert('Failed to delete'); }
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: '#64748b' }}>
                  No team members in deck yet. Click "Add Team Member Card" above to add team members with photo URL, name, and designation.
                </div>
              )}
            </div>
          </div>
        )}


        {/* TAB 5: MEDIA GALLERY SHOWCASE */}
        {activeTab === 'gallery' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Hero Media Gallery Showcase</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Add & manage video/image URLs displayed in the GSAP animated showcase below the AI Assistant</p>
              </div>

              <button
                onClick={() => setShowAddMediaModal(true)}
                className="glass-btn glass-btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.88rem' }}
              >
                <Plus size={16} /> Add New Media Item
              </button>
            </div>

            {/* Gallery Media List Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {galleryMedia.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', position: 'relative', background: '#050614' }}>
                    {item.media_type === 'video' ? (
                      <video src={item.url} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    <span style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(5, 6, 20, 0.8)', border: '1px solid #00f2fe', color: '#00f2fe', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Fira Code' }}>
                      {item.media_type.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', wordBreak: 'break-all', fontFamily: 'Fira Code' }}>{item.url}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#ff007a', fontFamily: 'Fira Code', fontWeight: 600 }}>
                      Category: {item.category || 'Highlight'}
                    </span>
                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {galleryMedia.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No media items added yet. Click 'Add New Media Item' to upload videos or images to the showcase.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* MODAL 1: ADD WORKSHOP MODAL */}
      {/* =================================================================== */}
      {showAddWorkshopModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(4, 5, 13, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '540px',
              width: '100%',
              padding: '32px',
              borderRadius: '24px',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowAddWorkshopModal(false)}
              style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>Add New Workshop</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '24px' }}>Saved — AI Agent will instantly know about it</p>

            <form onSubmit={handleAddWorkshop} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Workshop Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 15 & AI Agents Masterclass"
                  value={newWorkshop.title}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Mentor Name</label>
                  <input
                    type="text"
                    placeholder="Mentor Name"
                    value={newWorkshop.mentor}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, mentor: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Seat Limit</label>
                  <input
                    type="number"
                    value={newWorkshop.seats}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, seats: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Date *</label>
                  <input
                    type="date"
                    required
                    value={newWorkshop.date}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Time</label>
                  <input
                    type="text"
                    value={newWorkshop.time}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, time: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Topics (comma separated)</label>
                <input
                  type="text"
                  placeholder="React 19, GSAP, FastAPI"
                  value={newWorkshop.topics}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, topics: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Theme Color</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={newWorkshop.color}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, color: e.target.value })}
                    style={{ width: '48px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'none' }}
                  />
                  {['#00f2fe', '#7928ca', '#10b981', '#ff007a', '#f59e0b'].map(c => (
                    <button key={c} type="button" onClick={() => setNewWorkshop({ ...newWorkshop, color: c })}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: newWorkshop.color === c ? '3px solid #fff' : '2px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="glass-btn glass-btn-primary"
                style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '10px' }}
              >
                {submitting ? <><Loader2 size={16} /> Saving to DB...</> : <><Plus size={16} /> Publish Workshop to DB</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: ADD NOTIFICATION MODAL */}
      {/* =================================================================== */}
      {showAddNotifModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(4, 5, 13, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '32px',
              borderRadius: '24px',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowAddNotifModal(false)}
              style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>New Broadcast Notification</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '24px' }}>
              Saved — AI Agent will instantly show this to users
            </p>

            <form onSubmit={handleAddNotification} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 📢 Starter Code Released for Workshop"
                  value={newNotif.title}
                  onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Category</label>
                <select
                  value={newNotif.category}
                  onChange={(e) => setNewNotif({ ...newNotif, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                >
                  <option value="Announcement">Announcement</option>
                  <option value="Resource Link">Resource Link</option>
                  <option value="Achievement">Achievement</option>
                  <option value="Workshop Announcement">Workshop Announcement</option>
                  <option value="Important">Important</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Date *</label>
                  <input
                    type="date"
                    required
                    value={newNotif.date}
                    onChange={(e) => setNewNotif({ ...newNotif, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Time</label>
                  <input
                    type="text"
                    value={newNotif.time}
                    onChange={(e) => setNewNotif({ ...newNotif, time: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Related Workshop (optional)</label>
                <select
                  value={newNotif.related_workshop_id}
                  onChange={(e) => setNewNotif({ ...newNotif, related_workshop_id: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                >
                  <option value="">— None —</option>
                  {workshops.map(w => (
                    <option key={w.id} value={w.id}>{w.title}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="glass-btn glass-btn-primary"
                style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '10px' }}
              >
                {submitting ? <><Loader2 size={16} /> Broadcasting...</> : <><Send size={16} /> Broadcast Notification</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD GALLERY MEDIA MODAL */}
      {showAddMediaModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(4, 5, 13, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            className="glass-panel"
            style={{ width: '100%', maxWidth: '520px', padding: '32px', position: 'relative' }}
          >
            <button
              onClick={() => setShowAddMediaModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>Add Hero Gallery Media Item</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '24px' }}>
              Submit a video URL (mp4) or image URL to showcase below the AI Assistant
            </p>

            <form onSubmit={handleAddMedia} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Media Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GenAI Masterclass Teaser Video"
                  value={newMedia.title}
                  onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,242,254,0.3)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Media URL (Video or Image URL)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /avatar_video.mp4 or https://images.unsplash.com/..."
                  value={newMedia.url}
                  onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,242,254,0.3)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Media Type</label>
                  <select
                    value={newMedia.media_type}
                    onChange={(e) => setNewMedia({ ...newMedia, media_type: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(0,242,254,0.3)', color: '#fff', outline: 'none' }}
                  >
                    <option value="video">Autoplay Video (without voice)</option>
                    <option value="image">Image Banner</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Category Badge</label>
                  <select
                    value={newMedia.category}
                    onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(0,242,254,0.3)', color: '#fff', outline: 'none' }}
                  >
                    <option value="Highlight">Highlight</option>
                    <option value="AI Tech Showcase">AI Tech Showcase</option>
                    <option value="Workshop Feature">Workshop Feature</option>
                    <option value="Achievement">Achievement</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddMediaModal(false)}
                  className="glass-btn"
                  style={{ padding: '10px 20px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="glass-btn glass-btn-primary"
                  style={{ padding: '10px 24px' }}
                >
                  {submitting ? 'Adding...' : 'Add Media Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STUDENT ACCESS CONTROL & CREDENTIALS */}
      {showAccessModal && accessStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000, background: 'rgba(5, 6, 18, 0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', borderRadius: '24px', padding: '28px', border: '1px solid rgba(0,242,254,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', position: 'relative' }}>
            <button onClick={() => setShowAccessModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0,242,254,0.15)', color: '#00f2fe' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Allow Workshop Access</h3>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Student: <span style={{ color: '#fff', fontWeight: 600 }}>{accessStudent.name}</span> ({accessStudent.email})</div>
              </div>
            </div>

            <form onSubmit={handleSaveAccess} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Resource Access Status</label>
                <select
                  value={accessAllowed}
                  onChange={(e) => setAccessAllowed(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(0,242,254,0.3)', color: '#fff', outline: 'none' }}
                >
                  <option value={1}>✅ ALLOW ACCESS (Allow tests, notes & materials)</option>
                  <option value={0}>⏳ PENDING / DISALLOW ACCESS</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>Set Student Login Password *</label>
                <div style={{ position: 'relative' }}>
                  <Key size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Enter password for this student"
                    value={accessPassword}
                    onChange={(e) => setAccessPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(0,242,254,0.3)', color: '#fff', outline: 'none', fontFamily: 'Fira Code' }}
                  />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                  User will log in on Student Dashboard using Email (<span style={{ color: '#00f2fe' }}>{accessStudent.email}</span>) and this password.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAccessModal(false)} className="glass-btn" style={{ padding: '10px 18px' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="glass-btn glass-btn-primary" style={{ padding: '10px 22px' }}>
                  {submitting ? 'Saving...' : 'Save & Allow Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: WORKSHOP DAILY ATTENDANCE CALENDAR */}
      {showAttendanceModal && attendanceWorkshop && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000, background: 'rgba(5, 6, 18, 0.88)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '88vh', overflowY: 'auto', borderRadius: '24px', padding: '28px', border: '1px solid rgba(0,242,254,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.7)', position: 'relative' }}>
            <button onClick={() => setShowAttendanceModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0,242,254,0.15)', color: '#00f2fe' }}>
                <CalendarCheck size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'Fira Code', color: '#00f2fe' }}>DAILY WORKSHOP ATTENDANCE CALENDAR</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{attendanceWorkshop.title} ({attendanceWorkshop.id})</h3>
              </div>
            </div>

            {/* Attendance Filter Controls & Date Picker */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Attendance Date</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(8, 9, 20, 0.95)', border: '1px solid rgba(0, 242, 254, 0.3)', color: '#fff', outline: 'none', fontSize: '0.85rem', fontFamily: 'Fira Code' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '18px' }}>
                  <button onClick={() => setAttendanceDate(new Date().toISOString().split('T')[0])} className="glass-btn" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Today</button>
                  <button onClick={() => { const d = new Date(); d.setDate(d.getDate() - 1); setAttendanceDate(d.toISOString().split('T')[0]); }} className="glass-btn" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Yesterday</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setAllAttendanceStatus('Present')} className="glass-btn" style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }}>All Present</button>
                <button onClick={() => setAllAttendanceStatus('Absent')} className="glass-btn" style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>All Absent</button>
                <button onClick={handleSaveAttendance} disabled={savingAttendance} className="glass-btn glass-btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  {savingAttendance ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </div>

            {/* Attendance Matrix Table */}
            <div style={{ overflowX: 'auto' }}>
              {loadingAttendance ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Loading attendance...</div>
              ) : attendanceList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#64748b', fontSize: '0.85rem' }}>No candidates enrolled in this workshop yet.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 12px' }}>Ticket ID</th>
                      <th style={{ padding: '10px 12px' }}>Student Name</th>
                      <th style={{ padding: '10px 12px' }}>Contact</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Mark Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.map((st) => (
                      <tr key={st.student_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px', fontFamily: 'Fira Code', color: '#00f2fe', fontSize: '0.8rem' }}>{st.student_id}</td>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#f8fafc' }}>{st.name}</td>
                        <td style={{ padding: '12px', color: '#94a3b8', fontSize: '0.8rem' }}>{st.email}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '3px', borderRadius: '8px' }}>
                            {['Present', 'Absent', 'Late'].map((statusOpt) => {
                              const isSel = st.status === statusOpt;
                              const colors = { Present: '#10b981', Absent: '#ef4444', Late: '#f59e0b' };
                              const color = colors[statusOpt];

                              return (
                                <button
                                  key={statusOpt}
                                  type="button"
                                  onClick={() => {
                                    setAttendanceList((prev) => prev.map((item) => (item.student_id === st.student_id ? { ...item, status: statusOpt } : item)));
                                  }}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    background: isSel ? `${color}25` : 'transparent',
                                    border: isSel ? `1px solid ${color}` : '1px solid transparent',
                                    color: isSel ? color : '#94a3b8',
                                    fontWeight: isSel ? 700 : 500,
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {statusOpt}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: WORKSHOP RESOURCES MANAGER (Notes, Tests, Code, Videos) */}
      {showResourceModal && resourceWorkshop && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000, background: 'rgba(5, 6, 18, 0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '720px', maxHeight: '88vh', overflowY: 'auto', borderRadius: '24px', padding: '28px', border: '1px solid rgba(0,242,254,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', position: 'relative' }}>
            <button onClick={() => setShowResourceModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(121,40,202,0.15)', color: '#7928ca' }}>
                <BookOpen size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'Fira Code', color: '#00f2fe' }}>WORKSHOP RESOURCE MANAGER</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{resourceWorkshop.title}</h3>
              </div>
            </div>

            {/* Add Resource Form */}
            <form onSubmit={handleAddResource} style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Add New Resource (Test, Notes, Code, Video)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>Resource Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masterclass PDF Notes & Practice Quiz"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>Resource Type</label>
                  <select
                    value={newResource.resource_type}
                    onChange={(e) => setNewResource({ ...newResource, resource_type: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                  >
                    <option value="Notes">Study Notes</option>
                    <option value="Test">Online Test / Quiz</option>
                    <option value="Code">Practice Code / GitHub</option>
                    <option value="Video">Video Lecture</option>
                    <option value="Material">PDF / Material</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>Link URL (Docs / Drive / GitHub / Quiz Link)</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/... or https://quiz.link"
                  value={newResource.link_url}
                  onChange={(e) => setNewResource({ ...newResource, link_url: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>Brief Description</label>
                <input
                  type="text"
                  placeholder="e.g. Complete session notes and test instructions"
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ textAlign: 'right', marginTop: '4px' }}>
                <button type="submit" disabled={submitting} className="glass-btn glass-btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                  {submitting ? 'Adding...' : 'Publish Resource to Workshop'}
                </button>
              </div>
            </form>

            {/* List of Existing Resources */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
                Existing Resources for this Workshop ({workshopResources.length})
              </h4>

              {loadingResources ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Loading resources...</div>
              ) : workshopResources.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', color: '#94a3b8', fontSize: '0.82rem' }}>
                  No resources added for this workshop yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {workshopResources.map((r) => (
                    <div key={r.id} style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,242,254,0.15)', color: '#00f2fe', fontWeight: 700 }}>
                            {r.resource_type}
                          </span>
                          <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{r.title}</span>
                        </div>
                        {r.description && <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>{r.description}</div>}
                        {r.link_url && <div style={{ fontSize: '0.72rem', color: '#3b82f6', marginTop: '2px' }}>🔗 {r.link_url}</div>}
                      </div>

                      <button onClick={() => handleDeleteResource(r.id)} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AI TEST MAKER ASSISTANT & QUESTION EDITOR */}
      {showAITestModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000, background: 'rgba(5, 6, 18, 0.88)', backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '28px', padding: '32px', border: '1px solid rgba(0,242,254,0.4)', boxShadow: '0 25px 80px rgba(0,0,0,0.7)', position: 'relative' }}>
            <button onClick={() => setShowAITestModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(0,242,254,0.4)' }}>
                <BrainCircuit size={26} color="#fff" />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', fontFamily: 'Fira Code', color: '#00f2fe', fontWeight: 600 }}>🤖 AI TEST MAKER ASSISTANT (LANGCHAIN PROMPT ENGINE)</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Generate & Edit Workshop Test</h3>
              </div>
            </div>

            {/* Prompt Specification Form */}
            <form onSubmit={handleGenerateAITest} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Test Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack React & AI Quiz"
                    value={testPromptData.title}
                    onChange={(e) => setTestPromptData({ ...testPromptData, title: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(0,242,254,0.3)', color: '#fff', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Target Workshop *</label>
                  <select
                    value={testPromptData.workshop_id}
                    onChange={(e) => setTestPromptData({ ...testPromptData, workshop_id: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(0,242,254,0.3)', color: '#fff', outline: 'none', fontSize: '0.88rem' }}
                  >
                    {workshops.map((w) => (
                      <option key={w.id} value={w.id}>{w.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Topics for AI to generate questions *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React Hooks, Virtual DOM, Component Lifecycle, State & Props"
                  value={testPromptData.topic}
                  onChange={(e) => setTestPromptData({ ...testPromptData, topic: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(0,242,254,0.3)', color: '#fff', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>Questions Count</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={testPromptData.num_questions}
                    onChange={(e) => setTestPromptData({ ...testPromptData, num_questions: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>Difficulty Level</label>
                  <select
                    value={testPromptData.level}
                    onChange={(e) => setTestPromptData({ ...testPromptData, level: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>Question Type</label>
                  <select
                    value={testPromptData.question_type}
                    onChange={(e) => setTestPromptData({ ...testPromptData, question_type: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  >
                    <option value="single_correct">Single Correct</option>
                    <option value="multi_correct">Multi Correct</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>Duration (Mins)</label>
                  <input
                    type="number"
                    value={testDurationMins}
                    onChange={(e) => setTestDurationMins(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={generatingTest}
                className="glass-btn glass-btn-primary"
                style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '0.95rem', marginTop: '6px' }}
              >
                {generatingTest ? (
                  <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> AI generating questions via LangChain template...</>
                ) : (
                  <>🤖 Generate Test Questions with AI Assistant</>
                )}
              </button>
            </form>

            {/* Questions Review & Live Editor */}
            {editorQuestions.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileQuestion size={20} color="#00f2fe" /> Review & Edit Questions ({editorQuestions.length})
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {editorQuestions.map((q, qIndex) => (
                    <div key={qIndex} style={{ padding: '18px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#00f2fe', fontFamily: 'Fira Code' }}>Q{qIndex + 1}.</span>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => {
                            const updated = [...editorQuestions];
                            updated[qIndex].question = e.target.value;
                            setEditorQuestions(updated);
                          }}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(8,9,20,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none', fontWeight: 600 }}
                        />
                      </div>

                      {/* 4 Options with Correct Answer Marking */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                        {(q.options || []).map((optText, optIndex) => {
                          const isCorrect = (q.correct_answers || []).includes(optIndex);

                          return (
                            <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '8px', border: isCorrect ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.06)' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...editorQuestions];
                                  if (testPromptData.question_type === 'single_correct') {
                                    updated[qIndex].correct_answers = [optIndex];
                                  } else {
                                    const current = updated[qIndex].correct_answers || [];
                                    if (current.includes(optIndex)) {
                                      updated[qIndex].correct_answers = current.filter(i => i !== optIndex);
                                    } else {
                                      updated[qIndex].correct_answers = [...current, optIndex];
                                    }
                                  }
                                  setEditorQuestions(updated);
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isCorrect ? '#10b981' : '#64748b' }}
                                title="Mark as correct answer"
                              >
                                {isCorrect ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                              </button>

                              <input
                                type="text"
                                value={optText}
                                onChange={(e) => {
                                  const updated = [...editorQuestions];
                                  updated[qIndex].options[optIndex] = e.target.value;
                                  setEditorQuestions(updated);
                                }}
                                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', background: 'rgba(8,9,20,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>Autocheck Explanation</label>
                        <input
                          type="text"
                          value={q.explanation || ''}
                          onChange={(e) => {
                            const updated = [...editorQuestions];
                            updated[qIndex].explanation = e.target.value;
                            setEditorQuestions(updated);
                          }}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', background: 'rgba(8,9,20,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', outline: 'none', fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Publish Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSaveAndPublishTest('Draft')}
                    className="glass-btn"
                    style={{ padding: '12px 22px' }}
                  >
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSaveAndPublishTest('Published')}
                    className="glass-btn glass-btn-primary"
                    style={{ padding: '12px 28px', fontSize: '0.95rem' }}
                  >
                    🚀 Publish Test to Students
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW TEAM MEMBER CARD */}
      {showAddTeamModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(8, 9, 20, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '32px', borderRadius: '24px', border: '1px solid rgba(0, 242, 254, 0.4)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={24} color="#00f2fe" /> Add Core Team Member Card
              </h3>
              <button onClick={() => setShowAddTeamModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newTeamMember.name || !newTeamMember.role || !newTeamMember.image_url) {
                return alert('Please fill in Member Name, Role/Designation, and Image URL');
              }
              setSubmitting(true);
              try {
                const res = await fetch(`${API_BASE}/api/team`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newTeamMember),
                });
                if (res.ok) {
                  const added = await res.json();
                  setTeamMembers((prev) => [...prev, added]);
                  setShowAddTeamModal(false);
                  setNewTeamMember({ name: '', role: '', image_url: '', linkedin_url: '' });
                  alert(`🎉 Core Team Member "${added.name}" added successfully!`);
                } else {
                  const errData = await res.json().catch(() => ({}));
                  alert('Failed to add team member: ' + (errData.detail || res.statusText));
                }
              } catch (e) {
                alert('Backend server connection error');
              } finally {
                setSubmitting(false);
              }
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px', display: 'block', fontWeight: 600 }}>Member Name ("Naam") *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ashish Kumar"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px', display: 'block', fontWeight: 600 }}>Designation / Role ("Padwi") *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deputy Co-ordinator"
                    value={newTeamMember.role}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px', display: 'block', fontWeight: 600 }}>Member Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://imageurl.im/..."
                    value={newTeamMember.image_url}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, image_url: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px', display: 'block', fontWeight: 600 }}>LinkedIn Profile URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://www.linkedin.com/in/username"
                    value={newTeamMember.linkedin_url}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, linkedin_url: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddTeamModal(false)} className="glass-btn">Cancel</button>
                <button type="submit" disabled={submitting} className="glass-btn glass-btn-primary">
                  {submitting ? 'Adding...' : '➕ Add Member Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: END WORKSHOP & PUBLISH FEEDBACK FORM */}
      {showEndWorkshopModal && endWorkshopTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(8, 9, 20, 0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '32px', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.5)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  🏁 End Workshop: {endWorkshopTarget.title}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                  Mark workshop complete, publish final group photo to Landing Page Activities, and enable feedback form for students.
                </p>
              </div>
              <button onClick={() => setShowEndWorkshopModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              try {
                const res = await fetch(`${API_BASE}/api/workshops/${endWorkshopTarget.id}/end`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    group_photo_url: endGroupPhotoUrl,
                    feedback_prompt: endFeedbackPrompt,
                  }),
                });
                if (res.ok) {
                  setShowEndWorkshopModal(false);
                  setWorkshops((prev) =>
                    prev.map((w) =>
                      w.id === endWorkshopTarget.id
                        ? { ...w, is_ended: 1, status: 'Completed', group_photo_url: endGroupPhotoUrl, feedback_prompt: endFeedbackPrompt }
                        : w
                    )
                  );
                  alert(`🎉 Workshop "${endWorkshopTarget.title}" Completed!\n\n1. Group photo added to Landing Page Activities section.\n2. Feedback form activated in Student Dashboard.`);
                  fetchAllData();
                } else {
                  alert('Failed to end workshop');
                }
              } catch (err) {
                alert('Backend connection error');
              } finally {
                setSubmitting(false);
              }
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#fbbf24', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                    Final Workshop Group Photo URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://imageurl.im/... or https://images.unsplash.com/..."
                    value={endGroupPhotoUrl}
                    onChange={(e) => setEndGroupPhotoUrl(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fff', outline: 'none' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                    📸 This photo will be automatically showcased under "Activities" on the WDC Landing Page with the workshop title.
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
                    Custom Student Feedback Question / Prompt
                  </label>
                  <textarea
                    rows="3"
                    value={endFeedbackPrompt}
                    onChange={(e) => setEndFeedbackPrompt(e.target.value)}
                    placeholder="Ask students specific feedback questions..."
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none', resize: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowEndWorkshopModal(false)} className="glass-btn">Cancel</button>
                <button type="submit" disabled={submitting} className="glass-btn glass-btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderColor: '#f59e0b' }}>
                  {submitting ? 'Ending...' : '🚀 Proceed & Complete Workshop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW SUBMITTED STUDENT FEEDBACKS */}
      {showFeedbacksModal && endWorkshopTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(8, 9, 20, 0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '680px', maxHeight: '85vh', overflowY: 'auto', padding: '32px', borderRadius: '24px', border: '1px solid rgba(0, 242, 254, 0.4)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  💬 Student Feedbacks & Suggestions
                </h3>
                <p style={{ color: '#00f2fe', fontSize: '0.85rem', fontWeight: 600 }}>{endWorkshopTarget.title}</p>
              </div>
              <button onClick={() => setShowFeedbacksModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {loadingFeedbacks ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading student feedbacks...</div>
            ) : feedbacksList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No student feedback submitted for this workshop yet. Enrolled students can submit feedback from their Student Dashboard.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {feedbacksList.map((fb) => (
                  <div key={fb.id} style={{ padding: '18px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{fb.student_name}</span>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '8px' }}>({fb.student_email})</span>
                      </div>
                      <div style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 800 }}>
                        {'⭐'.repeat(fb.rating || 5)} ({fb.rating}/5)
                      </div>
                    </div>
                    <p style={{ color: '#e2e8f0', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '8px' }}>
                      "{fb.feedback_text}"
                    </p>
                    {fb.suggestions && (
                      <div style={{ fontSize: '0.8rem', color: '#00f2fe', background: 'rgba(0, 242, 254, 0.08)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                        💡 Suggestion: {fb.suggestions}
                      </div>
                    )}
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '8px', textAlign: 'right', fontFamily: 'Fira Code' }}>
                      Submitted: {fb.submitted_at}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}


      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}


