import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingExerciseProps {
  savedDuration?: number;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ savedDuration = 5 }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [duration, setDuration] = useState(savedDuration);
  const [timeLeft, setTimeLeft] = useState(savedDuration * 60);
  const [breathCount, setBreathCount] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState('4-4-4-4');
  
  const intervalRef = useRef<number | null>(null);
  const phaseTimeRef = useRef(0);

  const patterns: Record<string, { inhale: number; hold: number; exhale: number; rest: number }> = {
    '4-4-4-4': { inhale: 4, hold: 4, exhale: 4, rest: 4 },
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, rest: 0 },
    '5-5-5-5': { inhale: 5, hold: 5, exhale: 5, rest: 5 },
    '4-0-4-0': { inhale: 4, hold: 0, exhale: 4, rest: 0 },
    '6-0-6-0': { inhale: 6, hold: 0, exhale: 6, rest: 0 },
  };

  const currentPattern = patterns[selectedPattern];
  const totalCycleTime = currentPattern.inhale + currentPattern.hold + currentPattern.exhale + currentPattern.rest;

  const updatePhase = useCallback(() => {
    const cyclePosition = phaseTimeRef.current % totalCycleTime;
    
    let newPhase: typeof phase = 'inhale';
    if (currentPattern.rest === 0 && cyclePosition >= currentPattern.inhale + currentPattern.hold + currentPattern.exhale) {
      newPhase = 'exhale';
    } else if (cyclePosition < currentPattern.inhale) {
      newPhase = 'inhale';
    } else if (cyclePosition < currentPattern.inhale + currentPattern.hold) {
      newPhase = 'hold';
    } else if (cyclePosition < currentPattern.inhale + currentPattern.hold + currentPattern.exhale) {
      newPhase = 'exhale';
    } else {
      newPhase = 'rest';
    }
    
    setPhase(prevPhase => {
      if (newPhase !== prevPhase) {
        if (newPhase === 'inhale') {
          setBreathCount(c => c + 1);
        }
        return newPhase;
      }
      return prevPhase;
    });
  }, [currentPattern, totalCycleTime]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        phaseTimeRef.current += 1;
        
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
        
        updatePhase();
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, timeLeft, updatePhase]);

  const handleToggle = () => {
    if (isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };
  
  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    phaseTimeRef.current = 0;
    setTimeLeft(duration * 60);
    setBreathCount(0);
    setPhase('inhale');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'rest': return 'Rest';
    }
  };

  const getBreathScale = () => {
    switch (phase) {
      case 'inhale': 
      case 'hold': 
        return 1;
      case 'exhale': 
      case 'rest': 
        return 0.4;
    }
  };

  const durations = [1, 2, 3, 5, 10, 15, 20, 30];

  return (
    <div className="breathing-screen">
      <h1 className="screen-title">Breathing Exercise</h1>
      
      <div className="breathing-content">
        <div className="breathing-circle-container">
          <div 
            className={`breathing-circle ${phase}`}
            style={{ transform: `scale(${getBreathScale()})` }}
          >
            <span className="breathing-phase">{getPhaseText()}</span>
          </div>
        </div>

        <div className="breathing-stats">
          <div className="stat">
            <span className="stat-label">Time Remaining</span>
            <span className="stat-value">{formatTime(timeLeft)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Breaths</span>
            <span className="stat-value">{breathCount}</span>
          </div>
        </div>

        <div className="breathing-controls">
          <button onClick={handleToggle} className="breathing-btn primary">
            {isActive ? <Pause size={24} /> : <Play size={24} />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button onClick={handleReset} className="breathing-btn secondary">
            <RotateCcw size={20} />
            Reset
          </button>
        </div>

        <div className="duration-selector">
          <label>Duration (minutes)</label>
          <div className="duration-options">
            {durations.map(d => (
              <button
                key={d}
                className={`duration-btn ${duration === d ? 'active' : ''}`}
                onClick={() => { setDuration(d); setTimeLeft(d * 60); }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="pattern-selector">
          <label>Breathing Pattern</label>
          <div className="pattern-options">
            {Object.keys(patterns).map(pattern => (
              <button
                key={pattern}
                className={`pattern-btn ${selectedPattern === pattern ? 'active' : ''}`}
                onClick={() => {
                  setSelectedPattern(pattern);
                  phaseTimeRef.current = 0;
                  setPhase('inhale');
                }}
              >
                {pattern}
              </button>
            ))}
          </div>
          <p className="pattern-desc">
            {selectedPattern === '4-7-8' && 'Relaxing pattern - great for sleep'}
            {selectedPattern === '4-4-4-4' && 'Balanced box breathing'}
            {selectedPattern === '5-5-5-5' && 'Extended box breathing'}
            {selectedPattern === '4-0-4-0' && 'Simple in-out breathing'}
            {selectedPattern === '6-0-6-0' && 'Extended simple breathing'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;