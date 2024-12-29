const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

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
      await redisClient.set("login:" + token, email);
      console.log("token", token);
      console.log("email", email);
      await redisClient.expire("login:" + token, 900);

      // Generate magic link
      const authLink = `http://localhost:3000/api/auth/v/${token}`;

      // Send email using Mailgun
      const mailOptions = {
        from: 'test@sandboxf4c5c893b50c4ebe9b7312e147686c16.mailgun.org', // Verified Mailgun domain email
        to: email,
        subject: 'Your Magic Login Link',
        text: `Please use this link to log in: ${authLink}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h1>Welcome to Our Service!</h1>
            <p>We're excited to have you on board. Please use the button below to log in:</p>
            <a href="${authLink}" 
               style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: npm ne; border-radius: 5px;">
              Log In Now
            </a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${authLink}</p>
          </div>
        `,
      };

      const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, mailOptions);
      console.log('Email sent successfully:', response);

      // Respond to client
      //TODO DELETE TOKEN FROM REPLY
      res.send('Magic link sent to your email! '+authLink).status(200);
    } catch (err) {
      console.error('Error sending email:', err);
      res.status(500).send('Failed to send magic link.');
    }
  });

  // Auth Route
  router.get('/v/:token', async (req, res) => {  
    const token = req.params.token;

    try {
      // Check token in Redis
      const email = await redisClient.get("login:" + token);
      if (!email) {
        return res.status(400).send('Invalid or expired token.');
      }
      await redisClient.del("login:" + token);

      // Find or create the user
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ email });
        await user.save();
      }

      // At this point, we have a valid user who should be logged in
      req.logIn(user, (err) => {
        if (err) {
          console.error('Error during login:', err);
          return res.status(500).send('Login failed.');
        }
        // User is now logged in and session is established
        res.status(200);
        res.redirect('http://localhost:5173');
        
      });
    } catch (err) {
      console.error('Error during authentication:', err);
      res.status(500).send('Authentication failed.');
    }
  });

  router.get('/session/', (req, res) => {
    if (req.isAuthenticated()) {
      console.log("req.user", req.user);

      return res.json({ isAuthenticated: true, user: req.user });
    }
    res.json({ isAuthenticated: false });
  });

  return router;
};

// Email Validation Function
function verifyEmail(email) {
  email = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


module.exports = createAuthRouter;
