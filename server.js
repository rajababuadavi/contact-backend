const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS, etc.) directly from the current directory
app.use(express.static(__dirname));

// Route to serve contact.html when visiting the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// Handle form submission
app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address from .env
      pass: process.env.EMAIL_PASS  // your Gmail app password from .env
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // receiving email address from .env
    subject: `New Message from ${name}`,
    text: `You received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      res.status(500).send('Email failed to send.');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully.');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
