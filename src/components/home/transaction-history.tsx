
'use client';

import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '../ui/badge';

export function TransactionHistory() {
  const { donations, language } = useAppContext();

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
          <ScrollArea className="h-96">
            <div className="space-y-4 pr-4">
              {donations.map((tx) => (
                <div key={tx.id} className="flex items-center">
                  <div className={`p-2 rounded-full mr-4 ${tx.type === 'donation' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                    {tx.type === 'donation' ? 
                        <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-300" /> : 
                        <ArrowDownLeft className="h-5 w-5 text-red-600 dark:text-red-300" />
                    }
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(tx.date)}</p>
                    {tx.memberName && tx.memberName !== 'anonymous' && (
                      <p className="text-xs text-muted-foreground">{language === 'bn' ? 'দাতা:' : 'By:'} {tx.memberName}</p>
                    )}
                  </div>
                  <div className={`font-semibold ${tx.type === 'donation' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(tx.amount)}
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
