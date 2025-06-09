const sgMail = require('@sendgrid/mail');

const API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.NOTIFY_FROM_EMAIL || 'noreply@example.com';

if (API_KEY) {
  sgMail.setApiKey(API_KEY);
} else {
  console.warn('SENDGRID_API_KEY not set; emails will not be sent');
}

async function sendWithRetry(msg, attempt = 0) {
  try {
    await sgMail.send(msg);
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

module.exports = {
  sendCaseReady,
  sendNewRequest,
};
