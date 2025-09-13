'use client';

import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Banknote } from 'lucide-react';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export function StatsCards() {
  const { members, donations } = useAppContext();

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  
  const totalDonations = useMemo(() => {
    return donations.reduce((acc, donation) => acc + donation.amount, 0);
  }, [donations]);

  const stats = [
    {
      title: 'Total Members',
      value: totalMembers,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Active Members',
      value: activeMembers,
      icon: <UserCheck className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Total Donations',
      value: `৳${totalDonations.toLocaleString('en-IN')}`,
      icon: <Banknote className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map(stat => (
        <motion.div key={stat.title} variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
