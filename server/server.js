const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*'
};

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 50000 }));

const path = require('path');
const dbPath = path.join(__dirname, 'database.db');
console.log('Database path:', dbPath);
const db = new sqlite3.Database(dbPath);

app.get('/api/data', (req, res) => {
    db.all('SELECT * FROM data', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Add the new DELETE endpoint for /api/cleanHits
app.delete('/api/cleanHits', (req, res) => {
    console.log('Received cleanHits request'); // Add this line
    const query = `
      DELETE FROM hits;
    `;
    db.run(query, (err) => {
        if (err) {
            console.error('Error while cleaning hits:', err);
            res.status(500).json({ success: false });
        } else {
            console.log('Hits cleaned successfully'); // Add this line
            res.json({ success: true });
        }
    });
});

// Add the new GET endpoint for /api/getHits
app.get('/api/getHits', (req, res) => {
    console.log('Received getHits request');
    const query = `
      SELECT * FROM hits;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error while fetching hits:', err);
            res.status(500).json({ success: false });
        } else {
            console.log('Hits fetched successfully');
            res.json({ hits: rows });
        }
    });
});

// Change the endpoint to '/api/insertHitsFromTextarea'
app.post('/api/insertHitsFromTextarea', async (req, res) => {
    console.log('Received insertHitsFromTextarea request');
    const hits = req.body.hits;

    const insertHit = (query, hitParams) => {
        return new Promise((resolve, reject) => {
            db.run(query, hitParams, (err) => {
                if (err) {
                    console.error('Error while inserting hit:', err);
                    console.error('Failed hit:', hitParams);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    let success = true;
    let originalIndex = 0;
    for (const hit of hits) {
        let query;
        let hitParams;
        let original = hit.type !== 'custom'; // Set original to false only if hit.type is 'custom'

        if (original) {
            hit.original_index = originalIndex;
            originalIndex++;
        } else {
            hit.original_index = null;
        }

        switch (hit.type) {
            case 'act':
            case 'point':
            case 'disaster':
                query = `
                    INSERT INTO hits (type, original_index, number, title, text, original, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
                `;
                hitParams = [hit.type, hit.original_index, hit.number, hit.title, hit.text, original];
                break;
            case 'annotation':
                query = `
                    INSERT INTO hits (type, original_index, number, text, original, created_at)
                    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
                `;
                hitParams = [hit.type, hit.original_index, hit.number, hit.text, original];
                break;
            case 'normal_hit':
                query = `
                    INSERT INTO hits (type, original_index, number, title, color, text, tension, flag, original, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
                `;
                hitParams = [hit.type, hit.original_index, hit.number, hit.title, hit.color, hit.text, hit.tension, hit.flag === '' ? null : hit.flag, original];
                break;
            case 'custom':
                query = `
                    INSERT INTO hits (type, original_index, text, original, created_at)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP);
                `;
                hitParams = [hit.type, hit.original_index, hit.text, original];
                break;
            default:
                console.error('Invalid hit type:', hit.type);
                success = false;
                break;
        }

        if (!success) {
            break;
        }

        try {
            await insertHit(query, hitParams);
        } catch (err) {
            console.error('Error while inserting hit:', err);
            success = false;
            break;
        }
    }

    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

app.post('/api/insertHitsFromHitsList', async (req, res) => {
    console.log('Received insertHitsFromTextarea request');
    const hits = req.body.hits;
    const query = `
      INSERT INTO hits (type, original_index, number, title, color, text, tension, flag, icon, original, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
    `;

    const insertHit = (hit) => {
        return new Promise((resolve, reject) => {
            const { type, original_index, number, title, color, text, tension, flag, icon, original } = hit;
            //console.log('Inserting hit:', { type, original_index, number, title, color, text, tension, flag, icon, original });
            db.run(query, [type, original_index, number, title, color, text, tension, flag, icon, original], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };
    let success = true;
    for (const hit of hits) {
        try {
            await insertHit(hit);
        } catch (err) {
            console.error('Error while inserting hit:', err);
            success = false;
            break;
        }
    }

    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

app.get('/api/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'Test endpoint working' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
