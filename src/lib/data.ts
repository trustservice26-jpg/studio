import type { Member, Notice, Transaction } from './types';

export const initialMembers: Member[] = [
  {
    id: 'm1',
    name: 'Anika Sharma',
    email: 'anika.sharma@example.com',
    phone: '+8801712345678',
    avatar: 'https://picsum.photos/seed/avatar1/200/200',
    status: 'active',
    joinDate: '2022-08-15T00:00:00.000Z',
    contributions: 'Organized the annual charity gala, which raised over 500,000 Taka. Led a team of 10 volunteers and secured sponsorships from 5 local businesses. Also manages our social media presence.',
  },
  {
    id: 'm2',
    name: 'Rohan Chowdhury',
    email: 'rohan.c@example.com',
    phone: '+8801812345679',
    avatar: 'https://picsum.photos/seed/avatar2/200/200',
    status: 'active',
    joinDate: '2023-01-20T00:00:00.000Z',
    contributions: 'Developed and maintains the organization\'s website. Regularly volunteers for weekend food drives. Helps with IT support and technical issues for the team.',
  },
  {
    id: 'm3',
    name: 'Fatima Ahmed',
    email: 'fatima.a@example.com',
    phone: '+8801912345680',
    avatar: 'https://picsum.photos/seed/avatar3/200/200',
    status: 'inactive',
    joinDate: '2021-11-05T00:00:00.000Z',
    contributions: 'Previously served as the organization\'s treasurer for two years, managing budgets and financial reporting. Was instrumental in setting up our initial accounting system.',
  },
  {
    id: 'm4',
    name: 'David Biswas',
    email: 'david.biswas@example.com',
    phone: '+8801612345681',
    avatar: 'https://picsum.photos/seed/avatar4/200/200',
    status: 'active',
    joinDate: '2023-05-10T00:00:00.000Z',
    contributions: 'A key member of the fundraising team. Actively participates in grant writing and donor outreach. His efforts have secured three major grants in the last year.',
  },
  {
    id: 'm5',
    name: 'Sadia Islam',
    email: 'sadia.i@example.com',
    phone: '+8801512345682',
    avatar: 'https://picsum.photos/seed/avatar5/200/200',
    status: 'active',
    joinDate: '2023-09-01T00:00:00.000Z',
    contributions: 'Coordinates our volunteer program, including recruitment, training, and scheduling for over 50 volunteers. Ensures all events are adequately staffed.',
  },
];

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
