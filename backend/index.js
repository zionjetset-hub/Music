const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./music.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Songs table
  db.run(`CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    duration INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    genre TEXT,
    release_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Playlists table
  db.run(`CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Playlist songs junction table
  db.run(`CREATE TABLE IF NOT EXISTS playlist_songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playlist_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES playlists (id),
    FOREIGN KEY (song_id) REFERENCES songs (id)
  )`);

  // User favorites
  db.run(`CREATE TABLE IF NOT EXISTS user_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (song_id) REFERENCES songs (id),
    UNIQUE(user_id, song_id)
  )`);
});

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Music API is running' });
});

// Get all songs
app.get('/api/songs', (req, res) => {
  const { page = 1, limit = 20, genre, search } = req.query;
  const offset = (page - 1) * limit;
  
  let query = 'SELECT * FROM songs WHERE 1=1';
  let params = [];
  
  if (genre) {
    query += ' AND genre = ?';
    params.push(genre);
  }
  
  if (search) {
    query += ' AND (title LIKE ? OR artist LIKE ? OR album LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get song by ID
app.get('/api/songs/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM songs WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Song not found' });
      return;
    }
    res.json(row);
  });
});

// Get genres
app.get('/api/genres', (req, res) => {
  db.all('SELECT DISTINCT genre FROM songs WHERE genre IS NOT NULL ORDER BY genre', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => row.genre));
  });
});

// User registration
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    res.status(400).json({ error: 'Username, email, and password are required' });
    return;
  }
  
  // Simple password hashing (in production, use bcrypt)
  const password_hash = Buffer.from(password).toString('base64');
  
  db.run('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', 
    [username, email, password_hash], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        res.status(409).json({ error: 'Username or email already exists' });
        return;
      }
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId: this.lastID 
    });
  });
});

// User login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  
  const password_hash = Buffer.from(password).toString('base64');
  
  db.get('SELECT * FROM users WHERE email = ? AND password_hash = ?', 
    [email, password_hash], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    res.json({ 
      message: 'Login successful',
      user: {
        id: row.id,
        username: row.username,
        email: row.email
      }
    });
  });
});

// Get user playlists
app.get('/api/users/:userId/playlists', (req, res) => {
  const { userId } = req.params;
  
  db.all('SELECT * FROM playlists WHERE user_id = ? ORDER BY created_at DESC', 
    [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create playlist
app.post('/api/users/:userId/playlists', (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Playlist name is required' });
    return;
  }
  
  db.run('INSERT INTO playlists (name, user_id) VALUES (?, ?)', 
    [name, userId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.status(201).json({ 
      message: 'Playlist created successfully',
      playlistId: this.lastID 
    });
  });
});

// Add song to playlist
app.post('/api/playlists/:playlistId/songs', (req, res) => {
  const { playlistId } = req.params;
  const { songId } = req.body;
  
  if (!songId) {
    res.status(400).json({ error: 'Song ID is required' });
    return;
  }
  
  // Get next position in playlist
  db.get('SELECT MAX(position) as maxPos FROM playlist_songs WHERE playlist_id = ?', 
    [playlistId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const position = (row.maxPos || 0) + 1;
    
    db.run('INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES (?, ?, ?)', 
      [playlistId, songId, position], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.status(201).json({ 
        message: 'Song added to playlist successfully',
        playlistSongId: this.lastID 
      });
    });
  });
});

// Get playlist songs
app.get('/api/playlists/:playlistId/songs', (req, res) => {
  const { playlistId } = req.params;
  
  const query = `
    SELECT s.*, ps.position, ps.added_at
    FROM songs s
    JOIN playlist_songs ps ON s.id = ps.song_id
    WHERE ps.playlist_id = ?
    ORDER BY ps.position
  `;
  
  db.all(query, [playlistId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add to favorites
app.post('/api/users/:userId/favorites', (req, res) => {
  const { userId } = req.params;
  const { songId } = req.body;
  
  if (!songId) {
    res.status(400).json({ error: 'Song ID is required' });
    return;
  }
  
  db.run('INSERT OR IGNORE INTO user_favorites (user_id, song_id) VALUES (?, ?)', 
    [userId, songId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.status(201).json({ 
      message: 'Song added to favorites successfully'
    });
  });
});

// Get user favorites
app.get('/api/users/:userId/favorites', (req, res) => {
  const { userId } = req.params;
  
  const query = `
    SELECT s.*, uf.created_at as favorited_at
    FROM songs s
    JOIN user_favorites uf ON s.id = uf.song_id
    WHERE uf.user_id = ?
    ORDER BY uf.created_at DESC
  `;
  
  db.all(query, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Music API server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});