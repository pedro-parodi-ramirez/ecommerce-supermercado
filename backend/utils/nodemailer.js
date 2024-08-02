import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

// Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.NODEMAILER.EMAIL,
        pass: config.NODEMAILER.PASS,
    },
})

export default async function sendMail(subject, body, target) {
    try {
        const opts = {
            from: 'Servidor Node',
            to: target,
            subject,
            html: body
        }
        await transporter.sendMail(opts)
            .then(info => console.log(`📨 Email message sent to ${info.envelope.to} 📨`));
    } catch (error) {
        console.error('Error sending email:\n', error)
    }
}