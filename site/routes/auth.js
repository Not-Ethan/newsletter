
const express = require('express');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');

const router = express.Router();

router.post('/login', (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).send('Email is required');
  }
  const token = crypto.randomBytes(16).toString('hex');

});

module.exports = router;