export interface CheckIn {
  id: string;
  position: {
    x: number;
    y: number;
    quadrant: 'past' | 'future' | 'internal' | 'external' | 'center';
  };
  timestamp: Date;
  nudge?: string;
  reflection?: string;
}

interface UserStats {
  totalCheckIns: number;
  mostFrequentQuadrant: string;
  currentStreak: number;
  averageDistance: number;
  longestStreak: number;
  lastCheckIn: Date | null;
}

const STORAGE_KEYS = {
  CHECKINS: 'presence_checkins',
  STATS: 'presence_stats',
  PREFERENCES: 'presence_preferences'
};

export const storage = {
  // Check-ins storage
  saveCheckIns: (checkIns: CheckIn[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkIns));
    } catch (error) {
      console.warn('Failed to save check-ins:', error);
    }
  },

  loadCheckIns: (): CheckIn[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHECKINS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load check-ins:', error);
      return [];
    }
  },

  addCheckIn: (checkIn: CheckIn) => {
    const currentCheckIns = storage.loadCheckIns();
    const updatedCheckIns = [checkIn, ...currentCheckIns.slice(0, 99)]; // Keep last 100
    storage.saveCheckIns(updatedCheckIns);
    return updatedCheckIns;
  },

  clearCheckIns: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CHECKINS);
    } catch (error) {
      console.warn('Failed to clear check-ins:', error);
    }
  },

  // Stats storage
  saveStats: (stats: UserStats) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (error) {
      console.warn('Failed to save stats:', error);
    }
  },

  loadStats: (): UserStats => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATS);
      return stored ? JSON.parse(stored) : {
        totalCheckIns: 0,
        mostFrequentQuadrant: 'center',
        currentStreak: 0,
        averageDistance: 0,
        longestStreak: 0,
        lastCheckIn: null
      };
    } catch (error) {
      console.warn('Failed to load stats:', error);
      return {
        totalCheckIns: 0,
        mostFrequentQuadrant: 'center',
        currentStreak: 0,
        averageDistance: 0,
        longestStreak: 0,
        lastCheckIn: null
      };
    }
  },

  updateStats: (newCheckIn: CheckIn) => {
    const currentStats = storage.loadStats();
    const currentCheckIns = storage.loadCheckIns();
    
    // Calculate new stats
    const quadrantCounts = currentCheckIns.reduce((acc, checkIn) => {
      acc[checkIn.position.quadrant] = (acc[checkIn.position.quadrant] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequentQuadrant = Object.entries(quadrantCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'center';

    const totalDistance = currentCheckIns.reduce((sum, checkIn) => {
      return sum + Math.sqrt(checkIn.position.x * checkIn.position.x + checkIn.position.y * checkIn.position.y);
    }, 0);

    const averageDistance = currentCheckIns.length > 0 ? totalDistance / currentCheckIns.length : 0;

    // Update streak
    const now = new Date();
    const lastCheckInDate = currentStats.lastCheckIn;
    let currentStreak = currentStats.currentStreak;
    
    if (lastCheckInDate) {
      const hoursSinceLastCheckIn = (now.getTime() - lastCheckInDate.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastCheckIn <= 24) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    const newStats: UserStats = {
      totalCheckIns: currentCheckIns.length + 1,
      mostFrequentQuadrant,
      currentStreak,
      averageDistance: Math.round(averageDistance),
      longestStreak: Math.max(currentStats.longestStreak, currentStreak),
      lastCheckIn: now
    };

    storage.saveStats(newStats);
    return newStats;
  },

  // Preferences storage
  savePreferences: (preferences: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  },

  loadPreferences: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return stored ? JSON.parse(stored) : {
        soundEnabled: true,
        darkMode: true,
        breathingDuration: 4,
        nudgeDuration: 15
      };
    } catch (error) {
      console.warn('Failed to load preferences:', error);
      return {
        soundEnabled: true,
        darkMode: true,
        breathingDuration: 4,
        nudgeDuration: 15
      };
    }
  }
};
