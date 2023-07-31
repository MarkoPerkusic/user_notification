// app.js
require('dotenv').config();

const secret = process.env.SECRET;
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const usersRouter = require('./users');
const PORT = 3000;


app.use(express.json());

app.use(session(
	{
  		secret: secret,
  		resave: false,
  		saveUninitialized: false,
	}
));

app.get('/', (req, res) => {
	res.send('Hello, this is the root route!');
	}
);

// Registration and login
app.use('/users', usersRouter);

// Mock part
app.post('/send-welcome-email', (req, res) => 
	{
		res.json({ message: 'Welcome email sent!' });
	}
);

//Parse incoming request bodies
app.use(bodyParser.json());

app.listen(PORT, () => 
	{
		console.log(`Server is running on http://localhost:${PORT}`);
	}
);

