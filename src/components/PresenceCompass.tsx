import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const PresenceCompass: React.FC = () => {
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
      past: 'bg-presence-past',
      future: 'bg-presence-future',
      internal: 'bg-presence-internal',
      external: 'bg-presence-external',
      center: 'bg-presence-center'
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
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Compass Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">Presense</h1>
            <p className="text-white/80">Where is your mind right now?</p>
          </div>
          
          <div 
            ref={compassRef}
            onClick={handleCompassClick}
            className="relative w-80 h-80 bg-white/10 backdrop-blur-md rounded-full cursor-pointer border-2 border-white/20 hover:border-white/30 transition-all duration-300 shadow-2xl"
          >
            {/* Quadrant Labels */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-presence-future font-semibold">Future</div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-presence-past font-semibold">Past</div>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-presence-internal font-semibold">Internal</div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-presence-external font-semibold">External</div>
            
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 rounded-full border-2 border-white/40 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Present</span>
            </div>
            
            {/* Position Indicator */}
            <AnimatePresence>
              {currentPosition.x !== 0 || currentPosition.y !== 0 ? (
                <motion.div
                  key="position"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`absolute w-6 h-6 rounded-full ${getQuadrantColor(currentPosition.quadrant)} shadow-lg border-2 border-white`}
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${currentPosition.x}px), calc(-50% + ${currentPosition.y}px))`,
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 rounded-full ${getQuadrantColor(currentPosition.quadrant)} opacity-30`}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
            
            {/* Click Instruction */}
            {(currentPosition.x === 0 && currentPosition.y === 0) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/60 text-sm animate-pulse-gentle">Click anywhere on the compass</p>
              </div>
            )}
          </div>
          
          {/* Current State Display */}
          <AnimatePresence>
            {currentPosition.quadrant !== 'center' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-2"
              >
                <div className={`inline-block px-4 py-2 rounded-full ${getQuadrantColor(currentPosition.quadrant)} bg-opacity-20 border border-white/30`}>
                  <span className="text-white font-medium">{getQuadrantLabel(currentPosition.quadrant)}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Insights Section */}
        <div className="space-y-6">
          {/* Nudge Display */}
          <AnimatePresence>
            {showNudge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-white font-semibold mb-2">Gentle Reminder</h3>
                <p className="text-white/90 italic">"{currentNudge}"</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Recent Check-ins */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">Recent Check-ins</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {checkIns.length === 0 ? (
                <p className="text-white/60 text-sm">No check-ins yet. Click on the compass to begin.</p>
              ) : (
                checkIns.map((checkIn) => (
                  <motion.div
                    key={checkIn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-3 text-sm"
                  >
                    <div className={`w-3 h-3 rounded-full ${getQuadrantColor(checkIn.position.quadrant)}`} />
                    <span className="text-white/80">{getQuadrantLabel(checkIn.position.quadrant)}</span>
                    <span className="text-white/50 text-xs">
                      {checkIn.timestamp.toLocaleTimeString()}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-3">How to Use</h3>
            <ul className="text-white/80 text-sm space-y-2">
              <li>• Click anywhere on the compass to check in</li>
              <li>• The distance from center shows how far you've drifted</li>
              <li>• Each quadrant represents a different mental territory</li>
              <li>• Receive gentle reminders to return to the present</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenceCompass;
