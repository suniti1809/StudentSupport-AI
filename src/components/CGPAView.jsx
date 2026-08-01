import React, { useState } from 'react';
import { Award, Plus, Trash2, HelpCircle } from 'lucide-react';

export default function CGPAView() {
  const [gpa, setGpa] = useState('');
  const [credits, setCredits] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [cgpa, setCgpa] = useState(0);
  const [feedback, setFeedback] = useState('');

  const calculateCgpa = async (updatedSemesters) => {
    if (updatedSemesters.length === 0) {
      setCgpa(0);
      setFeedback('');
      return;
    }

    try {
      const res = await fetch('/api/cgpa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semesters: updatedSemesters })
      });
      const data = await res.json();
      const val = data.cgpa;
      setCgpa(val);

      if (val >= 9.0) {
        setFeedback("Outstanding performance! You are on the Dean's Honor Roll.");
      } else if (val >= 8.0) {
        setFeedback("Excellent job! You are maintaining a highly competitive CGPA.");
      } else if (val >= 7.0) {
        setFeedback("Good effort! Focus on your study plan to push towards an 8+.");
      } else {
        setFeedback("Keep striving! Try planning high-priority targets in the Study Planner.");
      }
    } catch (err) {
      console.error("Failed to calculate CGPA:", err);
    }
  };

  const handleAddSemester = (e) => {
    e.preventDefault();
    const gpaVal = parseFloat(gpa);
    const creditsVal = parseInt(credits);

    if (isNaN(gpaVal) || gpaVal < 0 || gpaVal > 10 || isNaN(creditsVal) || creditsVal <= 0) {
      alert("Please enter a valid GPA (0-10) and Credits (1-40).");
      return;
    }

    const updated = [...semesters, { gpa: gpaVal, credits: creditsVal }];
    setSemesters(updated);
    setGpa('');
    setCredits('');
    calculateCgpa(updated);
  };

  const handleDeleteSemester = (idx) => {
    const updated = semesters.filter((_, i) => i !== idx);
    setSemesters(updated);
    calculateCgpa(updated);
  };

  const clearData = () => {
    setSemesters([]);
    setCgpa(0);
    setFeedback('');
  };

  return (
    <div className="grid-cols-2">
      {/* Grades Input Card */}
      <div className="glass-card">
        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Semester SGPA Record</h3>
        <form onSubmit={handleAddSemester} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>Semester SGPA</label>
            <input 
              type="number" 
              className="input-text" 
              min="0" 
              max="10" 
              step="0.01" 
              placeholder="e.g. 8.75" 
              value={gpa}
              onChange={e => setGpa(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Semester Credits</label>
            <input 
              type="number" 
              className="input-text" 
              min="1" 
              max="40" 
              placeholder="e.g. 20" 
              value={credits}
              onChange={e => setCredits(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: '1' }}>Add Semester</button>
            <button type="button" className="btn btn-secondary" onClick={clearData}>Clear All</button>
          </div>
        </form>
      </div>

      {/* CGPA Summary Display */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>CGPA Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', marginBottom: '20px' }}>
            {semesters.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic' }}>No semesters added yet.</p>
            ) : (
              semesters.map((sem, idx) => (
                <div key={idx} className="sem-grid-row">
                  <strong>Semester {idx + 1}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Credits: {sem.credits}</span>
                  <span style={{ fontSize: '12px', color: 'var(--accent)' }}>SGPA: {sem.gpa.toFixed(2)}</span>
                  <button className="btn-icon-only" style={{ width: '22px', height: '22px', borderRadius: '4px', color: 'var(--accent-red)' }} onClick={() => handleDeleteSemester(idx)}>
                    <Trash2 size={10} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', textAlign: 'center' }}>
          <div className="gradient-text" style={{ fontSize: '48px', fontWeight: '800', fontFamily: 'var(--font-display)', margin: '10px 0' }}>
            {cgpa > 0 ? cgpa.toFixed(2) : '--'}
          </div>
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Cumulative CGPA
          </p>
          {feedback && (
            <div style={{ 
              marginTop: '12px', 
              fontSize: '13px', 
              color: cgpa >= 8.0 ? 'var(--accent-green)' : 'var(--text-secondary)',
              background: 'rgba(255,255,255,0.03)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)'
            }}>
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
