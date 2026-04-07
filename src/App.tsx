import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import BreathingExercise from './components/BreathingExercise';
import MusicScreen from './components/MusicScreen';
import SettingsScreen from './components/SettingsScreen';
import BottomNav from './components/BottomNav';
import './styles/black-theme.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [breathingDuration, setBreathingDuration] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen soundEnabled={soundEnabled} />;
      case 'breathing':
        return <BreathingExercise savedDuration={breathingDuration} />;
      case 'music':
        return <MusicScreen />;
      case 'settings':
        return (
          <SettingsScreen
            breathingDuration={breathingDuration}
            onBreathingDurationChange={setBreathingDuration}
            soundEnabled={soundEnabled}
            onSoundToggle={() => setSoundEnabled(!soundEnabled)}
          />
        );
      default:
        return <HomeScreen soundEnabled={soundEnabled} />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="app-container">
      <div className="screen-container">
        {renderScreen()}
      </div>
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}

export default App;