/**
 * @fileOverview Types and schemas for the AI chat flow.
 */

import { z } from 'genkit';

export const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.union([
      z.object({ text: z.string() }),
      z.object({ toolResponse: z.any() })
    ]))
  })).describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  reply: z.string().describe('The AI model\'s reply to the user.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
