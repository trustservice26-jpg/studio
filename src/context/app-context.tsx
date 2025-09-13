'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Member, UserRole, Notice } from '@/lib/types';
import { initialMembers, initialNotices } from '@/lib/data';
import { useToast } from "@/hooks/use-toast"


interface AppContextType {
  members: Member[];
  notices: Notice[];
  userRole: UserRole;
  language: 'en' | 'bn';
  addMember: (member: Omit<Member, 'id' | 'avatar' | 'joinDate' | 'contributions'>) => void;
  deleteMember: (memberId: string) => void;
  toggleMemberStatus: (memberId: string) => void;
  addNotice: (message: string) => void;
  deleteNotice: (noticeId: string) => void;
  setUserRole: (role: UserRole) => void;
  setLanguage: (language: 'en' | 'bn') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [userRole, setUserRole] = useState<UserRole>('member');
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

  const addMember = (memberData: Omit<Member, 'id' | 'avatar' | 'joinDate' | 'contributions'>) => {
    const newMember: Member = {
      ...memberData,
      id: `m${members.length + 1}`,
      joinDate: new Date().toISOString(),
      avatar: `https://picsum.photos/seed/avatar${members.length + 1}/200/200`,
      contributions: '',
    };
    setMembers(prevMembers => [newMember, ...prevMembers]);
    toast({
      title: language === 'bn' ? "সদস্য যোগ করা হয়েছে" : "Member Added",
      description: language === 'bn' ? `${newMember.name} সফলভাবে যোগ করা হয়েছে।` : `${newMember.name} has been successfully added.`,
    })
  };

  const deleteMember = (memberId: string) => {
    setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
    toast({
      variant: 'destructive',
      title: language === 'bn' ? "সদস্য মুছে ফেলা হয়েছে" : "Member Deleted",
      description: language === 'bn' ? `সদস্যকে সংগঠন থেকে মুছে ফেলা হয়েছে।` : `The member has been removed from the organization.`,
    })
  };
  
  const toggleMemberStatus = (memberId: string) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === memberId
          ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
          : member
      )
    );
     toast({
      title: language === 'bn' ? "সদস্যের অবস্থা আপডেট করা হয়েছে" : "Member Status Updated",
      description: language === 'bn' ? `সদস্যের অবস্থা পরিবর্তন করা হয়েছে।` : `The member's status has been changed.`,
    })
  };

  const addNotice = (message: string) => {
    const newNotice: Notice = {
      id: `n${notices.length + 1}`,
      message,
      date: new Date().toISOString(),
    };
    setNotices(prevNotices => [newNotice, ...prevNotices]);
    toast({
      title: language === 'bn' ? "নোটিশ পোস্ট করা হয়েছে" : "Notice Posted",
      description: language === 'bn' ? "নতুন নোটিশ এখন সকল সদস্যদের কাছে দৃশ্যমান।" : "The new notice is now visible to all members.",
    });
  };

  const deleteNotice = (noticeId: string) => {
    setNotices(prevNotices => prevNotices.filter(notice => notice.id !== noticeId));
    toast({
      variant: 'destructive',
      title: language === 'bn' ? "নোটিশ মুছে ফেলা হয়েছে" : "Notice Deleted",
      description: language === 'bn' ? "নোটিশটি মুছে ফেলা হয়েছে।" : "The notice has been removed.",
    });
  };

  const contextValue = {
    members,
    notices,
    userRole,
    addMember,
    deleteMember,
    toggleMemberStatus,
    addNotice,
    deleteNotice,
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
