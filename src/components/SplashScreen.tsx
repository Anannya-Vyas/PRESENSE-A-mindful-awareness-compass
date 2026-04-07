import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'logo' | 'title' | 'tagline' | 'done'>('logo');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + 2;
      });
    }, 60);

    const t1 = setTimeout(() => setPhase('title'), 600);
    const t2 = setTimeout(() => setPhase('tagline'), 1200);
    const t3 = setTimeout(() => setPhase('done'), 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="splash-root">
      {/* Glitter particles */}
      <div className="glitter-field">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="glitter-dot"
            style={{
              left: `${(i * 17.3) % 100}%`,
              top: `${(i * 13.7) % 100}%`,
              animationDelay: `${(i * 0.11) % 3}s`,
              animationDuration: `${2 + (i % 4)}s`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
            }}
          />
        ))}
      </div>

      {/* Radial glow backdrop */}
      <div className="splash-glow-bg" />

      <div className="splash-center">
        {/* 3D Logo */}
        <div className={`splash-logo-wrap ${phase !== 'logo' ? 'logo-visible' : ''}`}>
          <div className="splash-ring splash-ring-1" />
          <div className="splash-ring splash-ring-2" />
          <div className="splash-ring splash-ring-3" />
          <div className="splash-core">
            <div className="splash-core-inner">
              <span className="splash-core-letter">P</span>
            </div>
          </div>
          <div className="splash-needle splash-needle-n" />
          <div className="splash-needle splash-needle-s" />
          <div className="splash-needle splash-needle-e" />
          <div className="splash-needle splash-needle-w" />
        </div>

        {/* App name */}
        <div className={`splash-title-block ${phase === 'title' || phase === 'tagline' || phase === 'done' ? 'visible' : ''}`}>
          <h1 className="splash-app-name">PRESENSE</h1>
          <p className="splash-tagline">Your mindful awareness companion</p>
          <p className="splash-purpose">
            Discover where your mind wanders — past, future, or present — and gently return to now.
          </p>
        </div>

        {/* Progress bar */}
        <div className={`splash-progress-wrap ${phase === 'tagline' || phase === 'done' ? 'visible' : ''}`}>
          <div className="splash-progress-track">
            <div className="splash-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Creator info */}
        <div className={`splash-creator ${phase === 'done' ? 'visible' : ''}`}>
          <p className="splash-creator-text">
            Crafted by <span className="splash-creator-name">Anannya Vyas</span>
          </p>
          <a
            href="https://github.com/Anannya-Vyas/PRESENSE-A-mindful-awareness-compass"
            target="_blank"
            rel="noopener noreferrer"
            className="splash-github-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Contribute on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
