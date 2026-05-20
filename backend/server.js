const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend at /
app.use('/', express.static(path.join(__dirname, '../frontend')));

// Serve admin panel at /admin
app.use('/admin', express.static(path.join(__dirname, '../admin')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('\n🛰️  TrackFlow server running!');
  console.log('📍  User app:    http://localhost:' + PORT + '/');
  console.log('🔐  Admin panel: http://localhost:' + PORT + '/admin\n');
});
