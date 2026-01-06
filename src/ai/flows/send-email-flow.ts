
'use server';
/**
 * @fileOverview An email sending flow.
 *
 * - sendEmail - A function that handles sending an email.
 * - SendEmailInput - The input type for the sendEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SendEmailInputSchema = z.object({
  to: z.string(),
  from: z.string(),
  subject: z.string(),
  name: z.string(),
  message: z.string(),
  language: z.enum(['en', 'bn']),
});

export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

export async function sendEmail(input: SendEmailInput): Promise<void> {
  await sendEmailFlow(input);
}

const sendEmailFlow = ai.defineFlow(
  {
    name: 'sendEmailFlow',
    inputSchema: SendEmailInputSchema,
    outputSchema: z.void(),
  },
  async ({ to, from, subject, name, message, language }) => {
    const isBn = language === 'bn';

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #1a73e8;">${isBn ? 'আপনার বার্তার জন্য ধন্যবাদ!' : 'Thank you for your message!'}</h2>
            <p>${isBn ? `প্রিয় ${name},` : `Dear ${name},`}</p>
            <p>${isBn ? 'আমরা আপনার বার্তাটি পেয়েছি এবং শীঘ্রই আপনার সাথে যোগাযোগ করব।' : 'We have received your message and will get back to you shortly.'}</p>
            <div style="background-color: #f9f9f9; border-left: 4px solid #1a73e8; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-style: italic;"><strong>${isBn ? 'আপনার বার্তা:' : 'Your message:'}</strong></p>
                <p style="margin: 10px 0 0 0;">${message}</p>
            </div>
            <p>${isBn ? 'শুভেচ্ছান্তে,' : 'Best regards,'}</p>
            <p><strong>${isBn ? 'হাদিয়া দল' : 'The Hadiya Team'}</strong></p>
        </div>
    `;

    try {
      await resend.emails.send({
        from,
        to,
        subject,
        html: htmlContent,
      });
    } catch (error) {
      console.error('Email sending failed', error);
      // Optional: Re-throw the error to let the caller handle it
      throw new Error('Failed to send email.');
    }
  }
);
