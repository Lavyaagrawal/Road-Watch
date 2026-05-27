import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database configuration
const isProd = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL;
let dbClient;

if (isProd) {
    console.log('Using Cloud PostgreSQL Database...');
    dbClient = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for platforms like Render/Supabase
        }
    });
    
    // Auto-create table for Postgres
    dbClient.query(`
        CREATE TABLE IF NOT EXISTS issues (
            id SERIAL PRIMARY KEY,
            description TEXT,
            type TEXT,
            imageUrl TEXT,
            status VARCHAR(50) DEFAULT 'Pending',
            userEmail TEXT,
            latitude REAL,
            longitude REAL,
            createdAt TEXT
        )
    `).then(() => {
        console.log('PostgreSQL database table verified/created.');
    }).catch(err => {
        console.error('Error creating PostgreSQL table:', err.message);
    });
} else {
    console.log('Using Local SQLite Database...');
    const dbPath = path.join(__dirname, 'roadwatch.db');
    dbClient = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to SQLite database:', err.message);
        } else {
            console.log('Connected to SQLite database at:', dbPath);
            initializeSQLiteDatabase();
        }
    });
}

function initializeSQLiteDatabase() {
    dbClient.run(`
        CREATE TABLE IF NOT EXISTS issues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT,
            type TEXT,
            imageUrl TEXT,
            status TEXT DEFAULT 'Pending',
            userEmail TEXT,
            latitude REAL,
            longitude REAL,
            createdAt TEXT
        )
    `, (err) => {
        if (err) {
            console.error('Error creating SQLite table:', err.message);
        } else {
            console.log('SQLite database table verified/created.');
        }
    });
}

// API Routes

// GET: Fetch all issues
app.get('/api/issues', async (req, res) => {
    try {
        if (isProd) {
            const result = await dbClient.query('SELECT * FROM issues ORDER BY createdat DESC');
            const mappedRows = result.rows.map(row => ({
                id: row.id,
                description: row.description,
                type: row.type,
                imageUrl: row.imageurl,   // Map lowercase back to camelCase
                status: row.status,
                userEmail: row.useremail, // Map lowercase back to camelCase
                latitude: row.latitude,
                longitude: row.longitude,
                createdAt: row.createdat  // Map lowercase back to camelCase
            }));
            res.json(mappedRows);
        } else {
            dbClient.all('SELECT * FROM issues ORDER BY createdAt DESC', [], (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Create a new issue report
app.post('/api/issues', async (req, res) => {
    const { description, type, imageUrl, status, userEmail, latitude, longitude, createdAt } = req.body;
    
    if (!description || !type || !imageUrl || !userEmail) {
        return res.status(400).json({ error: 'Missing required fields (description, type, imageUrl, userEmail).' });
    }

    const finalStatus = status || 'Pending';
    const finalCreatedAt = createdAt || new Date().toISOString();
    const finalLat = latitude !== undefined ? latitude : null;
    const finalLng = longitude !== undefined ? longitude : null;

    try {
        if (isProd) {
            const query = `
                INSERT INTO issues (description, type, imageUrl, status, userEmail, latitude, longitude, createdAt)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
            `;
            const params = [description, type, imageUrl, finalStatus, userEmail, finalLat, finalLng, finalCreatedAt];
            const result = await dbClient.query(query, params);
            res.status(201).json({
                id: result.rows[0].id,
                description,
                type,
                imageUrl,
                status: finalStatus,
                userEmail,
                latitude: finalLat,
                longitude: finalLng,
                createdAt: finalCreatedAt
            });
        } else {
            const query = `
                INSERT INTO issues (description, type, imageUrl, status, userEmail, latitude, longitude, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [description, type, imageUrl, finalStatus, userEmail, finalLat, finalLng, finalCreatedAt];
            dbClient.run(query, params, function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({
                    id: this.lastID,
                    description,
                    type,
                    imageUrl,
                    status: finalStatus,
                    userEmail,
                    latitude: finalLat,
                    longitude: finalLng,
                    createdAt: finalCreatedAt
                });
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Update an issue's status
app.put('/api/issues/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Missing status field.' });
    }

    try {
        if (isProd) {
            const result = await dbClient.query('UPDATE issues SET status = $1 WHERE id = $2', [status, id]);
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Issue not found.' });
            }
            res.json({ success: true, id: Number(id), status });
        } else {
            dbClient.run('UPDATE issues SET status = ? WHERE id = ?', [status, id], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Issue not found.' });
                }
                res.json({ success: true, id: Number(id), status });
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Remove an issue report
app.delete('/api/issues/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (isProd) {
            const result = await dbClient.query('DELETE FROM issues WHERE id = $1', [id]);
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Issue not found.' });
            }
            res.json({ success: true, id: Number(id) });
        } else {
            dbClient.run('DELETE FROM issues WHERE id = ?', [id], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Issue not found.' });
                }
                res.json({ success: true, id: Number(id) });
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start listening
app.listen(PORT, () => {
    console.log(`RoadWatch Express API running at http://localhost:${PORT}`);
});
