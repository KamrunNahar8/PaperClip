/**
 * DIU PDF BOX - Local Faculty Data API Server
 * 
 * This is a minimal local backend server that serves the DIU faculty
 * data as a REST API endpoint. It runs on your machine only (localhost)
 * and does NOT require any internet connection.
 * 
 * Start the server with: node server.js
 * Then access: http://localhost:3000/api/faculty
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Enable CORS so the frontend (on a different port) can call this API
app.use(cors());

// ── GET /api/faculty ──────────────────────────────────────────────────────────
// Returns the full list of DIU faculty members as a JSON array.
// Each item has { name: string, designation: string }
app.get('/api/faculty', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'faculty.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading faculty data:', err);
            return res.status(500).json({ error: 'Failed to load faculty data.' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
});

// ── GET /api/faculty/search?q=<query> ────────────────────────────────────────
// Optional: Filter faculty by name using a query parameter.
// Example: http://localhost:3000/api/faculty/search?q=kamal
app.get('/api/faculty/search', (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    const dataPath = path.join(__dirname, 'data', 'faculty.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading faculty data:', err);
            return res.status(500).json({ error: 'Failed to load faculty data.' });
        }
        const allFaculty = JSON.parse(data);
        const filtered = query
            ? allFaculty.filter(f => f.name.toLowerCase().includes(query))
            : allFaculty;
        res.json(filtered);
    });
});

// ── Server Startup ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║      DIU PDF BOX - Faculty API Server        ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log(`║  Running on: http://localhost:${PORT}           ║`);
    console.log(`║  Endpoint:   /api/faculty                    ║`);
    console.log(`║  Search:     /api/faculty/search?q=<name>    ║`);
    console.log('╠══════════════════════════════════════════════╣');
    console.log('║  Press Ctrl+C to stop the server             ║');
    console.log('╚══════════════════════════════════════════════╝');
});
