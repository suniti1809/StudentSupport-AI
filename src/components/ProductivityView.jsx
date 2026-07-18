import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Clock, Plus, Trash2, CheckCircle2, ChevronRight, Award } from 'lucide-react';

export default function ProductivityView() {
  const [activeSubTab, setActiveSubTab] = useState('planner'); // planner, assignments, reminders

  // Study Planner states
  const [plannerItems, setPlannerItems] = useState([]);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanDue, setNewPlanDue] = useState('');

  // Assignment states
  const [assignments, setAssignments] = useState([]);
  const [newAssTitle, setNewAssTitle] = useState('');
  const [newAssCourse, setNewAssCourse] = useState('');
  const [newAssDue, setNewAssDue] = useState('');
  const [newAssPriority, setNewAssPriority] = useState('Medium');
  const [newAssStatus, setNewAssStatus] = useState('Pending');
  const [newAssGrade, setNewAssGrade] = useState('');

  // Reminders states
  const [reminders, setReminders] = useState([]);
  const [newRemMsg, setNewRemMsg] = useState('');
  const [newRemTime, setNewRemTime] = useState('');

  useEffect(() => {
    fetchPlanner();
    fetchAssignments();
    fetchReminders();
  }, []);

  // ----------------------------------------------------
  // Fetch Functions
  // ----------------------------------------------------
  const fetchPlanner = async () => {
    try {
      const res = await fetch('/api/planner');
      const data = await res.json();
      setPlannerItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/assignments');
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReminders = async () => {
    try {
      const res = await fetch('/api/reminders');
      const data = await res.json();
      setReminders(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // Planner Actions
  // ----------------------------------------------------
  const addPlannerItem = async (e) => {
    e.preventDefault();
    if (!newPlanTitle.trim()) return;
    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newPlanTitle, due_date: newPlanDue || null })
      });
      if (res.ok) {
        setNewPlanTitle('');
        setNewPlanDue('');
        fetchPlanner();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const completePlannerItem = async (id) => {
    try {
      const res = await fetch(`/api/planner/${id}/complete`, { method: 'POST' });
      if (res.ok) fetchPlanner();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePlannerItem = async (id) => {
    try {
      const res = await fetch(`/api/planner/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPlanner();
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // Assignment Actions
  // ----------------------------------------------------
  const addAssignment = async (e) => {
    e.preventDefault();
    if (!newAssTitle.trim()) return;
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAssTitle,
          course: newAssCourse,
          due_date: newAssDue,
          status: newAssStatus,
          priority: newAssPriority,
          grade: newAssGrade
        })
      });
      if (res.ok) {
        setNewAssTitle('');
        setNewAssCourse('');
        setNewAssDue('');
        setNewAssGrade('');
        setNewAssStatus('Pending');
        setNewAssPriority('Medium');
        fetchAssignments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateAssignmentStatus = async (id, currentAss, nextStatus) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentAss, status: nextStatus })
      });
      if (res.ok) fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  const updateAssignmentGrade = async (id, currentAss, grade) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentAss, grade })
      });
      if (res.ok) fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAssignment = async (id) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // Reminder Actions
  // ----------------------------------------------------
  const addReminder = async (e) => {
    e.preventDefault();
    if (!newRemMsg.trim() || !newRemTime) return;
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newRemMsg, remind_at: newRemTime })
      });
      if (res.ok) {
        setNewRemMsg('');
        setNewRemTime('');
        fetchReminders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReminder = async (id, isCompleted) => {
    try {
      const res = await fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: isCompleted ? 1 : 0 })
      });
      if (res.ok) fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReminder = async (id) => {
    try {
      const res = await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
      if (res.ok) fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Sub Tabs Navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        <button 
          className={`btn ${activeSubTab === 'planner' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('planner')}
        >
          <CheckSquare size={16} /> Study Planner
        </button>
        <button 
          className={`btn ${activeSubTab === 'assignments' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('assignments')}
        >
          <Award size={16} /> Assignment Tracker
        </button>
        <button 
          className={`btn ${activeSubTab === 'reminders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('reminders')}
        >
          <Calendar size={16} /> Reminders
        </button>
      </div>

      {/* ----------------- SUB-TAB: STUDY PLANNER ----------------- */}
      {activeSubTab === 'planner' && (
        <div className="grid-cols-2">
          {/* Add task form */}
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Add Study Task</h3>
            <form onSubmit={addPlannerItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Task Description</label>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="e.g. Read Chapter 4 of Database System Concepts"
                  value={newPlanTitle}
                  onChange={e => setNewPlanTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  className="input-text"
                  value={newPlanDue}
                  onChange={e => setNewPlanDue(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">Add task to plan</button>
            </form>
          </div>

          {/* Planner List */}
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Your Tasks Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
              {plannerItems.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '14px' }}>No study plans created yet. Add above!</p>
              ) : (
                plannerItems.map(item => (
                  <div key={item.id} className={`planner-item-row ${item.completed ? 'completed' : ''}`}>
                    <div>
                      <div className="planner-title">{item.title}</div>
                      <div className="planner-due">
                        <Clock size={12} /> Due: {item.due_date ? item.due_date : 'No deadline'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!item.completed && (
                        <button 
                          className="btn-icon-only" 
                          style={{ color: 'var(--accent-green)', background: 'rgba(16, 185, 129, 0.1)' }}
                          onClick={() => completePlannerItem(item.id)}
                          title="Complete Task"
                        >
                          ✓
                        </button>
                      )}
                      <button 
                        className="btn-icon-only" 
                        style={{ color: 'var(--accent-red)', background: 'rgba(239, 68, 68, 0.1)' }}
                        onClick={() => deletePlannerItem(item.id)}
                        title="Delete Task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB: ASSIGNMENT TRACKER ----------------- */}
      {activeSubTab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Add Assignment Form Panel */}
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Register Academic Assignment</h3>
            <form onSubmit={addAssignment} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'end' }}>
              <div className="form-group" style={{ margin: '0' }}>
                <label>Assignment Title</label>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="e.g. Lab 3 Socket Programming" 
                  value={newAssTitle}
                  onChange={e => setNewAssTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ margin: '0' }}>
                <label>Course Name / Code</label>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="e.g. CS 302 Computer Networks" 
                  value={newAssCourse}
                  onChange={e => setNewAssCourse(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ margin: '0' }}>
                <label>Due Date</label>
                <input 
                  type="date" 
                  className="input-text" 
                  value={newAssDue}
                  onChange={e => setNewAssDue(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ margin: '0' }}>
                <label>Priority</label>
                <select className="select-input" value={newAssPriority} onChange={e => setNewAssPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: '0' }}>
                <label>Status</label>
                <select className="select-input" value={newAssStatus} onChange={e => setNewAssStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Graded">Graded</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: '0' }}>
                <label>Grade (optional)</label>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="e.g. A, 95%, 9/10" 
                  value={newAssGrade}
                  onChange={e => setNewAssGrade(e.target.value)}
                />
              </div>
              <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>Add Assignment</button>
              </div>
            </form>
          </div>

          {/* Kanban Board View */}
          <div className="kanban-board">
            {/* Columns */}
            {['Pending', 'Submitted', 'Graded'].map(status => {
              const list = assignments.filter(a => a.status === status);
              return (
                <div key={status} className="kanban-column">
                  <div className="kanban-col-header">
                    <h4>
                      {status === 'Pending' && <span style={{ width: '8px', height: '8px', background: 'var(--accent-red)', borderRadius: '50%' }}></span>}
                      {status === 'Submitted' && <span style={{ width: '8px', height: '8px', background: 'var(--accent-orange)', borderRadius: '50%' }}></span>}
                      {status === 'Graded' && <span style={{ width: '8px', height: '8px', background: 'var(--accent-green)', borderRadius: '50%' }}></span>}
                      {status}
                    </h4>
                    <span className="badge-count">{list.length}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: '1', maxHeight: '420px', paddingRight: '4px' }}>
                    {list.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>No items</p>
                    ) : (
                      list.map(ass => (
                        <div key={ass.id} className="assignment-card">
                          <div className="assignment-header">
                            <span className="course-tag">{ass.course || 'General'}</span>
                            <span className={`priority-tag ${ass.priority.toLowerCase()}`}>{ass.priority}</span>
                          </div>
                          <h5>{ass.title}</h5>
                          
                          {/* Grade slot for Graded ones */}
                          {status === 'Graded' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Grade:</span>
                              {ass.grade ? (
                                <span className="assignment-grade">{ass.grade}</span>
                              ) : (
                                <input 
                                  type="text" 
                                  placeholder="Set Grade" 
                                  className="input-text" 
                                  style={{ padding: '2px 6px', fontSize: '11px', width: '70px', height: '22px' }}
                                  onBlur={(e) => updateAssignmentGrade(ass.id, ass, e.target.value)}
                                  onKeyDown={(e) => { if (e.key === 'Enter') updateAssignmentGrade(ass.id, ass, e.target.value) }}
                                />
                              )}
                            </div>
                          )}

                          <div className="assignment-footer">
                            <span>📅 Due: {ass.due_date ? ass.due_date : 'No deadline'}</span>
                            <div className="assignment-actions">
                              {status === 'Pending' && (
                                <button className="btn-icon-only" style={{ width: '22px', height: '22px', borderRadius: '4px' }} onClick={() => updateAssignmentStatus(ass.id, ass, 'Submitted')} title="Mark Submitted">
                                  <ChevronRight size={12} />
                                </button>
                              )}
                              {status === 'Submitted' && (
                                <button className="btn-icon-only" style={{ width: '22px', height: '22px', borderRadius: '4px' }} onClick={() => updateAssignmentStatus(ass.id, ass, 'Graded')} title="Mark Graded">
                                  <ChevronRight size={12} />
                                </button>
                              )}
                              <button className="btn-icon-only" style={{ width: '22px', height: '22px', borderRadius: '4px', color: 'var(--accent-red)' }} onClick={() => deleteAssignment(ass.id)} title="Delete Assignment">
                                <Trash2 size={10} />
                              </button>
                            </div>
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
      )}

      {/* ----------------- SUB-TAB: REMINDERS ----------------- */}
      {activeSubTab === 'reminders' && (
        <div className="grid-cols-2">
          {/* Add Reminder Form */}
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Schedule a Reminder</h3>
            <form onSubmit={addReminder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Reminder Alert Message</label>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="e.g. Register for upcoming hackathon" 
                  value={newRemMsg}
                  onChange={e => setNewRemMsg(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reminder Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="input-text" 
                  value={newRemTime}
                  onChange={e => setNewRemTime(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Schedule Alert</button>
            </form>
          </div>

          {/* Scheduled Reminders List */}
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Active Alarms & Reminders</h3>
            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
              {reminders.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '14px' }}>No active alarms configured. Schedule one!</p>
              ) : (
                reminders.map(rem => (
                  <div key={rem.id} className="planner-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input 
                        type="checkbox" 
                        checked={Boolean(rem.completed)}
                        onChange={(e) => toggleReminder(rem.id, e.target.checked)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <div style={{ opacity: rem.completed ? 0.5 : 1 }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', textDecoration: rem.completed ? 'line-through' : 'none' }}>
                          {rem.message}
                        </span>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          📅 {new Date(rem.remind_at).toLocaleDateString()} {new Date(rem.remind_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <button className="btn-icon-only" style={{ color: 'var(--accent-red)', background: 'rgba(239, 68, 68, 0.1)' }} onClick={() => deleteReminder(rem.id)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
