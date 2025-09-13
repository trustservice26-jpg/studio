'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { NoticeBoard } from '@/components/dashboard/notice-board';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/app-context';

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
  return (
    <motion.div
      className="flex flex-1 flex-col gap-6 p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold">{language === 'bn' ? 'এডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <NoticeBoard />
        </div>
        <div className="lg:col-span-1">
           <StatsCards />
        </div>
      </div>
    </motion.div>
  );
}
