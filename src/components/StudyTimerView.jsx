import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RefreshCw, Volume2, Award, Clock } from 'lucide-react';

export default function StudyTimerView() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Focus'); // Focus, Short Break, Long Break
  const [taskTitle, setTaskTitle] = useState('');
  const [category, setCategory] = useState('Coding');
  const [sessions, setSessions] = useState([]);
  
  const timerId = useRef(null);
  const initialDuration = useRef(25 * 60);

  useEffect(() => {
    fetchSessions();
    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (isActive) {
      timerId.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      clearInterval(timerId.current);
    }
    return () => clearInterval(timerId.current);
  }, [isActive, minutes, seconds]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/timer/sessions');
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTimerComplete = async () => {
    setIsActive(false);
    playCompletionSound();
    
    // Log session to backend
    try {
      const durationSeconds = initialDuration.current;
      await fetch('/api/timer/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_title: taskTitle.trim() || `${phase} Session`,
          duration_seconds: durationSeconds,
          category: category
        })
      });
      setTaskTitle('');
      fetchSessions();
    } catch (err) {
      console.error("Failed to log session:", err);
    }

    alert(`${phase} Session Finished! Good job.`);
    
    // Auto-swap phases
    if (phase === 'Focus') {
      setPhase('Short Break');
      setMinutes(5);
      setSeconds(0);
      initialDuration.current = 5 * 60;
    } else {
      setPhase('Focus');
      setMinutes(25);
      setSeconds(0);
      initialDuration.current = 25 * 60;
    }
  };

  const playCompletionSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      
      // Synthesize a friendly double-beep success chime
      const now = ctx.currentTime;
      
      const playBeep = (time, freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.3);
      };

      playBeep(now, 659.25); // E5
      playBeep(now + 0.15, 880.00); // A5
    } catch (err) {
      console.error(err);
    }
  };

  const startTimer = () => {
    initialDuration.current = minutes * 60 + seconds;
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = (newMins = 25, label = 'Focus') => {
    setIsActive(false);
    setPhase(label);
    setMinutes(newMins);
    setSeconds(0);
    initialDuration.current = newMins * 60;
  };

  // SVG Progress Ring calculations
  const totalSecs = initialDuration.current;
  const currentSecs = minutes * 60 + seconds;
  const percentage = totalSecs > 0 ? (currentSecs / totalSecs) : 1;
  const strokeDashoffset = 754 - (percentage * 754);

  return (
    <div className="grid-cols-2">
      {/* Visual countdown panel */}
      <div className="glass-card timer-radial-container">
        <h3>Improved Study Focus Timer</h3>
        
        <div className={`timer-circle ${isActive ? 'active' : ''}`}>
          {/* SVG Progress Ring */}
          <svg className="timer-svg" width="266" height="266">
            <circle 
              className="timer-svg-circle" 
              cx="133" 
              cy="133" 
              r="120"
              style={{ strokeDashoffset: strokeDashoffset }}
            />
          </svg>

          <span className="timer-digits">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className="timer-phase">{phase} Mode</span>
        </div>

        {/* Phase presets & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="timer-presets" style={{ justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => resetTimer(25, 'Focus')}>Focus (25m)</button>
            <button className="btn btn-secondary" onClick={() => resetTimer(5, 'Short Break')}>Short Break (5m)</button>
            <button className="btn btn-secondary" onClick={() => resetTimer(15, 'Long Break')}>Long Break (15m)</button>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {isActive ? (
              <button className="btn btn-danger" onClick={stopTimer} style={{ flex: 1 }}>
                <Square size={16} /> Stop Timer
              </button>
            ) : (
              <button className="btn btn-primary" onClick={startTimer} style={{ flex: 1 }}>
                <Play size={16} /> Start Timer
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => resetTimer(25, 'Focus')} style={{ width: '44px', padding: '0' }}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Configuration and history session logging */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Session Log Setup</h3>
          
          <div className="form-group">
            <label>What task are you working on? (Optional)</label>
            <input 
              type="text" 
              className="input-text" 
              placeholder="e.g. Preparing Operating Systems assignment" 
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Session Category</label>
            <select className="select-input" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="Coding">Coding & Development</option>
              <option value="Reading">Reading & Research</option>
              <option value="Writing">Writing & Outlines</option>
              <option value="Review">Revision & Quiz prep</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: '0' }}>
            <label>Set Custom Duration (Minutes)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="number" 
                className="input-text" 
                min="1" 
                max="180" 
                value={minutes}
                onChange={e => {
                  const m = parseInt(e.target.value) || 1;
                  setMinutes(m);
                  setSeconds(0);
                  initialDuration.current = m * 60;
                }}
              />
              <button className="btn btn-secondary" style={{ padding: '0 16px', whiteSpace: 'nowrap' }}>Set</button>
            </div>
          </div>
        </div>

        {/* Sessions History Logs */}
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} className="gradient-text" /> Focus Sessions Logged
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            {sessions.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic' }}>No completed study sessions logged yet.</p>
            ) : (
              sessions.map(s => (
                <div key={s.id} className="planner-item-row" style={{ padding: '10px 14px' }}>
                  <div>
                    <strong style={{ fontSize: '13px' }}>{s.task_title}</strong>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      🏷️ {s.category}  |  🕒 {Math.round(s.duration_seconds / 60)} minutes
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {new Date(s.logged_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
