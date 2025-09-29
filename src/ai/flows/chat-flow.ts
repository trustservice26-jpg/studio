'use server';
/**
 * @fileOverview An AI chatbot flow to assist members.
 *
 * - chat - A function that handles the chat conversation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Member, Transaction } from '@/lib/types';
import type { ChatInput } from './chat-types';
import { ChatInputSchema } from './chat-types';

// Tool: Get Member List
const getMemberList = ai.defineTool(
  {
    name: 'getMemberList',
    description: 'Returns a list of all member names in the organization.',
    inputSchema: z.object({}),
    outputSchema: z.object({
      members: z.array(z.string()).describe('A list of member names.')
    }),
  },
  async () => {
    console.log('Tool: getMemberList called');
    const membersCol = collection(db, 'members');
    const memberSnapshot = await getDocs(membersCol);
    const members = memberSnapshot.docs.map(doc => doc.data() as Member);
    return { members: members.map(m => m.name) };
  }
);


// Tool: Get Member Transaction History
const getMemberTransactionHistory = ai.defineTool(
  {
    name: 'getMemberTransactionHistory',
    description: "Returns a member's donation transaction history.",
    inputSchema: z.object({
      memberName: z.string().describe('The name of the member to get transaction history for.'),
    }),
    outputSchema: z.object({
      history: z.array(z.object({
          date: z.string(),
          description: z.string(),
          amount: z.number(),
      })).optional(),
      error: z.string().optional(),
    }),
  },
  async ({ memberName }) => {
    console.log(`Tool: getMemberTransactionHistory called for ${memberName}`);
    const transactionsCol = collection(db, 'transactions');
    const transactionSnapshot = await getDocs(transactionsCol);
    const allTransactions = transactionSnapshot.docs.map(doc => doc.data() as Transaction);
    
    const memberHistory = allTransactions
      .filter(tx => tx.type === 'donation' && tx.memberName && tx.memberName.toLowerCase() === memberName.toLowerCase())
      .map(tx => ({ date: tx.date, description: tx.description, amount: tx.amount }));

    if (memberHistory.length > 0) {
      return { history: memberHistory };
    }
    
    // Check if member exists
    const membersCol = collection(db, 'members');
    const memberSnapshot = await getDocs(membersCol);
    const memberExists = memberSnapshot.docs.some(doc => (doc.data() as Member).name.toLowerCase() === memberName.toLowerCase());
    
    if (memberExists) {
        return { error: `No transaction history found for ${memberName}.` };
    } else {
        return { error: `Member "${memberName}" not found.` };
    }
  }
);


// Tool: Prepare Member PDF Download
const prepareMemberPdfDownload = ai.defineTool(
  {
    name: 'prepareMemberPdfDownload',
    description: 'Prepares a member information PDF for download.',
    inputSchema: z.object({
        memberName: z.string().describe('The name of the member whose PDF should be downloaded.'),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        memberName: z.string(),
        error: z.string().optional(),
    }),
  },
  async ({ memberName }) => {
    console.log(`Tool: prepareMemberPdfDownload called for ${memberName}`);
    const membersCol = collection(db, 'members');
    const memberSnapshot = await getDocs(membersCol);
    const memberExists = memberSnapshot.docs.some(doc => (doc.data() as Member).name.toLowerCase() === memberName.toLowerCase());

    if (memberExists) {
      return { success: true, memberName };
    }
    return { success: false, memberName, error: `Member "${memberName}" not found.` };
  }
);


// Tool: Prepare Financial Statement Download
const prepareFinancialStatementDownload = ai.defineTool(
    {
        name: 'prepareFinancialStatementDownload',
        description: 'Prepares the full financial statement PDF for download.',
        inputSchema: z.object({}),
        outputSchema: z.object({
            success: z.boolean(),
        }),
    },
    async () => {
        console.log('Tool: prepareFinancialStatementDownload called');
        return { success: true };
    }
);


// The main chat prompt
const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  system: `You are a friendly and helpful AI assistant for the "Seva Sangathan" organization. Your goal is to assist members with their questions.

You have access to the following tools:
- getMemberList: To get a list of all members.
- getMemberTransactionHistory: To see a specific member's donation history.
- prepareMemberPdfDownload: To help a user download a specific member's information PDF.
- prepareFinancialStatementDownload: To help a user download the organization's full financial statement.

IMPORTANT RULES:
- When asked for a member's PDF, ALWAYS confirm the member's name. If the user provides a name, use the 'prepareMemberPdfDownload' tool.
- When asked for a transaction statement or financial statement, use the 'prepareFinancialStatementDownload' tool.
- When asked for a member's transaction history, you MUST first ask for the member's name. Once they provide a name, use the 'getMemberTransactionHistory' tool.
- If a tool returns an error (e.g., member not found), relay that information politely to the user.
- Keep your responses concise and to the point.
- Do not make up information. Only use the information provided by the tools.
`,
  tools: [getMemberList, getMemberTransactionHistory, prepareMemberPdfDownload, prepareFinancialStatementDownload],
});


// The main chat flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.any(),
  },
  async (input) => {
    const { history, message } = input;
    
    const llmResponse = await chatPrompt({
        history: history,
        message: message,
    });
    
    return llmResponse.output;
  }
);


export async function chat(input: ChatInput): Promise<any> {
    return chatFlow(input);
}
