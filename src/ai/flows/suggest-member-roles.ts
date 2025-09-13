'use server';

/**
 * @fileOverview A role suggestion AI agent.
 *
 * - suggestMemberRoles - A function that suggests roles for a member.
 * - SuggestMemberRolesInput - The input type for the suggestMemberRoles function.
 * - SuggestMemberRolesOutput - The return type for the suggestMemberRoles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMemberRolesInputSchema = z.object({
  memberContributions: z
    .string()
    .describe('A detailed description of the members past contributions and involvement in the organization.'),
});
export type SuggestMemberRolesInput = z.infer<typeof SuggestMemberRolesInputSchema>;

const SuggestMemberRolesOutputSchema = z.object({
  suggestedRoles: z.array(z.string()).describe('An array of suggested roles for the member.'),
  reasoning: z.string().describe('The reasoning behind the suggested roles.'),
});
export type SuggestMemberRolesOutput = z.infer<typeof SuggestMemberRolesOutputSchema>;

export async function suggestMemberRoles(input: SuggestMemberRolesInput): Promise<SuggestMemberRolesOutput> {
  return suggestMemberRolesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMemberRolesPrompt',
  input: {schema: SuggestMemberRolesInputSchema},
  output: {schema: SuggestMemberRolesOutputSchema},
  prompt: `You are an expert in non-profit organization management. Based on the member's contributions and involvement, suggest suitable roles for them within the organization.

Member Contributions: {{{memberContributions}}}

Provide an array of suggested roles and reasoning behind each suggestion. Consider roles such as:
- Event Coordinator
- Fundraising Manager
- Volunteer Coordinator
- Communications Officer
- Treasurer
- Secretary
- Board Member
- Advisor`,
});

const suggestMemberRolesFlow = ai.defineFlow(
  {
    name: 'suggestMemberRolesFlow',
    inputSchema: SuggestMemberRolesInputSchema,
    outputSchema: SuggestMemberRolesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
