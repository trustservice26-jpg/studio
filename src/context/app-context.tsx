'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Member, UserRole, Notice, Transaction } from '@/lib/types';
import { initialMembers, initialNotices, initialTransactions } from '@/lib/data';
import { useToast } from "@/hooks/use-toast"


interface AppContextType {
  members: Member[];
  notices: Notice[];
  transactions: Transaction[];
  userRole: UserRole;
  language: 'en' | 'bn';
  currentFunds: number;
  totalDonations: number;
  totalWithdrawals: number;
  addMember: (member: Omit<Member, 'id' | 'avatar' | 'joinDate' | 'contributions'>) => void;
  deleteMember: (memberId: string) => void;
  toggleMemberStatus: (memberId: string) => void;
  addNotice: (message: string) => void;
  deleteNotice: (noticeId: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  clearAllTransactions: () => void;
  setUserRole: (role: UserRole) => void;
  setLanguage: (language: 'en' | 'bn') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

async function seedInitialData() {
  const collections = {
    members: initialMembers,
    notices: initialNotices,
    transactions: initialTransactions,
  };

  const batch = writeBatch(db);

  for (const [colName, data] of Object.entries(collections)) {
    const colRef = collection(db, colName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log(`Seeding ${colName}...`);
      data.forEach((item) => {
        const docRef = doc(colRef, item.id);
        batch.set(docRef, item);
      });
    }
  }

  await batch.commit();
}


export function AppProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('member');
  const { toast } = useToast();
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    seedInitialData();

    const qMembers = query(collection(db, 'members'), orderBy('joinDate', 'desc'));
    const unsubMembers = onSnapshot(qMembers, (snapshot) => {
      const membersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Member));
      setMembers(membersData);
    });

    const qNotices = query(collection(db, 'notices'), orderBy('date', 'desc'));
    const unsubNotices = onSnapshot(qNotices, (snapshot) => {
      const noticesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Notice));
      setNotices(noticesData);
    });

    const qTransactions = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
      const transactionsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(transactionsData);
    });

    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as 'en' | 'bn' | null;
      if (savedLang) {
        setLanguage(savedLang);
      }
    }

    return () => {
      unsubMembers();
      unsubNotices();
      unsubTransactions();
    };
  }, []);

  const { currentFunds, totalDonations, totalWithdrawals } = useMemo(() => {
    const totalDonations = transactions
      .filter(d => d.type === 'donation')
      .reduce((sum, d) => sum + d.amount, 0);
    const totalWithdrawals = transactions
      .filter(d => d.type === 'withdrawal')
      .reduce((sum, d) => sum + d.amount, 0);
    const currentFunds = totalDonations - totalWithdrawals;
    return { currentFunds, totalDonations, totalWithdrawals };
  }, [transactions]);

  const handleSetLanguage = (lang: 'en' | 'bn') => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const addMember = async (memberData: Omit<Member, 'id' | 'avatar' | 'joinDate' | 'contributions'>) => {
    const newMember: Omit<Member, 'id'> = {
      ...memberData,
      joinDate: new Date().toISOString(),
      avatar: `https://picsum.photos/seed/avatar${Math.random()}/200/200`,
      contributions: '',
    };
    try {
      await addDoc(collection(db, 'members'), newMember);
      toast({
        title: language === 'bn' ? "সদস্য যোগ করা হয়েছে" : "Member Added",
        description: language === 'bn' ? `${memberData.name} সফলভাবে যোগ করা হয়েছে।` : `${memberData.name} has been successfully added.`,
      })
    } catch (e) {
      console.error("Error adding member: ", e);
    }
  };

  const deleteMember = async (memberId: string) => {
    try {
      await deleteDoc(doc(db, 'members', memberId));
      toast({
        variant: 'destructive',
        title: language === 'bn' ? "সদস্য মুছে ফেলা হয়েছে" : "Member Deleted",
        description: language === 'bn' ? `সদস্যকে সংগঠন থেকে মুছে ফেলা হয়েছে।` : `The member has been removed from the organization.`,
      })
    } catch(e) {
        console.error("Error deleting member: ", e)
    }
  };
  
  const toggleMemberStatus = async (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    try {
        const memberRef = doc(db, 'members', memberId);
        await updateDoc(memberRef, {
            status: member.status === 'active' ? 'inactive' : 'active'
        });
        toast({
            title: language === 'bn' ? "সদস্যের অবস্থা আপডেট করা হয়েছে" : "Member Status Updated",
            description: language === 'bn' ? `সদস্যের অবস্থা পরিবর্তন করা হয়েছে।` : `The member's status has been changed.`,
        });
    } catch(e) {
        console.error("Error updating member status: ", e);
    }
  };

  const addNotice = async (message: string) => {
    const newNotice: Omit<Notice, 'id'> = {
      message,
      date: new Date().toISOString(),
    };
    try {
        await addDoc(collection(db, 'notices'), newNotice);
        toast({
          title: language === 'bn' ? "নোটিশ পোস্ট করা হয়েছে" : "Notice Posted",
          description: language === 'bn' ? "নতুন নোটিশ এখন সকল সদস্যদের কাছে দৃশ্যমান।" : "The new notice is now visible to all members.",
        });
    } catch (e) {
        console.error("Error adding notice: ", e);
    }
  };

  const deleteNotice = async (noticeId: string) => {
    try {
        await deleteDoc(doc(db, "notices", noticeId));
        toast({
          variant: 'destructive',
          title: language === 'bn' ? "নোটিশ মুছে ফেলা হয়েছে" : "Notice Deleted",
          description: language === 'bn' ? "নোটিশটি মুছে ফেলা হয়েছে।" : "The notice has been removed.",
        });
    } catch (e) {
        console.error("Error deleting notice: ", e);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Omit<Transaction, 'id'> = {
      ...transaction,
      date: new Date().toISOString(),
      description: transaction.description || (transaction.type === 'donation' ? 'Donation' : 'Withdrawal'),
    };
    try {
        await addDoc(collection(db, "transactions"), newTransaction);
        toast({
            title: language === 'bn' ? 'লেনদেন সফল' : 'Transaction Successful',
            description: language === 'bn' ? `একটি নতুন ${transaction.type === 'donation' ? 'অনুদান' : 'উত্তোলন'} রেকর্ড করা হয়েছে।` : `A new ${transaction.type} has been recorded.`,
        });
    } catch (e) {
        console.error("Error adding transaction: ", e);
    }
  }

  const clearAllTransactions = async () => {
    const batch = writeBatch(db);
    try {
        const querySnapshot = await getDocs(collection(db, 'transactions'));
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        toast({
            variant: 'destructive',
            title: language === 'bn' ? 'সমস্ত লেনদেন মুছে ফেলা হয়েছে' : 'All Transactions Cleared',
            description: language === 'bn' ? 'সমস্ত আর্থিক রেকর্ড স্থায়ীভাবে মুছে ফেলা হয়েছে।' : 'All financial records have been permanently deleted.',
        });
    } catch (error) {
        console.error('Error clearing transactions:', error);
        toast({
            variant: 'destructive',
            title: language === 'bn' ? 'ত্রুটি' : 'Error',
            description: language === 'bn' ? 'লেনদেন মোছার সময় একটি ত্রুটি ঘটেছে।' : 'An error occurred while clearing transactions.',
        });
    }
};

  const contextValue = {
    members,
    notices,
    transactions,
    userRole,
    addMember,
    deleteMember,
    toggleMemberStatus,
    addNotice,
    deleteNotice,
    addTransaction,
    clearAllTransactions,
    setUserRole,
    language,
    setLanguage: handleSetLanguage,
    currentFunds,
    totalDonations,
    totalWithdrawals,
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
