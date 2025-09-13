'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { DonationsChart } from '@/components/dashboard/donations-chart';
import { NoticeBoard } from '@/components/dashboard/notice-board';
import { motion } from 'framer-motion';

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
  return (
    <motion.div
      className="flex flex-1 flex-col gap-6 p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <NoticeBoard />
      <StatsCards />
      <DonationsChart />
    </motion.div>
  );
}
