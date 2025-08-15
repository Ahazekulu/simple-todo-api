const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// Create a database connection using environment variables (for security)
const db = mysql.createConnection({
    // ...
});

// ... (rest of your code)
const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// Create a database connection using environment variables (for security)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// GET endpoint to retrieve all to-do items
app.get('/todos', (req, res) => {
    const sql = 'SELECT * FROM todos';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving todos');
            return;
        }
        res.json(results);
    });
});

// POST endpoint to add a new to-do item
app.post('/todos', (req, res) => {
    const newTodo = req.body.task;
    const sql = 'INSERT INTO todos (task) VALUES (?)';
    db.query(sql, [newTodo], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding todo');
            return;
        }
        res.status(201).json({ id: result.insertId, task: newTodo });
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
