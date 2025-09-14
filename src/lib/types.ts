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

export type Notice = {
  id: string;
  message: string;
  date: string; // ISO string
}

export type Donation = {
  id: string;
  amount: number;
  date: string; // ISO string
  type: 'donation' | 'withdrawal';
  description: string;
  memberName?: string;
};


export type UserRole = 'admin' | 'member';
