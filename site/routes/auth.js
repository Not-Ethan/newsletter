
const express = require('express');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport({
  SES: {
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
});

const router = express.Router();

router.post('/login', (req, res) => {
  const email = req.body.email;
  if (!email || !verifyEmail(email)) {
    return res.status(400).send('Email is required');
  }
  const token = crypto.randomBytes(16).toString('hex');

// Send email
transporter.sendMail({
  from: 'test@darch.com',
  to: email,
  subject: 'Test Email',
  text: 'Please use this link to log in.', // Plain text fallback
  html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>Welcome to Our Service!</h1>
      <p>We're excited to have you on board. Please use the button below to log in:</p>
      <a href="localhost:5173/login?token=${token}" 
         style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Log In Now
      </a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p><a href="https://example.com/login">https://example.com/login</a></p>
    </div>
  `
});
});
function verifyEmail(email) {
  email = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
module.exports = router;