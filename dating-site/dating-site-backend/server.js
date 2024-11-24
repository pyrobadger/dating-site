const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aditya@123', // Your MySQL password
    database: 'dating_website'
});

// Connect to MySQL
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// User Registration Endpoint
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)', [username, hashedPassword, email], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'User registered successfully!' });
    });
});

// User Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) return res.status(401).send('User not found');

        const user = results[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).send('Invalid credentials');

        // Generate JWT Token
        const token = jwt.sign({ userId: user.user_id }, 'your_jwt_secret'); // Use a secure secret in production
        res.send({ token });
    });
});

// Profile Creation Endpoint
app.post('/profile', (req, res) => {
    const { user_id, age, gender, interests, bio } = req.body;

    db.query(
        'INSERT INTO profiles (user_id, age, gender, interests, bio) VALUES (?, ?, ?, ?, ?)',
        [user_id, age, gender, interests, bio],
        (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(201).send({ message: 'Profile created successfully!' });
        }
    );
});

// Fetch Profile Endpoint
app.get('/profile/:userId', (req, res) => {
    const { userId } = req.params;

    db.query('SELECT * FROM profiles WHERE user_id = ?', [userId], (err, results) => {
        if (err || results.length === 0) return res.status(404).send('Profile not found');

        res.send(results[0]);
    });
});

// Send Message Endpoint
app.post('/messages', (req, res) => {
    const { sender_id, receiver_id, message_content } = req.body;

    db.query(
        'INSERT INTO messages (sender_id, receiver_id, message_content) VALUES (?, ?, ?)',
        [sender_id, receiver_id, message_content],
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.status(201).send({ message: 'Message sent successfully!' });
        }
    );
});

// Fetch Messages Endpoint
app.get('/messages/:userId', (req, res) => {
    const { userId } = req.params;

    db.query(
        'SELECT m.message_id, m.message_content, u.username AS sender_username FROM messages m JOIN users u ON m.sender_id = u.user_id WHERE m.receiver_id = ?',
        [userId],
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results);
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
