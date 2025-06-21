const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Use dynamic port for Render (fallback to 3000 for local dev)
const PORT = process.env.PORT || 3000;

// Allow your frontend to connect (CORS)
app.use(cors({
  origin: 'https://rajababuadavi.in'
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (if needed — optional on Render)
app.use(express.static(__dirname));

// Route to serve contact.html (optional for dev)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// Contact form endpoint
app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New Message from ${name}`,
    text: `You received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Email failed to send.');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully.');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
