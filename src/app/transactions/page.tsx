
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import { AddTransactionDialog } from '@/components/members/add-transaction-dialog';
import { TransactionHistory } from '@/components/home/transaction-history';

export default function TransactionsPage() {
  const { language, userRole } = useAppContext();
  const [isTransactionOpen, setTransactionOpen] = React.useState(false);
  const [transactionType, setTransactionType] = React.useState<'donation' | 'withdrawal'>('donation');

  const handleOpenTransactionDialog = (type: 'donation' | 'withdrawal') => {
    setTransactionType(type);
    setTransactionOpen(true);
  };
  
  if (userRole !== 'admin') {
      return (
        <div className="flex flex-1 items-center justify-center p-4 text-center">
            <p className="text-muted-foreground">{language === 'bn' ? 'এই পৃষ্ঠাটি অ্যাক্সেস করার জন্য আপনার অনুমতি নেই।' : 'You do not have permission to access this page.'}</p>
        </div>
      )
  }

  return (
    <motion.div
      className="container mx-auto py-10 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{language === 'bn' ? 'লেনদেন ব্যবস্থাপনা' : 'Transaction Management'}</h1>
          <p className="text-muted-foreground">
            {language === 'bn' ? 'অনুদান এবং উত্তোলন যোগ করুন এবং দেখুন।' : 'Add and view donations and withdrawals.'}
          </p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => handleOpenTransactionDialog('donation')}>
              <DollarSign className="mr-2 h-4 w-4" /> {language === 'bn' ? 'অনুদান যোগ' : 'Add Donation'}
            </Button>
             <Button onClick={() => handleOpenTransactionDialog('withdrawal')} variant="outline">
              <CreditCard className="mr-2 h-4 w-4" /> {language === 'bn' ? 'উত্তোলন যোগ' : 'Add Withdrawal'}
            </Button>
        </div>
      </div>
      
      <div className="mt-8">
        <TransactionHistory />
      </div>

      <AddTransactionDialog 
        open={isTransactionOpen} 
        onOpenChange={setTransactionOpen}
        type={transactionType}
      />
    </motion.div>
  );
}
