
'use server';

import type { Member, Transaction } from './types';
import { Resend } from 'resend';

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('RESEND_API_KEY is not set. Emails will be logged to console instead of being sent.');
}

type TransactionEmailPayload = {
  to: string | string[];
  transaction: Transaction;
  language: 'en' | 'bn';
};

/**
 * Sends a transaction-related email using Resend.
 */
export async function sendTransactionEmail({ to, transaction, language }: TransactionEmailPayload) {
  const { type, amount, description, date } = transaction;

  const subject = language === 'bn' 
    ? (type === 'donation' ? 'অনুদান নিশ্চিতকরণ' : 'উত্তোলন বিজ্ঞপ্তি')
    : (type === 'donation' ? 'Donation Confirmation' : 'Withdrawal Notification');

  const formattedAmount = new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount);

  const formattedDate = new Date(date).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const htmlBody = `
    <div style="font-family: sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">${language === 'bn' ? 'লেনদেন বিজ্ঞপ্তি' : 'Transaction Notification'}</h2>
      <p>${language === 'bn' ? 'নমস্কার,' : 'Hello,'}</p>
      <p>${language === 'bn' ? 'এই ইমেলটি আপনাকে সেবা সংগঠনে একটি সাম্প্রতিক লেনদেন সম্পর্কে অবহিত করার জন্য।' : 'This email is to notify you of a recent transaction with Seva Sangathan.'}</p>
      <hr style="border: none; border-top: 1px solid #eee;">
      <h3 style="color: #555;">${language === 'bn' ? 'লেনদেনের বিবরণ:' : 'Transaction Details:'}</h3>
      <ul>
        <li><strong>${language === 'bn' ? 'ধরন:' : 'Type:'}</strong> ${type}</li>
        <li><strong>${language === 'bn' ? 'পরিমাণ:' : 'Amount:'}</strong> ${formattedAmount}</li>
        <li><strong>${language === 'bn' ? 'বিবরণ:' : 'Description:'}</strong> ${description}</li>
        <li><strong>${language === 'bn' ? 'তারিখ:' : 'Date:'}</strong> ${formattedDate}</li>
      </ul>
      <hr style="border: none; border-top: 1px solid #eee;">
      <p>${language === 'bn' ? 'আপনার অংশগ্রহণ ও সমর্থনের জন্য ধন্যবাদ।' : 'Thank you for your involvement and support.'}</p>
      <p>${language === 'bn' ? 'বিনীত,<br><strong>সেবা সংগঠন দল</strong>' : 'Sincerely,<br><strong>The Seva Sangathan Team</strong>'}</p>
    </div>
  `;
  
  if (!resend || !process.env.RESEND_FROM_EMAIL) {
    console.error('Resend is not configured. Skipping email sending and logging to console instead.');
    logEmailToConsole({to, subject, htmlBody});
    return;
  }

  try {
    await resend.emails.send({
      to,
      from: process.env.RESEND_FROM_EMAIL,
      subject,
      html: htmlBody,
    });
    console.log(`Email sent successfully to ${Array.isArray(to) ? to.join(',') : to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

type WelcomeEmailPayload = {
    to: string;
    member: Omit<Member, 'id' | 'avatar' | 'contributions'>;
    language: 'en' | 'bn';
}

export async function sendWelcomeEmail({ to, member, language }: WelcomeEmailPayload) {
    const subject = language === 'bn' ? 'সেবা সংগঠনে স্বাগতম' : 'Welcome to Seva Sangathan';

    const htmlBody = `
    <div style="font-family: sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">${language === 'bn' ? `স্বাগতম, ${member.name}!` : `Welcome, ${member.name}!`}</h2>
      <p>${language === 'bn' ? 'সেবা সংগঠনে আপনার নিবন্ধনের জন্য ধন্যবাদ।' : 'Thank you for registering with Seva Sangathan.'}</p>
      <p>${language === 'bn' ? 'আপনার সদস্যপদ অনুরোধ পর্যালোচনা করা হচ্ছে। অনুমোদনের পরে আপনাকে অবহিত করা হবে।' : 'Your membership request is under review. You will be notified upon approval.'}</p>
      <p>${language === 'bn' ? 'আপনার অংশগ্রহণ ও সমর্থনের জন্য ধন্যবাদ।' : 'Thank you for your involvement and support.'}</p>
      <p>${language === 'bn' ? 'বিনীত,<br><strong>সেবা সংগঠন দল</strong>' : 'Sincerely,<br><strong>The Seva Sangathan Team</strong>'}</p>
    </div>
  `;

  if (!resend || !process.env.RESEND_FROM_EMAIL) {
    console.error('Resend is not configured. Skipping email sending and logging to console instead.');
    logEmailToConsole({to, subject, htmlBody});
    return;
  }
  
  try {
    await resend.emails.send({
      to,
      from: process.env.RESEND_FROM_EMAIL,
      subject,
      html: htmlBody,
    });
    console.log(`Welcome email sent successfully to ${to}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}


function logEmailToConsole({ to, subject, htmlBody }: { to: string | string[], subject: string, htmlBody: string }) {
    console.log('--- Mock Email Sending ---');
    console.log('This is a placeholder. No real email has been sent because Resend is not configured.');
    console.log(`To: ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: (HTML content)`);
    console.log('--------------------------');
}
