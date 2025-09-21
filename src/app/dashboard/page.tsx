
'use client';

import { NoticeBoard } from '@/components/dashboard/notice-board';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/app-context';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { MemberStatusOverview } from '@/components/dashboard/member-status-overview';
import { ClearTransactionsDialog } from '@/components/dashboard/clear-transactions-dialog';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { DownloadStatementDialog } from '@/components/dashboard/download-statement-dialog';

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
  const [isStatementDialogOpen, setStatementDialogOpen] = React.useState(false);
  return (
    <motion.div
      className="container mx-auto flex flex-1 flex-col gap-6 p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">{language === 'bn' ? 'এডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}</h1>
        <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setStatementDialogOpen(true)}>
                <Download className="mr-2 h-4 w-4" />
                {language === 'bn' ? 'অ্যাকাউন্ট স্টেটমেন্ট' : 'Account Statement'}
            </Button>
            <Button variant="destructive" onClick={() => setClearDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                {language === 'bn' ? 'লেনদেন মুছুন' : 'Clear Transactions'}
            </Button>
        </div>
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
       <DownloadStatementDialog open={isStatementDialogOpen} onOpenChange={setStatementDialogOpen} />
    </motion.div>
  );
}
