import React, { useState, useEffect, useCallback } from 'react';
import SplashScreen from './components/SplashScreen';
import { Sparkles, BookOpen, Briefcase, Clock, Award, Menu, X } from 'lucide-react';
import AIChatbotView from './components/AIChatbotView';
import ProductivityView from './components/ProductivityView';
import CareerServicesView from './components/CareerServicesView';
import StudyTimerView from './components/StudyTimerView';
import CGPAView from './components/CGPAView';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    checkServerConnection();
    const interval = setInterval(checkServerConnection, 8000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileDrawerOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  const checkServerConnection = async () => {
    try {
      const res = await fetch('/api/planner');
      if (res.ok) {
        setServerOnline(true);
      } else {
        setServerOnline(false);
      }
    } catch {
      setServerOnline(false);
    }
  };

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageHeading = () => {
    switch (activeTab) {
      case 'chat': return { title: 'AI Study Assistant', subtitle: 'Consult your academic assistant' };
      case 'productivity': return { title: 'Student Productivity', subtitle: 'Manage study plans, assignments, and reminders' };
      case 'career': return { title: 'Career Services', subtitle: 'Build your resume, practice mock interviews, and find internships' };
      case 'timer': return { title: 'Study Focus Timer', subtitle: 'Deep work Pomodoro interval tracker' };
      case 'cgpa': return { title: 'CGPA Academic Planner', subtitle: 'Track and project your cumulative marks' };
      default: return { title: 'StudentSupport AI', subtitle: 'Student Companion' };
    }
  };

  const heading = getPageHeading();

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <div className="app-layout" style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.5s ease' }}>

        {/* Mobile Backdrop Overlay */}
        <div
          className={`sidebar-backdrop ${isMobileDrawerOpen ? 'open' : ''}`}
          onClick={() => setIsMobileDrawerOpen(false)}
          aria-hidden="true"
        />

        {/* Sidebar / Off-canvas Drawer Navigation */}
        <aside className={`sidebar ${isMobileDrawerOpen ? 'mobile-open' : ''}`} aria-label="Main Navigation">
          <div className="sidebar-header">
            <div className="sidebar-header-left">
              <div className="logo-glow">
                <Sparkles size={20} />
              </div>
              <div className="logo-text">
                <h2>StudentSupport AI</h2>
                <span>AI COMPANION</span>
              </div>
            </div>
            {/* Close button visible only on mobile drawer */}
            <button
              className="sidebar-close-btn"
              onClick={() => setIsMobileDrawerOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="sidebar-menu">
            <div className="menu-group-label">Core</div>

            <button
              className={`menu-item ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => handleSelectTab('chat')}
            >
              <span className="menu-item-icon"><Sparkles size={18} /></span>
              <span>AI Chatbot</span>
            </button>

            <div className="menu-group-label">Services</div>

            <button
              className={`menu-item ${activeTab === 'productivity' ? 'active' : ''}`}
              onClick={() => handleSelectTab('productivity')}
            >
              <span className="menu-item-icon"><BookOpen size={18} /></span>
              <span>Productivity</span>
            </button>

            <button
              className={`menu-item ${activeTab === 'career' ? 'active' : ''}`}
              onClick={() => handleSelectTab('career')}
            >
              <span className="menu-item-icon"><Briefcase size={18} /></span>
              <span>Career Services</span>
            </button>

            <div className="menu-group-label">Utilities</div>

            <button
              className={`menu-item ${activeTab === 'timer' ? 'active' : ''}`}
              onClick={() => handleSelectTab('timer')}
            >
              <span className="menu-item-icon"><Clock size={18} /></span>
              <span>Study Timer</span>
            </button>

            <button
              className={`menu-item ${activeTab === 'cgpa' ? 'active' : ''}`}
              onClick={() => handleSelectTab('cgpa')}
            >
              <span className="menu-item-icon"><Award size={18} /></span>
              <span>CGPA Calculator</span>
            </button>
          </div>

          <div className="sidebar-footer">
            <div className="server-status">
              <span className="status-dot" style={{
                background: serverOnline ? 'var(--accent-green)' : 'var(--accent-red)',
                boxShadow: serverOnline ? '0 0 10px var(--accent-green)' : '0 0 10px var(--accent-red)'
              }}></span>
              <span>{serverOnline ? 'Server Connected' : 'Server Offline'}</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-area">
          {/* Header */}
          <header className="main-header">
            <div className="header-left">
              {/* Hamburger button visible only on mobile/tablet */}
              <button
                className="mobile-menu-btn"
                onClick={() => setIsMobileDrawerOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu size={22} />
              </button>

              <div className="header-title">
                <h1>{heading.title}</h1>
                <p>{heading.subtitle}</p>
              </div>
            </div>

            <div className="header-user">
              {/* Compact server status indicator for mobile */}
              <div
                className="header-server-pill"
                title={serverOnline ? 'Server Connected' : 'Server Offline'}
              >
                <span className="status-dot" style={{
                  background: serverOnline ? 'var(--accent-green)' : 'var(--accent-red)',
                  boxShadow: serverOnline ? '0 0 8px var(--accent-green)' : '0 0 8px var(--accent-red)'
                }}></span>
                <span className="header-server-text">{serverOnline ? 'Online' : 'Offline'}</span>
              </div>

              <div className="user-badge">
                <span className="avatar-circle">S</span>
                <span className="user-badge-text">Active Student</span>
              </div>
            </div>
          </header>

          {/* Dynamic Views Rendering */}
          <div className="view-wrapper">
            {activeTab === 'chat' && <AIChatbotView />}
            {activeTab === 'productivity' && <ProductivityView />}
            {activeTab === 'career' && <CareerServicesView />}
            {activeTab === 'timer' && <StudyTimerView />}
            {activeTab === 'cgpa' && <CGPAView />}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar (< 768px) */}
        <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
          <button
            className={`mobile-nav-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => handleSelectTab('chat')}
            aria-label="AI Chatbot"
          >
            <Sparkles size={19} />
            <span>Chat</span>
          </button>
          <button
            className={`mobile-nav-item ${activeTab === 'productivity' ? 'active' : ''}`}
            onClick={() => handleSelectTab('productivity')}
            aria-label="Productivity"
          >
            <BookOpen size={19} />
            <span>Tasks</span>
          </button>
          <button
            className={`mobile-nav-item ${activeTab === 'career' ? 'active' : ''}`}
            onClick={() => handleSelectTab('career')}
            aria-label="Career Services"
          >
            <Briefcase size={19} />
            <span>Career</span>
          </button>
          <button
            className={`mobile-nav-item ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => handleSelectTab('timer')}
            aria-label="Study Timer"
          >
            <Clock size={19} />
            <span>Timer</span>
          </button>
          <button
            className={`mobile-nav-item ${activeTab === 'cgpa' ? 'active' : ''}`}
            onClick={() => handleSelectTab('cgpa')}
            aria-label="CGPA Calculator"
          >
            <Award size={19} />
            <span>CGPA</span>
          </button>
        </nav>

      </div>
    </>
  );
}
