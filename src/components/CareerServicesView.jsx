import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, FileText, Compass, Send, Search, Plus, Trash2, ArrowRight, ClipboardCheck } from 'lucide-react';

export default function CareerServicesView() {
  const [activeTab, setActiveTab] = useState('resume'); // resume, mock, finder, guidance

  // ----------------------------------------------------
  // Resume Builder States
  // ----------------------------------------------------
  const [resumeData, setResumeData] = useState({
    fullName: 'Jane Doe',
    email: 'jane.doe@university.edu',
    phone: '+1 (555) 019-2834',
    college: 'State University',
    degree: 'B.S. in Computer Science',
    gpa: '3.82',
    graduation: 'May 2027',
    experienceTitle: 'Software Engineering Intern',
    experienceCompany: 'Tech Solutions Inc.',
    experienceDuration: 'June 2025 - August 2025',
    experienceDesc: 'Developed React widgets and integrated SQLite databases. Reduced payload fetch times by 20% by implementing caching.',
    skills: 'React, JavaScript, Python, SQLite, Flask, Git'
  });
  const [editingResume, setEditingResume] = useState(false);

  // ----------------------------------------------------
  // Mock Interview States
  // ----------------------------------------------------
  const [interviewRole, setInterviewRole] = useState('Software Engineer');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewMessages, setInterviewMessages] = useState([]);
  const [interviewInput, setInterviewInput] = useState('');
  const [interviewLoading, setInterviewLoading] = useState(false);
  const mockChatEndRef = useRef(null);

  useEffect(() => {
    mockChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interviewMessages, interviewLoading]);

  const startInterview = async () => {
    setInterviewStarted(true);
    setInterviewMessages([
      { role: 'assistant', content: `Hello! Welcome to your mock interview for the ${interviewRole} position. I will ask you a series of questions. Let's start: Please introduce yourself and tell me why you are interested in this role?` }
    ]);
  };

  const handleSendInterview = async () => {
    if (!interviewInput.trim()) return;
    const text = interviewInput;
    setInterviewInput('');

    const updated = [...interviewMessages, { role: 'user', content: text }];
    setInterviewMessages(updated);
    setInterviewLoading(true);

    try {
      // Send chat request with mode 'mock_interview' and selected role
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mode: 'mock_interview',
          role: interviewRole,
          history: updated.slice(0, updated.length - 1)
        })
      });
      const data = await res.json();
      setMessagesForInterview(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setInterviewLoading(false);
    }
  };

  // Helper hook to bypass scope
  const setMessagesForInterview = (callback) => {
    setInterviewMessages(callback);
  };

  // ----------------------------------------------------
  // Internship Finder States
  // ----------------------------------------------------
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New application inputs
  const [newAppTitle, setNewAppTitle] = useState('');
  const [newAppCompany, setNewAppCompany] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');
  const [newAppNotes, setNewAppNotes] = useState('');

  // Simulated live jobs to "add"
  const simulatedJobs = [
    { title: "Frontend Engineering Intern", company: "Google", url: "https://careers.google.com", location: "Mountain View, CA" },
    { title: "Junior Python developer", company: "Spotify", url: "https://lifeatspotify.com", location: "New York, NY" },
    { title: "Data Analyst Internship", company: "Amazon", url: "https://amazon.jobs", location: "Seattle, WA" },
    { title: "Systems Engineering Intern", company: "Microsoft", url: "https://careers.microsoft.com", location: "Redmond, WA" }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/internships');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addApplication = async (title, company, url, notes = '') => {
    try {
      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, company, url, notes, status: 'Applied' })
      });
      if (res.ok) fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualAddApp = async (e) => {
    e.preventDefault();
    if (!newAppTitle.trim() || !newAppCompany.trim()) return;
    await addApplication(newAppTitle, newAppCompany, newAppUrl, newAppNotes);
    setNewAppTitle('');
    setNewAppCompany('');
    setNewAppUrl('');
    setNewAppNotes('');
  };

  const updateAppStatus = async (id, currentStatus) => {
    const statuses = ['Applied', 'Interviewing', 'Offer', 'Rejected'];
    const currentIdx = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];
    
    try {
      const res = await fetch(`/api/internships/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteApplication = async (id) => {
    try {
      const res = await fetch(`/api/internships/${id}`, { method: 'DELETE' });
      if (res.ok) fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // Career Guidance States
  // ----------------------------------------------------
  const [guidanceInquiry, setGuidanceInquiry] = useState('');
  const [guidanceResult, setGuidanceResult] = useState('');
  const [guidanceLoading, setGuidanceLoading] = useState(false);

  const requestGuidance = async (e) => {
    e.preventDefault();
    if (!guidanceInquiry.trim()) return;

    setGuidanceLoading(true);
    setGuidanceResult('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: guidanceInquiry,
          mode: 'career_guidance'
        })
      });
      const data = await res.json();
      setGuidanceResult(data.reply);
    } catch (err) {
      console.error(err);
      setGuidanceResult("Sorry, I could not contact the guidance advisor. Ensure server is online.");
    } finally {
      setGuidanceLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        <button 
          className={`btn ${activeTab === 'resume' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('resume')}
        >
          <FileText size={16} /> Resume Builder
        </button>
        <button 
          className={`btn ${activeTab === 'mock' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('mock')}
        >
          <Briefcase size={16} /> Mock Interviews
        </button>
        <button 
          className={`btn ${activeTab === 'finder' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('finder')}
        >
          <Search size={16} /> Internship Tracker
        </button>
        <button 
          className={`btn ${activeTab === 'guidance' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('guidance')}
        >
          <Compass size={16} /> Career Guidance
        </button>
      </div>

      {/* ----------------- TAB: RESUME BUILDER ----------------- */}
      {activeTab === 'resume' && (
        <div className="grid-cols-2">
          {/* Edit Form */}
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Resume Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="input-text" value={resumeData.fullName} onChange={e => setResumeData({...resumeData, fullName: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Email</label>
                  <input type="email" className="input-text" value={resumeData.email} onChange={e => setResumeData({...resumeData, email: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Phone</label>
                  <input type="text" className="input-text" value={resumeData.phone} onChange={e => setResumeData({...resumeData, phone: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label>College / University</label>
                  <input type="text" className="input-text" value={resumeData.college} onChange={e => setResumeData({...resumeData, college: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>GPA</label>
                  <input type="text" className="input-text" value={resumeData.gpa} onChange={e => setResumeData({...resumeData, gpa: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Degree & Major</label>
                  <input type="text" className="input-text" value={resumeData.degree} onChange={e => setResumeData({...resumeData, degree: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Graduation Date</label>
                  <input type="text" className="input-text" value={resumeData.graduation} onChange={e => setResumeData({...resumeData, graduation: e.target.value})} />
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Recent Work / Project Experience</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Role Title</label>
                    <input type="text" className="input-text" value={resumeData.experienceTitle} onChange={e => setResumeData({...resumeData, experienceTitle: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Company / Project Name</label>
                    <input type="text" className="input-text" value={resumeData.experienceCompany} onChange={e => setResumeData({...resumeData, experienceCompany: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input type="text" className="input-text" value={resumeData.experienceDuration} onChange={e => setResumeData({...resumeData, experienceDuration: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Description of Responsibilities</label>
                  <textarea className="textarea-input" rows="3" value={resumeData.experienceDesc} onChange={e => setResumeData({...resumeData, experienceDesc: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Technical Skills (Comma separated)</label>
                <input type="text" className="input-text" value={resumeData.skills} onChange={e => setResumeData({...resumeData, skills: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Styled Print Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex-between">
              <h3 style={{ fontSize: '18px' }}>Print / Export Preview</h3>
              <button className="btn btn-secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> Print Page
              </button>
            </div>
            
            <div className="resume-preview-container">
              <div className="resume-header">
                <h2>{resumeData.fullName}</h2>
                <p>{resumeData.email}  |  {resumeData.phone}</p>
              </div>

              <div className="resume-section">
                <div className="resume-section-title">Education</div>
                <div className="resume-item">
                  <div className="resume-item-header">
                    <span>{resumeData.college}</span>
                    <span>GPA: {resumeData.gpa}</span>
                  </div>
                  <div className="resume-item-sub">
                    {resumeData.degree}  |  Graduation: {resumeData.graduation}
                  </div>
                </div>
              </div>

              <div className="resume-section">
                <div className="resume-section-title">Professional Experience</div>
                <div className="resume-item">
                  <div className="resume-item-header">
                    <span>{resumeData.experienceTitle}</span>
                    <span>{resumeData.experienceDuration}</span>
                  </div>
                  <div className="resume-item-sub">{resumeData.experienceCompany}</div>
                  <p>{resumeData.experienceDesc}</p>
                </div>
              </div>

              <div className="resume-section">
                <div className="resume-section-title">Technical Skills</div>
                <div className="resume-skills-grid">
                  {resumeData.skills.split(',').map((skill, idx) => (
                    <span key={idx} className="resume-skill-tag">{skill.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: MOCK INTERVIEW ----------------- */}
      {activeTab === 'mock' && (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          {/* Header setup if not started */}
          {!interviewStarted ? (
            <div style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
              <Briefcase size={40} className="gradient-text" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>AI Mock Interview Recruiter</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px' }}>
                Practice real interview rounds! The AI Recruiter will act as a hiring manager. Select a target track to begin:
              </p>
              <div className="form-group" style={{ textAlign: 'left', marginBottom: '24px' }}>
                <label>Target Professional Track</label>
                <select className="select-input" value={interviewRole} onChange={e => setInterviewRole(e.target.value)}>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Database Administrator">Database Administrator</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={startInterview} style={{ width: '100%' }}>
                Start Practice Session
              </button>
            </div>
          ) : (
            <div>
              {/* Active chat window */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-glass)', background: 'rgba(99,102,241,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '14px', color: '#fff' }}>Mock Recruiter ({interviewRole})</h4>
                  <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Ongoing technical screening</p>
                </div>
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setInterviewStarted(false)}>
                  Reset Session
                </button>
              </div>

              <div className="chat-layout" style={{ height: '55vh' }}>
                <div className="chat-messages" style={{ padding: '16px' }}>
                  {interviewMessages.map((msg, index) => (
                    <div key={index} className={`chat-bubble ${msg.role === 'user' ? 'user' : 'bot'}`}>
                      {msg.content}
                    </div>
                  ))}
                  {interviewLoading && (
                    <div className="chat-loading">
                      <span>Recruiter is writing feedback</span>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        <div className="chat-loading-dot"></div>
                        <div className="chat-loading-dot"></div>
                        <div className="chat-loading-dot"></div>
                      </div>
                    </div>
                  )}
                  <div ref={mockChatEndRef} />
                </div>
                
                <div className="chat-input-area">
                  <textarea 
                    className="textarea-input" 
                    rows="1" 
                    style={{ height: '44px', resize: 'none', borderRadius: '12px' }} 
                    placeholder="Type your response to the recruiter..."
                    value={interviewInput}
                    onChange={e => setInterviewInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendInterview(); } }}
                  />
                  <button className="btn btn-primary" onClick={handleSendInterview} style={{ height: '44px', width: '44px', borderRadius: '12px', padding: '0' }}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB: INTERNSHIP FINDER ----------------- */}
      {activeTab === 'finder' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Simulated search list */}
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} className="gradient-text" /> Find simulated openings
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
              Apply for simulation jobs below to log them automatically to your applications tracker.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {simulatedJobs.map(job => (
                <div key={job.title} className="planner-item-row" style={{ padding: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', color: '#fff' }}>{job.title}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{job.company}  |  📍 {job.location}</span>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => addApplication(job.title, job.company, job.url, 'Added from simulated listings')}
                  >
                    Quick Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Kanban style Application status board */}
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardCheck size={18} className="gradient-text" /> Internship Application Board
            </h3>
            
            <div className="career-board">
              {['Applied', 'Interviewing', 'Offer', 'Rejected'].map(status => {
                const list = applications.filter(a => a.status === status);
                return (
                  <div key={status} className="career-column">
                    <div className="career-col-header">
                      <span>{status}</span>
                      <span className="badge-count">{list.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: '1', maxHeight: '350px' }}>
                      {list.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', marginTop: '10px' }}>Empty</p>
                      ) : (
                        list.map(app => (
                          <div key={app.id} className="job-card">
                            <div>
                              <h5>{app.title}</h5>
                              <div className="job-company">{app.company}</div>
                              {app.url && <a href={app.url} className="job-url" target="_blank" rel="noopener noreferrer">View link</a>}
                            </div>
                            <div className="job-actions">
                              <button 
                                className="btn-icon-only" 
                                style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)' }}
                                onClick={() => updateAppStatus(app.id, app.status)}
                                title="Progress Status"
                              >
                                →
                              </button>
                              <button 
                                className="btn-icon-only" 
                                style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)' }}
                                onClick={() => deleteApplication(app.id)}
                                title="Delete application"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: CAREER GUIDANCE ----------------- */}
      {activeTab === 'guidance' && (
        <div className="grid-cols-2">
          {/* Form Inquiry */}
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Career Advisor Chat</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              Need advice on what skills to build, what projects to target, or major guidelines? Ask the advisor model:
            </p>
            <form onSubmit={requestGuidance} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Tell us about your interests, skills, or major</label>
                <textarea 
                  className="textarea-input" 
                  rows="6" 
                  placeholder="e.g. I am in my sophomore year of CS, know basic Python and SQL, and am interested in Data Engineering or Cloud Systems. What should I build?"
                  value={guidanceInquiry}
                  onChange={e => setGuidanceInquiry(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={guidanceLoading}>
                Generate Career Roadmap
              </button>
            </form>
          </div>

          {/* AI Response Output */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Your Personal Strategy Roadmap</h3>
            <div style={{ flex: '1', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
              {guidanceLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '1', gap: '12px' }}>
                  <div className="chat-loading">
                    <span>Advisor model compiling strategy roadmap</span>
                  </div>
                </div>
              ) : guidanceResult ? (
                <div style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                  {guidanceResult}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1', color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic', textAlign: 'center' }}>
                  Enter your interests and click "Generate" to construct your personalized academic and skills roadmap.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
