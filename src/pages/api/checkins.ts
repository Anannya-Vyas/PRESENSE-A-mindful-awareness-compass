// Simple API route for check-ins
// This handles basic CRUD operations for presence check-ins

let checkIns: any[] = []

export default async function handler(
  req: any,
  res: any
) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    return res.status(200).json(checkIns)
  }

  if (req.method === 'POST') {
    try {
      const checkIn = req.body
      
      // Validate required fields
      if (!checkIn.positionX || !checkIn.positionY || !checkIn.quadrant) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const newCheckIn = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...checkIn,
      }

      checkIns.unshift(newCheckIn)
      
      return res.status(201).json(newCheckIn)
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'DELETE') {
    checkIns = []
    return res.status(200).json({ message: 'Check-ins cleared' })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
