const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const User = require('../models/user');
const strategy = require('../passport');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create an SES instance
const ses = new AWS.SES({ apiVersion: '2010-12-01', region: process.env.AWS_REGION || 'us-east-2' });

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  SES: ses, // Use AWS SES instance
});

const createAuthRouter = (redisClient) => {
  const router = express.Router();

  // Login Route
  router.post('/login', async (req, res) => {
    const email = req.body.email;

    // Validate email
    if (!email || !verifyEmail(email)) {
      return res.status(400).send('Invalid or missing email address.');
    }

    try {
      // Generate a magic link token
      const token = crypto.randomBytes(16).toString('hex');

      // Store token in Redis for 15 minutes
      await redisClient.set("login:"+token, email);
      console.log("token", token);
      console.log("email", email);
      await redisClient.expire("login:"+token, 900);

      // Send email
      let authLink = `http://localhost:3000/api/auth/${token}`;
      const mailOptions = {
        from: 'test@darchai.com', // Verified SES email address
        to: email,
        subject: 'Your Magic Login Link',
        text: `Please use this link to log in: ${authLink}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h1>Welcome to Our Service!</h1>
            <p>We're excited to have you on board. Please use the button below to log in:</p>
            <a href="${authLink}" 
               style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Log In Now
            </a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${authLink}</p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);

      // Respond to client
      res.status(200).send('Magic link sent to your email!');
    } catch (err) {
      console.error('Error sending email:', err);
      res.status(500).send('Failed to send magic link.');
    }
  });

  // Auth Route
  router.get('/auth/:token', async (req, res) => {
    console.log("autch route");
    const token = req.params.token;

    try {
      // Check token in Redis
      const email = await redisClient.get("login:"+token);

      if (!email) {
        return res.status(400).send('Invalid or expired token.');
      }
      await redisClient.del(token);
      
      // Create a new user or update the existing one
      let user = await User.findOneAndUpdate({email}, {email});
      if (!user) {
        user = new User({
          email
        });
        await user.save();

      }

      strategy.authenticate('magiclink', { email }, (err, user) => {
        if (err) {
          console.error('Error during authentication:', err);
          return res.status(500).send('Authentication failed.');
        }

        req.login(user, (err) => {
          if (err) {
            console.error('Error during login:', err);
            return res.status(500).send('Login failed.');
          }

          res.status(200).send('Authentication successful!');
        });
      });

      res.status(200).send('Authentication successful!');
    } catch (err) {
      console.error('Error during authentication:', err);
      res.status(500).send('Authentication failed.');
    }
    res.redirect('/');
  });

  return router;
};

// Email Validation Function
function verifyEmail(email) {
  email = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = createAuthRouter;
