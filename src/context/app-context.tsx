
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
  FirestoreError,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Member, UserRole, Notice, Transaction } from '@/lib/types';
import { initialMembers, initialNotices, initialTransactions } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { sendTransactionEmail } from '@/lib/email';


interface AppContextType {
  members: Member[];
  notices: Notice[];
  transactions: Transaction[];
  user: Member | null;
  language: 'en' | 'bn';
  currentFunds: number;
  totalDonations: number;
  totalWithdrawals: number;
  addMember: (member: Omit<Member, 'id' | 'avatar' | 'joinDate' | 'contributions' | 'memberId'>, fromRegistration?: boolean) => Promise<Member | null>;
  deleteMember: (memberId: string) => void;
  toggleMemberStatus: (memberId: string) => void;
  updateMemberPermissions: (memberId: string, permissions: Member['permissions'], role?: Member['role']) => void;
  addNotice: (message: string) => void;
  deleteNotice: (noticeId: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'> & { sendEmail?: boolean }) => void;
  deleteTransaction: (transactionId: string) => void;
  clearAllTransactions: () => void;
  clearAllData: () => void;
  setUser: (user: Member | null) => void;
  setLanguage: (language: 'en' | 'bn') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function seedInitialData() {
    const hasSeeded = localStorage.getItem('hasSeeded');
    if (hasSeeded === 'true') {
      return;
    }
  
    const collections = {
      members: initialMembers,
      notices: initialNotices,
      transactions: initialTransactions,
    };
  
    const batch = writeBatch(db);
  
    for (const [colName, data] of Object.entries(collections)) {
      const colRef = collection(db, colName);
      console.log(`Seeding ${colName}...`);
      data.forEach((item) => {
        const docRef = doc(colRef);
        batch.set(docRef, item);
      });
    }
  
    batch.commit().then(() => {
        localStorage.setItem('hasSeeded', 'true');
    }).catch(e => console.error("Error seeding data:", e));
  }

function generateMemberId(existingMembers: Member[]): string {
    const existingIds = existingMembers.map(m => parseInt(m.memberId, 10)).filter(id => !isNaN(id));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 1000;
    const newId = maxId + 1;
    return newId.toString().padStart(4, '0');
}


export function AppProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<Member | null>(null);
  const { toast } = useToast();
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  const handleFirestoreError = (error: FirestoreError) => {
    console.error("Firestore Error:", error);
    if (error.code === 'permission-denied') {
      toast({
        variant: 'destructive',
        title: 'Firestore Permission Denied',
        description: 'Your app does not have permission to access the database. Please go to the Firestore "Rules" tab in your Firebase Console and set them to allow reads and writes.',
        duration: 15000, 
      });
    }
  };

  useEffect(() => {
    async function setup() {
        const hasSeeded = localStorage.getItem('hasSeeded');
        if (!hasSeeded) {
            const collections = {
                members: initialMembers,
                notices: initialNotices,
                transactions: initialTransactions,
            };
        
            const batch = writeBatch(db);
            let shouldCommit = false;
        
            for (const [colName, data] of Object.entries(collections)) {
                const colRef = collection(db, colName);
                const snapshot = await getDocs(colRef);
                if (snapshot.empty) {
                console.log(`Seeding ${colName}...`);
                shouldCommit = true;
                data.forEach((item) => {
                    const docRef = doc(colRef);
                    batch.set(docRef, item);
                });
                }
            }
        
            if (shouldCommit) {
                await batch.commit();
                localStorage.setItem('hasSeeded', 'true');
            } else if (!hasSeeded) {
                // if db is not empty but seeding has not been marked, mark it.
                 localStorage.setItem('hasSeeded', 'true');
            }
        }

        const qMembers = query(collection(db, 'members'), orderBy('joinDate', 'desc'));
        const unsubMembers = onSnapshot(qMembers, (snapshot) => {
          const membersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Member));
          setMembers(membersData);
        }, handleFirestoreError);

        const qNotices = query(collection(db, 'notices'), orderBy('date', 'desc'));
        const unsubNotices = onSnapshot(qNotices, (snapshot) => {
          const noticesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Notice));
          setNotices(noticesData);
        }, handleFirestoreError);

