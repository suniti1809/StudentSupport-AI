import React, { useEffect, useState, useRef } from 'react';

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('idle'); // idle → particles → title → tagline → exit
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  /* ─── Particle canvas ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn particles
    const count = 120;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.7 + 0.2,
      hue: 200 + Math.random() * 60,  // blue–purple range
    }));

    let running = true;
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.alpha})`;
        ctx.fill();

        // Draw connecting lines
        particlesRef.current.forEach(p2 => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 70%, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* ─── Animation sequence ─── */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('particles'), 100);
    const t2 = setTimeout(() => setPhase('title'),     600);
    const t3 = setTimeout(() => setPhase('tagline'),  1400);
    const t4 = setTimeout(() => setPhase('exit'),     3000);
    const t5 = setTimeout(() => onFinish(),           3700);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div style={styles.wrapper}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Radial glow pulse */}
      <div style={{
        ...styles.glowOrb,
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.7s ease',
      }} />

      {/* Brand content */}
      <div style={{
        ...styles.content,
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'scale(1.08)' : 'scale(1)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>

        {/* Icon ring */}
        <div style={{
          ...styles.iconRing,
          opacity: phase === 'idle' ? 0 : 1,
          transform: phase === 'idle' ? 'scale(0.3) rotate(-180deg)' : 'scale(1) rotate(0deg)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="url(#g1)" strokeWidth="2" />
            <path d="M14 24c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10" stroke="url(#g2)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="24" cy="24" r="4" fill="url(#g1)" />
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8"/>
                <stop offset="1" stopColor="#38bdf8"/>
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a78bfa"/>
                <stop offset="1" stopColor="#38bdf8"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand name — letter-by-letter reveal */}
        <div style={{
          ...styles.brandWrap,
          opacity: phase === 'idle' || phase === 'particles' ? 0 : 1,
          transform: phase === 'idle' || phase === 'particles'
            ? 'translateY(40px)'
            : 'translateY(0)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          {'StudentSupport AI'.split('').map((char, i) => (
            <span
              key={i}
              style={{
                ...styles.brandChar,
                animationDelay: `${i * 40}ms`,
                color: i >= 14 ? 'transparent' : 'white',
                backgroundClip: i >= 14 ? 'text' : 'unset',
                WebkitBackgroundClip: i >= 14 ? 'text' : 'unset',
                backgroundImage: i >= 14
                  ? 'linear-gradient(135deg, #818cf8, #38bdf8)'
                  : 'none',
                opacity: phase === 'title' || phase === 'tagline' ? 1 : 0,
                transform: phase === 'title' || phase === 'tagline'
                  ? 'translateY(0)'
                  : 'translateY(20px)',
                transition: `opacity 0.4s ease ${i * 40}ms, transform 0.4s ease ${i * 40}ms`,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>

        {/* Divider line */}
        <div style={{
          ...styles.divider,
          width: phase === 'tagline' ? '260px' : '0px',
          transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s',
        }} />

        {/* Tagline */}
        <p style={{
          ...styles.tagline,
          opacity: phase === 'tagline' ? 1 : 0,
          transform: phase === 'tagline' ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
        }}>
          Your AI-Powered Academic Companion
        </p>

        {/* Loading dots */}
        <div style={{
          ...styles.dotsRow,
          opacity: phase === 'tagline' ? 1 : 0,
          transition: 'opacity 0.4s ease 0.6s',
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              ...styles.dot,
              animationDelay: `${i * 200}ms`,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1.2); opacity: 1;   }
        }
        @keyframes orbPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.18; }
          50%       { transform: translate(-50%, -50%) scale(1.15); opacity: 0.26; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'radial-gradient(ellipse at 50% 40%, #0f172a 0%, #020617 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  glowOrb: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(129,140,248,0.22) 0%, transparent 70%)',
    animation: 'orbPulse 2.4s ease-in-out infinite',
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '18px',
  },
  iconRing: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: 'rgba(129,140,248,0.12)',
    border: '1.5px solid rgba(129,140,248,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 0 40px rgba(129,140,248,0.3), inset 0 0 20px rgba(129,140,248,0.08)',
  },
  brandWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0px',
  },
  brandChar: {
    display: 'inline-block',
    fontSize: 'clamp(36px, 6vw, 64px)',
    fontWeight: '800',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    letterSpacing: '-0.5px',
    lineHeight: 1.1,
    textShadow: '0 0 40px rgba(129,140,248,0.5)',
  },
  divider: {
    height: '1.5px',
    background: 'linear-gradient(90deg, transparent, rgba(129,140,248,0.7), rgba(56,189,248,0.7), transparent)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  tagline: {
    fontSize: '15px',
    color: 'rgba(148,163,184,0.9)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    fontWeight: '400',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    margin: 0,
  },
  dotsRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '6px',
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #818cf8, #38bdf8)',
    animation: 'dotPulse 1.2s ease-in-out infinite',
    display: 'inline-block',
  },
};
