
'use server';

import type { Transaction } from './types';
import { Resend } from 'resend';

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('RESEND_API_KEY is not set. Emails will be logged to console instead of being sent.');
}

type EmailPayload = {
  to: string | string[];
  transaction: Transaction;
  language: 'en' | 'bn';
};

/**
 * Sends a transaction-related email using Resend.
 * 
 * To send real emails, you must provide a valid Resend API key and a
 * "From" email address in your .env file.
 * 
 * @param {EmailPayload} payload - The email payload.
 */
export async function sendTransactionEmail({ to, transaction, language }: EmailPayload) {
  if (!resend || !process.env.RESEND_FROM_EMAIL) {
    console.error('Resend is not configured. Skipping email.');
    logEmailToConsole({ to, transaction, language });
    return;
  }
  
  const { type, amount, description, date, memberName } = transaction;

  const isDonation = type === 'donation';
  const subject = isDonation 
    ? (language === 'bn' ? 'অনুদান প্রাপ্তি স্বীকার' : 'Donation Confirmation')
    : (language === 'bn' ? 'তহবিল উত্তোলন বিজ্ঞপ্তি' : 'Fund Withdrawal Notification');

  const formattedAmount = new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount);

  const formattedDate = new Date(date).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  
  const donationGreeting = language === 'bn' 
    ? 'প্রিয় সদস্য,' 
    : 'Dear Member,';
  const donationBody = language === 'bn' 
    ? `<p>সেবা সংগঠনে আপনার উদার অনুদানের জন্য আমরা আপনাকে ধন্যবাদ জানাই। আমরা আপনার সমর্থনকে গভীরভাবে মূল্য দিই।</p>`
    : `<p>We would like to thank you for your generous donation to Seva Sangathan. We deeply appreciate your support.</p>`;
    
  const withdrawalGreeting = language === 'bn' 
    ? 'প্রিয় সদস্যগণ,'
    : 'Dear Members,';
  const withdrawalBody = language === 'bn' 
    ? `<p>আপনাদের জানানো যাচ্ছে যে, সেবা সংগঠনের তহবিল থেকে একটি উত্তোলন করা হয়েছে।</p>`
    : `<p>This is to inform you that a withdrawal has been made from the Seva Sangathan funds.</p>`;


  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
        <h1 style="color: #0056b3; margin: 0;">${language === 'bn' ? 'সেবা সংগঠন' : 'Seva Sangathan'}</h1>
      </div>
      <div style="padding: 20px;">
        <p>${isDonation ? donationGreeting : withdrawalGreeting}</p>
        ${isDonation ? donationBody : withdrawalBody}
        <div style="background-color: #f9f9f9; border-left: 4px solid #0056b3; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #0056b3;">${language === 'bn' ? 'লেনদেনের বিবরণ' : 'Transaction Details'}:</h3>
          <p><strong>${language === 'bn' ? 'ধরন' : 'Type'}:</strong> ${isDonation ? (language === 'bn' ? 'অনুদান' : 'Donation') : (language === 'bn' ? 'উত্তোলন' : 'Withdrawal')}</p>
          ${isDonation && memberName ? `<p><strong>${language === 'bn' ? 'দাতা' : 'Donated By'}:</strong> ${memberName}</p>` : ''}
          <p><strong>${language === 'bn' ? 'বিবরণ' : 'Description'}:</strong> ${description}</p>
          <p><strong>${language === 'bn' ? 'পরিমাণ' : 'Amount'}:</strong> <span style="font-weight: bold; color: ${isDonation ? '#28a745' : '#dc3545'};">${formattedAmount}</span></p>
          <p><strong>${language === 'bn' ? 'তারিখ' : 'Date'}:</strong> ${formattedDate}</p>
        </div>
        <p>${language === 'bn' ? 'আপনার অব্যাহত সমর্থনের জন্য ধন্যবাদ।' : 'Thank you for your continued support.'}</p>
        <p>শুভেচ্ছান্তে,<br><strong>${language === 'bn' ? 'সেবা সংগঠন টিম' : 'The Seva Sangathan Team'}</strong></p>
      </div>
      <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #777;">
        <p>${language === 'bn' ? 'এটি একটি স্বয়ংক্রিয় ইমেল, অনুগ্রহ করে এর উত্তর দেবেন না।' : 'This is an automated email, please do not reply.'}</p>
      </div>
    </div>
  `;
  
  const msg = {
    to: to,
    from: process.env.RESEND_FROM_EMAIL,
    subject: subject,
    html: htmlBody,
  };

  try {
    await resend.emails.send(msg);
    console.log(`Email sent successfully to ${Array.isArray(to) ? to.join(',') : to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// Helper function to log email content to the console for debugging
function logEmailToConsole({ to, transaction, language }: EmailPayload) {
  const { type, amount, description, date } = transaction;

  const subject = type === 'donation' 
      ? 'Donation Confirmation' 
      : 'Withdrawal Notification';

  const formattedAmount = new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
      style: 'currency',
      currency: 'BDT',
  }).format(amount);

  const formattedDate = new Date(date).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US', {
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
