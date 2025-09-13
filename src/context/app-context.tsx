'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Member, Donation, UserRole } from '@/lib/types';
import { initialMembers, initialDonations } from '@/lib/data';
import { useToast } from "@/hooks/use-toast"


interface AppContextType {
  members: Member[];
  donations: Donation[];
  userRole: UserRole;
  addMember: (member: Omit<Member, 'id' | 'avatar' | 'joinDate'>) => void;
  setUserRole: (role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [userRole, setUserRole] = useState<UserRole>('admin');
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

  const contextValue = {
    members,
    donations,
    userRole,
    addMember,
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
