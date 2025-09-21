
'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ClearTransactionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ClearTransactionsDialog({ open, onOpenChange }: ClearTransactionsDialogProps) {
  const { clearAllTransactions, language } = useAppContext();
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleConfirm = () => {
    if (password === 'admin123') {
      clearAllTransactions();
      onOpenChange(false);
      setPassword('');
      setError('');
    } else {
      setError(language === 'bn' ? 'ভুল পাসওয়ার্ড।' : 'Incorrect password.');
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you absolutely sure?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === 'bn'
              ? 'এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না। এটি সমস্ত লেনদেনের ডেটা স্থায়ীভাবে মুছে ফেলবে। চালিয়ে যেতে আপনার অ্যাডমিন পাসওয়ার্ড লিখুন।'
              : 'This action cannot be undone. This will permanently delete all transaction data. Please enter your admin password to proceed.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label htmlFor="clear-password">{language === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড' : 'Admin Password'}</Label>
          <Input
            id="clear-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={language === 'bn' ? 'পাসওয়ার্ড লিখুন' : 'Enter password'}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleConfirm} variant="destructive">
              {language === 'bn' ? 'হ্যাঁ, সবকিছু মুছুন' : 'Yes, clear everything'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
