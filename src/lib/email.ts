
import type { Transaction } from './types';

type EmailPayload = {
  to: string | string[];
  transaction: Transaction;
};

/**
 * A placeholder function to send transaction-related emails.
 * 
 * IMPORTANT: This is a mock implementation. To send real emails, you must
 * integrate this function with an email service provider like SendGrid,
 * Mailgun, or AWS SES. You will need to replace the console.log statement
 * with the actual email sending logic using the SDK of your chosen provider.
 * 
 * @param {EmailPayload} payload - The email payload.
 * @param {string|string[]} payload.to - The recipient's email address or an array of addresses.
 * @param {Transaction} payload.transaction - The transaction details.
 */
export async function sendTransactionEmail({ to, transaction }: EmailPayload) {
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

  console.log('--- Sending Email ---');
  console.log(`To: ${Array.isArray(to) ? to.join(', ') : to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log('---------------------');
  
  // TODO: Replace the console.log above with your actual email sending logic.
  // Example using a fictional `emailService`:
  /*
  try {
    await emailService.send({
      to,
      subject,
      html: body.replace(/\n/g, '<br>'),
    });
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
  */
}
