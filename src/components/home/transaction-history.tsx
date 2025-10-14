
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import type { Transaction } from '@/lib/types';

function DeleteTransactionDialog({ transaction, language, onDelete }: { transaction: Transaction; language: 'en' | 'bn'; onDelete: (id: string) => void; }) {
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleDelete = () => {
    if (password === 'ADMIN') {
      onDelete(transaction.id);
      setOpen(false);
      setPassword('');
      setError('');
    } else {
      setError(language === 'bn' ? 'ভুল পাসওয়ার্ড।' : 'Incorrect password.');
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setPassword('');
      setError('');
    }
    setOpen(isOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">{language === 'bn' ? 'লেনদেন মুছুন' : 'Delete transaction'}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {language === 'bn' ? 'এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না। এটি এই লেনদেনটি স্থায়ীভাবে মুছে ফেলবে। চালিয়ে যেতে আপনার অ্যাডমিন পাসওয়ার্ড লিখুন।' : 'This action cannot be undone. This will permanently delete this transaction. Please enter your admin password to proceed.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label htmlFor={`delete-password-${transaction.id}`}>{language === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড' : 'Admin Password'}</Label>
          <Input
            id={`delete-password-${transaction.id}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={language === 'bn' ? 'পাসওয়ার্ড লিখুন' : 'Enter password'}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{language === 'bn' ? 'বাতিল' : 'Cancel'}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleDelete} variant="destructive">
              {language === 'bn' ? 'হ্যাঁ, মুছুন' : 'Yes, delete'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export function TransactionHistory() {
  const { transactions, language, user, deleteTransaction } = useAppContext();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatDate = (date: string) => {
      return format(new Date(date), 'PP', { locale: language === 'bn' ? bn : undefined });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{language === 'bn' ? 'সাম্প্রতিক লেনদেন' : 'Recent Transactions'}</CardTitle>
          <CardDescription>{language === 'bn' ? 'সংগঠনের সর্বশেষ আর্থিক কার্যকলাপ।' : 'The latest financial activities of the organization.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4 pr-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="group flex items-center">
                  <div className={`p-2 rounded-full mr-4 ${tx.type === 'donation' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                    {tx.type === 'donation' ? 
                        <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-300" /> : 
                        <ArrowDownLeft className="h-5 w-5 text-red-600 dark:text-red-300" />
                    }
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(tx.date)}</p>
                    {tx.memberName && tx.memberName.toLowerCase() !== 'anonymous' && (
                      <p className="text-xs text-muted-foreground">{language === 'bn' ? 'দাতা:' : 'By:'} {tx.memberName}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className={`font-semibold mr-2 ${tx.type === 'donation' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(tx.amount)}
                    </div>
                     {user?.role === 'admin' && (
                        <DeleteTransactionDialog
                          transaction={tx}
                          language={language}
                          onDelete={deleteTransaction}
                        />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
