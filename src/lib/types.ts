export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive';
  joinDate: string; // ISO string
  contributions: string;
};

export type Donation = {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string; // ISO string
};

export type UserRole = 'admin' | 'member';
