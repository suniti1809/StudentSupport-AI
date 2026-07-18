import React, { useState, useEffect, useCallback } from 'react';
import SplashScreen from './components/SplashScreen';
import { Sparkles, BookOpen, Briefcase, Clock, Award } from 'lucide-react';
import AIChatbotView from './components/AIChatbotView';
import ProductivityView from './components/ProductivityView';
import CareerServicesView from './components/CareerServicesView';
import StudyTimerView from './components/StudyTimerView';
import CGPAView from './components/CGPAView';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    checkServerConnection();
    const interval = setInterval(checkServerConnection, 8000);
    return () => clearInterval(interval);
  }, []);

  const checkServerConnection = async () => {
    try {
      const res = await fetch('/api/planner');
      if (res.ok) {
        setServerOnline(true);
      } else {
        setServerOnline(false);
      }
    } catch (err) {
      setServerOnline(false);
    }
  };

  const getPageHeading = () => {
    switch (activeTab) {
      case 'chat': return { title: 'AI Study Assistant', subtitle: 'Consult your academic model' };
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
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-glow">
            <Sparkles size={20} />
          </div>
          <div className="logo-text">
            <h2>StudentSupport AI</h2>
            <span>AI COMPANION</span>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-group-label">Core</div>
          
          <button 
            className={`menu-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <span className="menu-item-icon"><Sparkles size={18} /></span>
            <span>AI Chatbot</span>
          </button>

          <div className="menu-group-label">Services</div>

          <button 
            className={`menu-item ${activeTab === 'productivity' ? 'active' : ''}`}
            onClick={() => setActiveTab('productivity')}
          >
            <span className="menu-item-icon"><BookOpen size={18} /></span>
            <span>Productivity</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'career' ? 'active' : ''}`}
            onClick={() => setActiveTab('career')}
          >
            <span className="menu-item-icon"><Briefcase size={18} /></span>
            <span>Career Services</span>
          </button>

          <div className="menu-group-label">Utilities</div>

          <button 
            className={`menu-item ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            <span className="menu-item-icon"><Clock size={18} /></span>
            <span>Study Timer</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'cgpa' ? 'active' : ''}`}
            onClick={() => setActiveTab('cgpa')}
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
          <div className="header-title">
            <h1>{heading.title}</h1>
            <p>{heading.subtitle}</p>
          </div>
          
          <div className="header-user">
            <div className="user-badge">
              <span className="avatar-circle">S</span>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>Active Student</span>
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
    </div>
    </>
  );
}
