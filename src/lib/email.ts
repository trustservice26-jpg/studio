
'use server';

import type { Transaction } from './types';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

// Initialize Mailgun client
let mailgun: Mailgun | null = null;
if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
  mailgun = new Mailgun(formData);
} else {
  console.warn('MAILGUN_API_KEY or MAILGUN_DOMAIN is not set. Emails will be logged to console instead of being sent.');
}

const mg = mailgun?.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || '',
});

type EmailPayload = {
  to: string | string[];
  transaction: Transaction;
};

/**
 * Sends a transaction-related email using Mailgun.
 * 
 * To send real emails, you must provide a valid Mailgun API key, domain, and a
 * "From" email address in your .env file.
 * 
 * @param {EmailPayload} payload - The email payload.
 * @param {string|string[]} payload.to - The recipient's email address or an array of addresses.
 * @param {Transaction} payload.transaction - The transaction details.
 */
export async function sendTransactionEmail({ to, transaction }: EmailPayload) {
  if (!mg || !process.env.MAILGUN_FROM_EMAIL) {
    console.error('Mailgun is not configured. Skipping email.');
    // Fallback to console logging if Mailgun is not configured
    logEmailToConsole({ to, transaction });
    return;
  }
  
  const { type, amount, description, date } = transaction;

  const subject = type === 'donation' 
    ? 'Donation Confirmation' 
    : 'Withdrawal Notification';

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount);

  const formattedDate = new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const body = `
    <div style="font-family: sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Transaction Notification</h2>
      <p>Hello,</p>
      <p>This email is to notify you of a recent transaction with Seva Sangathan.</p>
      <hr style="border: none; border-top: 1px solid #eee;">
      <h3 style="color: #555;">Transaction Details:</h3>
      <ul>
        <li><strong>Type:</strong> ${type}</li>
        <li><strong>Amount:</strong> ${formattedAmount}</li>
        <li><strong>Description:</strong> ${description}</li>
        <li><strong>Date:</strong> ${formattedDate}</li>
      </ul>
      <hr style="border: none; border-top: 1px solid #eee;">
      <p>Thank you for your involvement and support.</p>
      <p>Sincerely,<br><strong>The Seva Sangathan Team</strong></p>
    </div>
  `;
  
  const msg = {
    to: Array.isArray(to) ? to.join(',') : to,
    from: process.env.MAILGUN_FROM_EMAIL,
    subject: subject,
    html: body,
  };

  try {
    if(process.env.MAILGUN_DOMAIN) {
        await mg.messages.create(process.env.MAILGUN_DOMAIN, msg);
        console.log(`Email sent successfully to ${msg.to}`);
    }
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// Helper function to log email content to the console for debugging
function logEmailToConsole({ to, transaction }: EmailPayload) {
    const { type, amount, description, date } = transaction;

    const subject = type === 'donation' 
        ? 'Donation Confirmation' 
        : 'Withdrawal Notification';

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BDT',
    }).format(amount);

    const formattedDate = new Date(date).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    const body = `
        Hello,

        This email is to notify you of a recent transaction.

        Transaction Details:
        - Type: ${type}
        - Amount: ${formattedAmount}
        - Description: ${description}
        - Date: ${formattedDate}

        Thank you for your involvement with Seva Sangathan.

        Sincerely,
        The Seva Sangathan Team
    `;

    console.log('--- Mock Email Sending ---');
    console.log('This is a placeholder. No real email has been sent.');
    console.log(`To: ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log('--------------------------');
}