        const qTransactions = query(collection(db, 'transactions'), orderBy('date', 'desc'));
        const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
          const transactionsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Transaction));
          setTransactions(transactionsData);
        }, handleFirestoreError);

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
    }

    setup();
  }, []);
  
  useEffect(() => {
    if (user) {
        const latestUserData = members.find(m => m.id === user.id);
        if (latestUserData) {
            setUser(latestUserData);
        }
    }
  }, [members, user]);

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

  const addMember = async (memberData: Partial<Omit<Member, 'id' | 'avatar' | 'joinDate' | 'contributions' | 'memberId'>>, fromRegistration = false): Promise<Member | null> => {
    const newMember: Omit<Member, 'id'> = {
      memberId: generateMemberId(members),
      name: memberData.name || '',
      phone: memberData.phone || '',
      email: memberData.email,
      status: fromRegistration ? 'inactive' : (memberData.status || 'active'),
      joinDate: new Date().toISOString(),
      avatar: '',
      contributions: '',
      dob: memberData.dob,
      fatherName: memberData.fatherName,
      motherName: memberData.motherName,
      nid: memberData.nid,
      address: memberData.address,
    };
    try {
      const docRef = await addDoc(collection(db, 'members'), newMember);
      toast({
        title: language === 'bn' ? "সদস্য যোগ করা হয়েছে" : "Member Added",
        description: fromRegistration 
          ? (language === 'bn' ? 'আপনার নিবন্ধন সফল হয়েছে। অনুমোদনের জন্য অপেক্ষা করুন।': 'Your registration is successful. Please wait for approval.')
          : (language === 'bn' ? `${memberData.name} সফলভাবে যোগ করা হয়েছে।` : `${memberData.name} has been successfully added.`),
      });
      return { ...newMember, id: docRef.id };

    } catch (e) {
      handleFirestoreError(e as FirestoreError);
      return null;
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
        handleFirestoreError(e as FirestoreError);
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
        handleFirestoreError(e as FirestoreError);
    }
  };
  
  const updateMemberPermissions = async (memberId: string, permissions: Member['permissions'], role?: Member['role']) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    try {
      const memberRef = doc(db, 'members', memberId);
      const updateData: { permissions: Member['permissions']; role?: Member['role'] } = { permissions };
      
      if (role) {
        updateData.role = role;
      }
      
      await updateDoc(memberRef, updateData);
      toast({
        title: language === 'bn' ? 'অনুমতি আপডেট হয়েছে' : 'Permissions Updated',
        description: language === 'bn' ? `${member.name}-এর অনুমতি সফলভাবে আপডেট করা হয়েছে।` : `Successfully updated permissions for ${member.name}.`,
      });
    } catch (e) {
      handleFirestoreError(e as FirestoreError);
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
        handleFirestoreError(e as FirestoreError);
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
        handleFirestoreError(e as FirestoreError);
    }
  };

 const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'date'> & { sendEmail?: boolean, memberId?: string }) => {
    const { sendEmail = false, memberId, ...transaction } = transactionData;
    
    const newTransaction: Omit<Transaction, 'id'> = {
      ...transaction,
      date: new Date().toISOString(),
      description: transaction.description || (transaction.type === 'donation' ? (language === 'bn' ? 'অনুদান' : 'Donation') : (language === 'bn' ? 'উত্তোলন' : 'Withdrawal')),
    };

    try {
      const docRef = await addDoc(collection(db, 'transactions'), newTransaction);
      const fullTransaction: Transaction = { ...newTransaction, id: docRef.id };
      
      toast({
        title: language === 'bn' ? 'লেনদেন সফল' : 'Transaction Successful',
        description: language === 'bn' ? `একটি নতুন ${transaction.type === 'donation' ? 'অনুদান' : 'উত্তোলন'} রেকর্ড করা হয়েছে।` : `A new ${transaction.type} has been recorded.`,
      });
      
      if (sendEmail) {
        if (fullTransaction.type === 'donation' && memberId && memberId !== 'anonymous' && memberId !== 'other') {
          const member = members.find(m => m.id === memberId);
          if (member && member.email) {
            await sendTransactionEmail({
              to: member.email,
              transaction: fullTransaction,
              language
            });
          }
        }
      }

    } catch (e) {
      handleFirestoreError(e as FirestoreError);
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', transactionId));
      toast({
        variant: 'destructive',
        title: language === 'bn' ? 'লেনদেন মুছে ফেলা হয়েছে' : 'Transaction Deleted',
        description: language === 'bn' ? 'লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে।' : 'The transaction has been successfully deleted.',
      });
    } catch (error) {
        handleFirestoreError(error as FirestoreError);
    }
  };

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
        handleFirestoreError(error as FirestoreError);
    }
};

  const clearAllData = async () => {
    const batch = writeBatch(db);
    const collectionsToDelete = ['members', 'notices', 'transactions'];
    try {
      for (const colName of collectionsToDelete) {
        const querySnapshot = await getDocs(collection(db, colName));
        querySnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
      }
      await batch.commit();
      toast({
        variant: 'destructive',
        title: language === 'bn' ? 'সমস্ত ডেটা মুছে ফেলা হয়েছে' : 'All Application Data Cleared',
        description: language === 'bn' ? 'সমস্ত সদস্য, নোটিশ এবং লেনদেন স্থায়ীভাবে মুছে ফেলা হয়েছে।' : 'All members, notices, and transactions have been permanently deleted.',
      });
    } catch (error) {
      handleFirestoreError(error as FirestoreError);
    }
  };

  const contextValue = {
    members,
    notices,
    transactions,
    user,
    addMember,
    deleteMember,
    toggleMemberStatus,
    updateMemberPermissions,
    addNotice,
    deleteNotice,
    addTransaction,
    deleteTransaction,
    clearAllTransactions,
    clearAllData,
    setUser,
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
