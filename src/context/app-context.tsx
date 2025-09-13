'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Member, Donation, UserRole, Notice } from '@/lib/types';
import { initialMembers, initialDonations, initialNotices } from '@/lib/data';
import { useToast } from "@/hooks/use-toast"


interface AppContextType {
  members: Member[];
  donations: Donation[];
  notices: Notice[];
  totalWithdrawals: number;
  userRole: UserRole;
  language: 'en' | 'bn';
  addMember: (member: Omit<Member, 'id' | 'avatar' | 'joinDate'>) => void;
  deleteMember: (memberId: string) => void;
  addNotice: (message: string) => void;
  setUserRole: (role: UserRole) => void;
  setLanguage: (language: 'en' | 'bn') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [totalWithdrawals, setTotalWithdrawals] = useState(50000); // Mock data
  const { toast } = useToast();
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as 'en' | 'bn' | null;
      if (savedLang) {
        setLanguage(savedLang);
      }
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'bn') => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

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
    language,
    setLanguage: handleSetLanguage,
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
