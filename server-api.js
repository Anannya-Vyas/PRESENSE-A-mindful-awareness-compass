const http = require('http');

// In-memory storage for check-ins
let checkIns = [];

const server = http.createServer((req, res) => {
  // Enable CORS for all routes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const path = parsedUrl.pathname;

  if (path === '/api/checkins') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(checkIns));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const checkIn = JSON.parse(body);

          const newCheckIn = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...checkIn,
          };

          checkIns.unshift(newCheckIn);

          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newCheckIn));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      });
      return;
    }

    if (req.method === 'DELETE') {
      checkIns = [];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Check-ins cleared' }));
      return;
    }
  }

  // 404 for unknown routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🌐 API ready at http://localhost:${PORT}`);
  console.log('  GET /api/checkins - Get all check-ins');
  console.log('  POST /api/checkins - Create new check-in');
  console.log('  DELETE /api/checkins - Clear all check-ins');
});
