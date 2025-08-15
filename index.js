const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
