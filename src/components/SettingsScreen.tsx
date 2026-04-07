import React from 'react';

interface SettingsScreenProps {
  breathingDuration: number;
  onBreathingDurationChange: (duration: number) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  breathingDuration,
  onBreathingDurationChange,
  soundEnabled,
  onSoundToggle,
}) => {
  return (
    <div className="settings-screen">
      <h1 className="screen-title">Settings</h1>

      <div className="settings-section">
        <h3>Breathing Exercise</h3>
        <div className="setting-item">
          <label>Default Duration (minutes)</label>
          <div className="duration-buttons">
            {[1, 2, 3, 5, 10, 15, 20].map(d => (
              <button
                key={d}
                className={`duration-option ${breathingDuration === d ? 'active' : ''}`}
                onClick={() => onBreathingDurationChange(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Sound</h3>
        <div className="setting-item">
          <label>Sound Effects</label>
          <button 
            className={`toggle-btn ${soundEnabled ? 'on' : 'off'}`}
            onClick={onSoundToggle}
          >
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3>About</h3>
        <div className="about-info">
          <p><strong>Presense</strong> &nbsp;v1.0.0</p>
          <p className="about-desc">
            A mindful awareness compass that helps you notice where your mind is — past, future, or present — and gently return to now.
          </p>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
            Created by <strong>Anannya Vyas</strong>
          </p>
          <a
            href="https://github.com/Anannya-Vyas/PRESENSE-A-mindful-awareness-compass"
            target="_blank"
            rel="noopener noreferrer"
            className="about-github"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Contribute on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;