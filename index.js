require('dotenv').config();

const secret = process.env.SECRET;
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const usersRouter = require('./users');
const PORT = 3000;
const path = require('path');
const axios = require('axios');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registration and login
app.use('/users', usersRouter);

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Mock part
app.post('/send-welcome-email', (req, res) => {
  console.log('Welcome email sent!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
