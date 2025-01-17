const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mongoose = require('mongoose');
const ConfirmEmail = require('../models/ConfirmEmail')

router.post('/', async (req, res) => {
  const { to, subject, text } = req.body;

  // Set up your email account credentials
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com', // Replace with your email provider's SMTP server
    port: 465,
    secure: true,
    auth: {
      user: 'lead@lead4earth.org', // Replace with your email address
      pass: 'Pledge4Earth', // Replace with your email password
    },
  });

  // Generate a unique token
  const uniqueToken = crypto.randomBytes(32).toString('hex');
  const confirmLink = `https://lead4earth.org/confirm-email/${uniqueToken}`;
  const textupdated = text.replace('confirmplaceholder',confirmLink);
  const mailOptions = {
    from: 'lead@lead4earth.org', // Replace with your email address
    to,
    subject,
    text: textupdated,
  };

  try {
    await transporter.sendMail(mailOptions);
    const confirmEmail = new ConfirmEmail();
    confirmEmail.emailid = to;
    confirmEmail.token = uniqueToken;
    await confirmEmail.save();

    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to send email' });
  }
});

module.exports = router;
