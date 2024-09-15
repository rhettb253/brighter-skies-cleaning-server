'use strict';
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// Create a Nodemailer transporter with SMTP settings
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const app = express();

// Allow all origins (for development purposes)
app.use(cors({
    origin: 'http://localhost:5173' // Vite app's URL
}));
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Default route
app.get('/', (req, res) => {
    res.send('default route working');
})

// Endpoint to handle form submissions
app.post('/submitForm', (req, res) => {
    const { name, email, message } = req.body;
    console.log(name, email, message);

    // Email content
    const mailOptions = {
        from: `Brighter Skies Cleaning <${process.env.EMAIL}>`,
        to: `${name} <${email}>`, // Use the email submitted in the form
        bcc: `RHETT B <${process.env.PERSONAL_EMAIL}>`,
        subject: 'Confirmation : Brighter Skies Cleaning',
        // for text only capable emails 
        text: `Hi ${name}!
        Thank you for contacting us at Brighter Skies Cleaning.
        I will contact you via this email address over the next few days. Looking forward to it 😀,
        Sincerely,
            Brighter Skies Cleaning
            www.brighterskiescleaning.com
        ${message}`,
        // for most emails
        html: `
        <h4>Hi ${name}!</h4>
        <p>Thank you for contacting us at Brighter Skies Cleaning. I will contact you via this email address over the next few days. Looking forward to it 😀, <br/>
        Sincerely, </p>
        <p style="margin-left: 20px;"><span style="font-weight: bold;">Brighter Skies Cleaning</span></p>
        <a href="https://www.brighterskiescleaning.com" target="_blank">www.brighterskiescleaning.com</a>
        <br/>
        <p>"${message}"</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.log('Error sending email: ', error);
        res.status(500).send('Error sending confirmation email');
        } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Confirmation email sent');
        }
    });
})

// Start the server
function start(port) {
    app.listen(port, console.log(`Server is running on port ${port}`))
}

module.exports = { start }