
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

export const initialTransactions: Transaction[] = [];
