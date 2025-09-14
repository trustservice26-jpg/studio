
'use client';

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

type ClearTransactionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ClearTransactionsDialog({ open, onOpenChange }: ClearTransactionsDialogProps) {
  const { clearAllTransactions, language } = useAppContext();

  const handleConfirm = () => {
    clearAllTransactions();
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
              ? 'এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না। এটি সমস্ত লেনদেনের ডেটা স্থায়ীভাবে মুছে ফেলবে এবং আপনার তহবিলের পরিসংখ্যান শূন্যে পুনরায় সেট করবে।'
              : 'This action cannot be undone. This will permanently delete all transaction data and reset your fund statistics to zero.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{language === 'bn' ? 'বাতিল' : 'Cancel'}</AlertDialogCancel>
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
