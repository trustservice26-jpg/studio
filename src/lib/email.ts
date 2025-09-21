
'use server';

import type { Transaction } from './types';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

type EmailPayload = {
  to: string | string[];
  transaction: Transaction;
};

/**
 * Sends transaction-related emails using Mailgun.
 * 
 * This function is now configured to use Mailgun. You must provide your
 * Mailgun API Key and Domain in the .env file for this to work.
 * 
 * @param {EmailPayload} payload - The email payload.
 * @param {string|string[]} payload.to - The recipient's email address or an array of addresses.
 * @param {Transaction} payload.transaction - The transaction details.
 */
export async function sendTransactionEmail({ to, transaction }: EmailPayload) {
  const { type, amount, description, date } = transaction;

  const mailgunApiKey = process.env.MAILGUN_API_KEY;
  const mailgunDomain = process.env.MAILGUN_DOMAIN;
  const fromEmail = process.env.MAILGUN_FROM_EMAIL;

  if (!mailgunApiKey || !mailgunDomain || !fromEmail) {
    console.error('Mailgun environment variables are not set. Email will not be sent.');
    console.log('--- SKIPPING EMAIL (configuration missing) ---');
    return;
  }
  
  if (mailgunApiKey === 'YOUR_MAILGUN_API_KEY') {
    console.warn('Mailgun API Key is a placeholder. Please update your .env file.');
    console.log('--- SKIPPING EMAIL (placeholder configuration) ---');
    return;
  }

  const subject = type === 'donation' 
    ? 'Donation Confirmation - Seva Sangathan' 
    : 'Withdrawal Notification - Seva Sangathan';

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount);

  const formattedDate = new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const textBody = `
Hello,

This email is to notify you of a recent transaction with Seva Sangathan.

Transaction Details:
- Type: ${type}
- Amount: ${formattedAmount}
- Description: ${description}
- Date: ${formattedDate}

Thank you for your involvement.

Sincerely,
The Seva Sangathan Team
  `;
  
  const htmlBody = `
    <p>Hello,</p>
    <p>This email is to notify you of a recent transaction with Seva Sangathan.</p>
    <h3>Transaction Details:</h3>
    <ul>
      <li><strong>Type:</strong> ${type}</li>
      <li><strong>Amount:</strong> ${formattedAmount}</li>
      <li><strong>Description:</strong> ${description}</li>
      <li><strong>Date:</strong> ${formattedDate}</li>
    </ul>
    <p>Thank you for your involvement.</p>
    <p>Sincerely,<br>The Seva Sangathan Team</p>
  `;

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: mailgunApiKey });

  const messageData = {
    from: `Seva Sangathan <${fromEmail}>`,
    to: Array.isArray(to) ? to.join(',') : to,
    subject: subject,
    text: textBody,
    html: htmlBody,
  };

  try {
    await mg.messages.create(mailgunDomain, messageData);
    console.log('Email sent successfully via Mailgun.');
  } catch (error) {
    console.error('Failed to send email via Mailgun:', error);
  }
}
