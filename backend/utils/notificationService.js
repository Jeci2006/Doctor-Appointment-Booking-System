import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends an email notification to the patient.
 * @param {string} to - Patient's email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body text
 */
export const sendEmailNotification = async (to, subject, text) => {
    try {
        // If credentials are using placeholders, just log to console
        if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
            console.warn('--- Notification Service (SIMULATED) ---');
            console.warn(`To: ${to}`);
            console.warn(`Subject: ${subject}`);
            console.warn(`Message: ${text}`);
            console.warn('----------------------------------------');
            return true;
        }

        const info = await transporter.sendMail({
            from: `"Doctor Appointment System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });

        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

import twilio from 'twilio';

/**
 * Sends a WhatsApp message using Twilio's Sandbox.
 * @param {string} to - Patient's phone number
 * @param {string} message - Message to send via WhatsApp
 */
export const sendWhatsAppMessage = async (to, message) => {
    try {
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;

        if (!sid || sid === 'your_twilio_sid' || !token || token === 'your_twilio_token') {
            console.warn('--- WhatsApp Service (SIMULATED) ---');
            console.warn(`To: ${to}`);
            console.warn(`Message: ${message}`);
            return true;
        }

        const client = twilio(sid, token);
        const formattedTo = to.startsWith('+') ? to : `+91${to}`;
        
        const msg = await client.messages.create({
            body: message,
            from: 'whatsapp:+14155238886', // Twilio's shared WhatsApp Sandbox number
            to: `whatsapp:${formattedTo}`
        });

        console.log('WhatsApp message sent: %s', msg.sid);
        return true;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.message);
        return false;
    }
};

/**
 * Sends an SMS notification (Placeholder for future Twilio integration).
 * @param {string} phone - Patient's phone number
 * @param {string} message - SMS message content
 */
export const sendSMSNotification = async (phone, message) => {
     console.warn('--- SMS Notification (SIMULATED) ---');
     console.warn(`To: ${phone}`);
     console.warn(`Message: ${message}`);
     console.warn('------------------------------------');
     return true;
};
