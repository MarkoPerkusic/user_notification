const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db', (err) => {
	if (err) {
		console.error('Error opening the database:', err.message);
	} else {
		console.log('Connected to the SQLite database.');
		// Create the users table if it doesn't exist
		db.run(`
			CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT NOT NULL,
			password TEXT NOT NULL
			)
		`);
	}
});


router.post('/', (req, res) => {
	const { email, password, action } = req.body;

	if (action === 'login') {
		// Check if user exists
		db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
		if (err) {
			console.error('Error fetching user data:', err.message);
			return res.status(500).json({ message: 'Internal Server Error' });
		}
		
		if (!user) {
			return res.status(400).json({ message: 'User not found' });
		}

		// Check if password is correct
		const passwordMatch = bcrypt.compareSync(password, user.password);
		
		if (!passwordMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}
		res.json({ message: 'User logged in successfully' });
	});
	} else if (action === 'register') {
		// Check if user already exists
		db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
		if (err) {
			console.error('Error fetching user data:', err.message);
			return res.status(500).json({ message: 'Internal Server Error' });
		}

		
		if (user) {
			return res.status(400).json({ message: 'User already exists' });
		}
		});

		// Hash the password
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		// Create new user
		db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
			if (err) {
				console.error('Error while creating the new user:', err.message);
				return res.status(500).json({ message: 'Internal Server Error' });
			}
		res.json({ message: 'User registered successfully' });
		});
	} else {
		res.status(400).send('Bad Request');
	}
});

module.exports = router;
