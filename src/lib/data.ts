
import type { Member, Notice, Transaction } from './types';

export const initialMembers: Member[] = [];

export const initialNotices: Notice[] = [
  {
    id: 'n1-unique-id',
    message: 'Monthly meeting on the first Friday of every month. Your participation is highly encouraged!',
    date: '2024-07-01T10:00:00.000Z'
  },
  {
    id: 'n2-another-unique-id',
    message: 'Annual general meeting will be held on August 15th. All members are requested to attend.',
    date: '2024-07-15T12:00:00.000Z'
  }
];

export const initialTransactions: Transaction[] = [
  { id: 'd1-unique', amount: 50000, date: '2024-06-01T00:00:00.000Z', type: 'donation', description: 'Initial funding', memberName: 'Anika Sharma' },
  { id: 'd2-unique', amount: 25000, date: '2024-06-15T00:00:00.000Z', type: 'donation', description: 'Monthly contribution', memberName: 'Rohan Chowdhury' },
  { id: 'd3-unique', amount: 10000, date: '2024-06-20T00:00:00.000Z', type: 'withdrawal', description: 'Office supplies' },
  { id: 'd4-unique', amount: 75000, date: '2024-07-05T00:00:00.000Z', type: 'donation', description: 'Gala sponsorship', memberName: 'David Biswas' },
  { id: 'd5-unique', amount: 5000, date: '2024-07-12T00:00:00.000Z', type: 'withdrawal', description: 'Event expenses' },
];
