import React, { useState, useRef } from 'react';
import { generateMindfulNudge } from '../services/aiService';

type Quadrant = 'past' | 'future' | 'internal' | 'external' | 'center';

interface Position {
  x: number;
  y: number;
  quadrant: Quadrant;
}

const quadrantInfo: Record<Quadrant, { label: string; desc: string; color: string }> = {
  past:     { label: 'Past',          desc: 'Ruminating on what was',        color: '#00FFD1' },
  future:   { label: 'Future',        desc: 'Anxious about what might be',   color: '#00FFD1' },
  internal: { label: 'Internal',      desc: 'Lost in thoughts & feelings',   color: '#00FFD1' },
  external: { label: 'External',      desc: 'Distracted by the world',       color: '#00FFD1' },
  center:   { label: 'Present Moment',desc: 'Fully here, fully aware',       color: '#00FFD1' },
};

const fallbackNudges: Record<Quadrant, string> = {
  past:     'The past has shaped you, but your breath is happening right now.',
  future:   "Tomorrow's plans can wait. Feel the weight of your feet on the ground.",
  internal: 'Your thoughts are valid, but so is this exact moment.',
  external: 'The world can wait. What do you notice right here, right now?',
  center:   'You are present. Notice the stillness within.',
};

const HomeScreen: React.FC<{ soundEnabled: boolean }> = ({ soundEnabled }) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, quadrant: 'center' });
  const [isLoading, setIsLoading] = useState(false);
  const [nudge, setNudge] = useState('');
  const [reflection, setReflection] = useState('');
  const [showNudge, setShowNudge] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);
  const nudgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getQuadrant = (x: number, y: number): Quadrant => {
    if (Math.sqrt(x * x + y * y) < 40) return 'center';
    if (y < 0) return x > 0 ? 'future' : 'past';
    return x > 0 ? 'external' : 'internal';
  };

  const playTone = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (_) {}
  };

  const handleCompassClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!compassRef.current || isLoading) return;
    if (soundEnabled) playTone();

    const rect = compassRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rawX = e.clientX - rect.left - cx;
    const rawY = e.clientY - rect.top - cy;
    const maxR = Math.min(rect.width, rect.height) / 2 - 30;
    const dist = Math.sqrt(rawX * rawX + rawY * rawY);
    const x = dist > maxR ? (rawX / dist) * maxR : rawX;
    const y = dist > maxR ? (rawY / dist) * maxR : rawY;
    const quadrant = getQuadrant(x, y);

    setPosition({ x, y, quadrant });
    setIsLoading(true);
    setShowNudge(false);

    try {
      const res = await generateMindfulNudge(quadrant, Math.min(dist, 150), []);
      setNudge(res.nudge);
      setReflection(res.reflection);
    } catch {
      setNudge(fallbackNudges[quadrant]);
      setReflection('This moment of awareness is a gift you gave yourself.');
    } finally {
      setIsLoading(false);
      setShowNudge(true);
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
      nudgeTimerRef.current = setTimeout(() => setShowNudge(false), 15000);
    }
  };

  const q = quadrantInfo[position.quadrant];

  return (
    <div className="home-screen">
      <div className="home-header">
        <h1 className="home-title">PRESENSE</h1>
        <p className="home-subtitle">A mindful awareness compass</p>
        <p className="home-desc">
          Tap the compass to map where your mind is right now — past, future, or present.
          Get a gentle nudge back to this moment.
        </p>
      </div>

      <div className="compass-wrapper">
        <div
          ref={compassRef}
          className={`compass-3d${isLoading ? ' loading' : ''}`}
          onClick={handleCompassClick}
          role="button"
          aria-label="Mindfulness compass — tap to check in"
        >
          {/* Outer decorative rings */}
          <div className="c-ring c-ring-outer" />
          <div className="c-ring c-ring-mid" />

          {/* Tick marks */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="c-tick"
              style={{ transform: `rotate(${i * 30}deg)` }}
            />
          ))}

          {/* Quadrant labels */}
          <span className="c-label c-label-top">FUTURE</span>
          <span className="c-label c-label-bottom">PAST</span>
          <span className="c-label c-label-left">INTERNAL</span>
          <span className="c-label c-label-right">EXTERNAL</span>

          {/* Divider lines */}
          <div className="c-divider c-divider-h" />
          <div className="c-divider c-divider-v" />

          {/* Center */}
          <div className="c-center">
            <div className="c-center-glow" />
            <span className="c-center-text">NOW</span>
          </div>

          {/* Position dot */}
          {(position.x !== 0 || position.y !== 0) && (
            <div
              className="c-dot"
              style={{
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                background: q.color,
                boxShadow: `0 0 20px ${q.color}`,
              }}
            >
              <div className="c-dot-ring" style={{ borderColor: q.color }} />
            </div>
          )}

          {/* Idle hint */}
          {position.x === 0 && position.y === 0 && !isLoading && (
            <div className="c-hint">
              <div className="c-hint-pulse" />
              <span>Tap to check in</span>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="c-loading">
              <div className="c-spinner" />
            </div>
          )}
        </div>
      </div>

      {/* Quadrant status */}
      <div className="quadrant-badge" style={{ borderColor: q.color, color: q.color }}>
        <span className="qb-dot" style={{ background: q.color }} />
        <span className="qb-label">{q.label}</span>
        <span className="qb-desc">{q.desc}</span>
      </div>

      {/* Nudge card */}
      {showNudge && (
        <div className="nudge-card">
          <div className="nudge-icon" style={{ color: q.color }}>✦</div>
          <p className="nudge-text">"{nudge}"</p>
          {reflection && (
            <p className="nudge-reflection">{reflection}</p>
          )}
          <button className="nudge-dismiss" onClick={() => setShowNudge(false)}>dismiss</button>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
