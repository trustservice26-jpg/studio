
'use client';

import { NoticeBoard } from '@/components/dashboard/notice-board';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/app-context';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { MemberStatusOverview } from '@/components/dashboard/member-status-overview';
import { ClearTransactionsDialog } from '@/components/dashboard/clear-transactions-dialog';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Dashboard() {
  const { language } = useAppContext();
  const [isClearDialogOpen, setClearDialogOpen] = React.useState(false);
  return (
    <motion.div
      className="flex flex-1 flex-col gap-6 p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{language === 'bn' ? 'এডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}</h1>
        <Button variant="destructive" onClick={() => setClearDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            {language === 'bn' ? 'লেনদেন মুছুন' : 'Clear Transactions'}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <NoticeBoard />
        </div>
         <div className="space-y-6">
            <StatsCards />
            <MemberStatusOverview />
        </div>
      </div>
       <ClearTransactionsDialog open={isClearDialogOpen} onOpenChange={setClearDialogOpen} />
    </motion.div>
  );
}
