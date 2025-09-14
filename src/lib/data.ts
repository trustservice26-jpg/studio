import type { Member, Notice, Transaction } from './types';

export const initialMembers: Member[] = [];

export const initialNotices: Notice[] = [
  {
    id: 'n1',
    message: 'Monthly meeting on the first Friday of every month. Your participation is highly encouraged!',
    date: '2024-07-01T10:00:00.000Z'
  },
  {
    id: 'n2',
    message: 'The annual charity gala is scheduled for September 15th. Volunteers are needed!',
    date: '2024-07-10T14:30:00.000Z'
  },
];

export const initialTransactions: Transaction[] = [
  { id: 'd1', amount: 50000, date: '2024-06-01T00:00:00.000Z', type: 'donation', description: 'Initial funding', memberName: 'Anika Sharma' },
  { id: 'd2', amount: 25000, date: '2024-06-15T00:00:00.000Z', type: 'donation', description: 'Monthly contribution', memberName: 'Rohan Chowdhury' },
  { id: 'd3', amount: 10000, date: '2024-06-20T00:00:00.000Z', type: 'withdrawal', description: 'Office supplies' },
  { id: 'd4', amount: 75000, date: '2024-07-05T00:00:00.000Z', type: 'donation', description: 'Gala sponsorship', memberName: 'David Biswas' },
  { id: 'd5', amount: 5000, date: '2024-07-12T00:00:00.000Z', type: 'withdrawal', description: 'Event expenses' },
];
