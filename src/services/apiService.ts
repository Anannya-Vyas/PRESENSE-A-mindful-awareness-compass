import { CheckIn } from '../utils/storage'

// Simple API service for database operations
// This will replace the complex Prisma service temporarily

export const apiService = {
  // Simple check-in storage for now
  async saveCheckIn(checkIn: CheckIn) {
    try {
      const response = await fetch('http://localhost:3001/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkIn),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save check-in')
      }
      
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  async getCheckIns() {
    try {
      const response = await fetch('http://localhost:3001/api/checkins')
      
      if (!response.ok) {
        throw new Error('Failed to fetch check-ins')
      }
      
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      return []
    }
  },

  async clearCheckIns() {
    try {
      const response = await fetch('http://localhost:3001/api/checkins', {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to clear check-ins')
      }
      
      return true
    } catch (error) {
      console.error('API Error:', error)
      return false
    }
  },

  // Get user stats
  async getStats() {
    try {
      const response = await fetch('http://localhost:3001/api/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      return {
        totalCheckIns: 0,
        mostFrequentQuadrant: 'center',
        currentStreak: 0,
        longestStreak: 0,
        averageDistance: 0,
      }
    }
  },
}
