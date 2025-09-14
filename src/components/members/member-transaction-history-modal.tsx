'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

import type { Member } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type MemberTransactionHistoryModalProps = {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MemberTransactionHistoryModal({
  member,
  open,
  onOpenChange,
}: MemberTransactionHistoryModalProps) {
  const { transactions, language } = useAppContext();

  const memberTransactions = React.useMemo(() => {
    return transactions.filter(
      (tx) => tx.type === 'donation' && tx.memberName === member.name
    );
  }, [transactions, member.name]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'PP', { locale: language === 'bn' ? bn : undefined });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {language === 'bn'
              ? `${member.name}-এর লেনদেনের ইতিহাস`
              : `Transaction History for ${member.name}`}
          </DialogTitle>
          <DialogDescription>
            {language === 'bn'
              ? `এই সদস্যের দ্বারা করা সমস্ত অনুদানের একটি তালিকা এখানে দেওয়া হলো।`
              : 'A list of all donations made by this member.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                <TableHead>{language === 'bn' ? 'বিবরণ' : 'Description'}</TableHead>
                <TableHead className="text-right">{language === 'bn' ? 'পরিমাণ' : 'Amount'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberTransactions.length > 0 ? (
                memberTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{formatDate(tx.date)}</TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(tx.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    {language === 'bn' ? 'কোনো লেনদেন পাওয়া যায়নি।' : 'No transactions found.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
