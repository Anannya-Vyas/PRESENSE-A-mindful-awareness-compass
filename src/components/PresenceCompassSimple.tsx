import React, { useState, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
  quadrant: 'past' | 'future' | 'internal' | 'external' | 'center';
}

interface CheckIn {
  id: string;
  position: Position;
  timestamp: Date;
  nudge?: string;
}

const PresenceCompassSimple: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 0, y: 0, quadrant: 'center' });
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [currentNudge, setCurrentNudge] = useState('');
  const compassRef = useRef<HTMLDivElement>(null);

  const getQuadrant = (x: number, y: number): Position['quadrant'] => {
    const distance = Math.sqrt(x * x + y * y);
    if (distance < 30) return 'center';
    
    if (y < 0) return x > 0 ? 'future' : 'past';
    return x > 0 ? 'external' : 'internal';
  };

  const generateNudge = async (quadrant: Position['quadrant']): Promise<string> => {
    const nudges = {
      past: "The past has shaped you, but your breath is happening now.",
      future: "Tomorrow's plans can wait. Feel the weight of your feet on the ground.",
      internal: "Your thoughts are valid, but so is this exact moment.",
      external: "The world can wait. What do you notice right here, right now?",
      center: "You are present. Notice the stillness within."
    };
    
    return nudges[quadrant];
  };

  const handleCompassClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!compassRef.current || isAnimating) return;

    const rect = compassRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    const maxRadius = Math.min(rect.width, rect.height) / 2 - 20;
    const distance = Math.sqrt(x * x + y * y);
    
    const clampedX = distance > maxRadius ? (x / distance) * maxRadius : x;
    const clampedY = distance > maxRadius ? (y / distance) * maxRadius : y;
    
    const quadrant = getQuadrant(clampedX, clampedY);
    const newPosition = { x: clampedX, y: clampedY, quadrant };
    
    setCurrentPosition(newPosition);
    setIsAnimating(true);
    
    const nudge = await generateNudge(quadrant);
    setCurrentNudge(nudge);
    setShowNudge(true);
    
    const newCheckIn: CheckIn = {
      id: Date.now().toString(),
      position: newPosition,
      timestamp: new Date(),
      nudge
    };
    
    setCheckIns(prev => [newCheckIn, ...prev.slice(0, 11)]);
    
    setTimeout(() => {
      setIsAnimating(false);
      setShowNudge(false);
    }, 4000);
  };

  const getQuadrantColor = (quadrant: Position['quadrant']) => {
    const colors = {
      past: '#8B5CF6',
      future: '#3B82F6', 
      internal: '#10B981',
      external: '#F59E0B',
      center: '#6B7280'
    };
    return colors[quadrant];
  };

  const getQuadrantLabel = (quadrant: Position['quadrant']) => {
    const labels = {
      past: 'Past',
      future: 'Future',
      internal: 'Internal',
      external: 'External',
      center: 'Present'
    };
    return labels[quadrant];
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Compass Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Presense</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0.5rem 0' }}>Where is your mind right now?</p>
          </div>
          
          <div 
            ref={compassRef}
            onClick={handleCompassClick}
            style={{
              position: 'relative',
              width: '320px',
              height: '320px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: '50%',
              cursor: 'pointer',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Quadrant Labels */}
            <div style={{ position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)', color: '#3B82F6', fontWeight: '600' }}>Future</div>
            <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', color: '#8B5CF6', fontWeight: '600' }}>Past</div>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#10B981', fontWeight: '600' }}>Internal</div>
            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#F59E0B', fontWeight: '600' }}>External</div>
            
            {/* Center Circle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '500' }}>Present</span>
            </div>
            
            {/* Position Indicator */}
            {(currentPosition.x !== 0 || currentPosition.y !== 0) && (
              <div
                style={{
                  position: 'absolute',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: getQuadrantColor(currentPosition.quadrant),
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '2px solid white',
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${currentPosition.x}px), calc(-50% + ${currentPosition.y}px))`,
                  transition: 'all 0.3s ease'
                }}
              />
            )}
            
            {/* Click Instruction */}
            {(currentPosition.x === 0 && currentPosition.y === 0) && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>Click anywhere on the compass</p>
              </div>
            )}
          </div>
          
          {/* Current State Display */}
          {currentPosition.quadrant !== 'center' && (
            <div style={{ textAlign: 'center', gap: '0.5rem' }}>
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                backgroundColor: `${getQuadrantColor(currentPosition.quadrant)}20`,
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <span style={{ color: 'white', fontWeight: '500' }}>{getQuadrantLabel(currentPosition.quadrant)}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Insights Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Nudge Display */}
          {showNudge && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>Gentle Reminder</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontStyle: 'italic' }}>"{currentNudge}"</p>
            </div>
          )}
          
          {/* Recent Check-ins */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '1rem' }}>Recent Check-ins</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '16rem', overflowY: 'auto' }}>
              {checkIns.length === 0 ? (
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>No check-ins yet. Click on the compass to begin.</p>
              ) : (
                checkIns.map((checkIn) => (
                  <div key={checkIn.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: getQuadrantColor(checkIn.position.quadrant)
                    }} />
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{getQuadrantLabel(checkIn.position.quadrant)}</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                      {checkIn.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Instructions */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '0.75rem' }}>How to Use</h3>
            <ul style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', paddingLeft: '1rem', margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>Click anywhere on the compass to check in</li>
              <li style={{ marginBottom: '0.5rem' }}>The distance from center shows how far you've drifted</li>
              <li style={{ marginBottom: '0.5rem' }}>Each quadrant represents a different mental territory</li>
              <li>Receive gentle reminders to return to the present</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenceCompassSimple;
