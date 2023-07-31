const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Mock database
const users = [];

router.post('/register', (req, res) => 
	{
  		const { email, password } = req.body;

  		// Check if user already exists
  		const userExists = users.find((user) => user.email === email);
  		if (userExists) {
    			return res.status(400).json({ message: 'User already exists' });
  		}

  		// Hash the password
  		const salt = bcrypt.genSaltSync(10);
  		const hashedPassword = bcrypt.hashSync(password, salt);

  		// Create new user
  		const newUser = { email, password: hashedPassword };
  		users.push(newUser);

		req.session.user = newUser;


  		res.json({ message: 'User registered successfully'});
	}
);

router.post('/login', (req, res) => 
	{
  		const { email, password } = req.body;

  		// Check if user exists
  		const user = users.find((user) => user.email === email);
  		if (!user) {
    			return res.status(400).json({ message: 'User not found' });
  		}

  		// Check if password is correct
  		const passwordMatch = bcrypt.compareSync(password, user.password);
  		if (!passwordMatch) {
    			return res.status(400).json({ message: 'Invalid credentials' });
  		}

  		res.json({ message: 'User logged in successfully'});
	}
);

module.exports = router;