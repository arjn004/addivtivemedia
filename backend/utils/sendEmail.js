// utils/sendEmail.js

import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like 'outlook', 'yahoo', etc.
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: {
            name: 'Arjun Tomar',
            address: process.env.EMAIL_USER,
        }, // Sender address
        to: to, // List of recipients
        subject: subject, // Subject line
        text: text, // Plain text body
        html: `<b>${text}</b>`
    };

    return transporter.sendMail(mailOptions)
        .then(info => console.log('Email sent:', info.response))
        .catch(err => console.error('Error sending email:', err));
};

export default sendEmail;
