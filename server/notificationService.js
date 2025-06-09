const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

const API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL =
  process.env.NOTIFY_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@example.com';

let transporter;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

if (API_KEY) {
  sgMail.setApiKey(API_KEY);
} else if (!transporter) {
  console.warn('No email service configured; emails will not be sent');
}

async function sendWithRetry(msg, attempt = 0) {
  try {
    if (API_KEY) {
      await sgMail.send(msg);
    } else if (transporter) {
      await transporter.sendMail(msg);
    } else {
      return;
    }
    console.log(`Email sent to ${msg.to}`);
  } catch (err) {
    console.error(`Failed to send email to ${msg.to}:`, err.message);
    if (attempt < 2) {
      console.log(`Retrying (${attempt + 1}) for ${msg.to}`);
      return sendWithRetry(msg, attempt + 1);
    }
  }
}

async function sendCaseReady(toEmail, caseId) {
  const msg = {
    to: toEmail,
    from: FROM_EMAIL,
    subject: 'Your report is ready',
    text: `Your report for case ${caseId} is ready.`,
    html: `<p>Your report for case <strong>${caseId}</strong> is ready.</p>`,
  };
  await sendWithRetry(msg);
}

async function sendNewRequest(toEmail, caseId) {
  const msg = {
    to: toEmail,
    from: FROM_EMAIL,
    subject: 'New case assigned',
    text: `A new case (${caseId}) has been assigned to you.`,
    html: `<p>A new case (<strong>${caseId}</strong>) has been assigned to you.</p>`,
  };
  await sendWithRetry(msg);
}

async function sendBookingConfirmation(dentistEmail, specialistEmail, datetime) {
  const timeString = new Date(datetime).toLocaleString();
  if (dentistEmail) {
    const msg = {
      to: dentistEmail,
      from: FROM_EMAIL,
      subject: 'Booking Confirmed',
      text: `Your call is booked for ${timeString}.`,
      html: `<p>Your call is booked for <strong>${timeString}</strong>.</p>`,
    };
    await sendWithRetry(msg);
  }
  if (specialistEmail) {
    const msg = {
      to: specialistEmail,
      from: FROM_EMAIL,
      subject: 'New Booking Scheduled',
      text: `A call was booked for ${timeString}.`,
      html: `<p>A call was booked for <strong>${timeString}</strong>.</p>`,
    };
    await sendWithRetry(msg);
  }
}

module.exports = {
  sendCaseReady,
  sendNewRequest,
  sendBookingConfirmation,
};
