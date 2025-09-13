'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Member, Donation, UserRole, Notice } from '@/lib/types';
import { initialMembers, initialDonations, initialNotices } from '@/lib/data';
import { useToast } from "@/hooks/use-toast"


interface AppContextType {
  members: Member[];
  donations: Donation[];
  notices: Notice[];
  totalWithdrawals: number;
  userRole: UserRole;
  addMember: (member: Omit<Member, 'id' | 'avatar' | 'joinDate'>) => void;
  deleteMember: (memberId: string) => void;
  addNotice: (message: string) => void;
  setUserRole: (role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [totalWithdrawals, setTotalWithdrawals] = useState(50000); // Mock data
  const { toast } = useToast();

  const addMember = (memberData: Omit<Member, 'id' | 'avatar' | 'joinDate'>) => {
    const newMember: Member = {
      ...memberData,
      id: `m${members.length + 1}`,
      joinDate: new Date().toISOString(),
      avatar: `https://picsum.photos/seed/avatar${members.length + 1}/200/200`,
    };
    setMembers(prevMembers => [newMember, ...prevMembers]);
    toast({
      title: "Member Added",
      description: `${newMember.name} has been successfully added.`,
    })
  };

  const deleteMember = (memberId: string) => {
    setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
    toast({
      variant: 'destructive',
      title: "Member Deleted",
      description: `The member has been removed from the organization.`,
    })
  }

  const addNotice = (message: string) => {
    const newNotice: Notice = {
      id: `n${notices.length + 1}`,
      message,
      date: new Date().toISOString(),
    };
    setNotices(prevNotices => [newNotice, ...prevNotices]);
    toast({
      title: "Notice Posted",
      description: "The new notice is now visible to all members.",
    });
  }

  const contextValue = {
    members,
    donations,
    notices,
    totalWithdrawals,
    userRole,
    addMember,
    deleteMember,
    addNotice,
    setUserRole,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
