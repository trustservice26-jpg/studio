export type Member = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar: string;
  status: 'active' | 'inactive';
  joinDate: string; // ISO string
  contributions: string;
  dob?: string;
  fatherName?: string;
  motherName?: string;
  nid?: string;
  address?: string;
  role?: 'moderator';
  permissions?: {
    canManageTransactions: boolean;
  };
};

export type Notice = {
  id: string;
  message: string;
  date: string; // ISO string
}

export type Transaction = {
  id: string;
  amount: number;
  date: string; // ISO string
  type: 'donation' | 'withdrawal';
  description: string;
  memberName?: string;
};


export type UserRole = 'admin' | 'moderator' | 'member';
