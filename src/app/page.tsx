
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { publicMemberColumns } from '@/components/home/public-members-columns';

export default function HomePage() {
  const { members, donations, totalWithdrawals } = useAppContext();

  const totalMembers = members.length;
  const activeMembers = useMemo(() => members.filter(m => m.status === 'active').length, [members]);
  const inactiveMembers = useMemo(() => members.filter(m => m.status === 'inactive').length, [members]);
  const totalDonations = useMemo(() => {
    return donations.reduce((acc, donation) => acc + donation.amount, 0);
  }, [donations]);

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="flex-1 bg-background">
      <motion.section
        className="relative w-full py-20 lg:py-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto text-center">
          <motion.h1
            className="mb-4 text-4xl font-bold tracking-tight md:text-6xl text-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Shahid Liyakot Shiriti Songo (Chandgaon)
          </motion.h1>
          <motion.p
            className="mb-8 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            A non-profit organization dedicated to community development and support in Chandgaon.
          </motion.p>
        </div>
      </motion.section>

      <div className="container mx-auto py-12">
        <section className="mb-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card>
                <CardHeader>
                  <CardTitle>Our Members</CardTitle>
                  <CardDescription>Total members in the organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{totalMembers}</p>
                   <div className="text-sm text-muted-foreground mt-2">
                    <span className="font-semibold text-green-600">{activeMembers} Active</span> | <span className="font-semibold text-red-600">{inactiveMembers} Inactive</span>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              <Card>
                <CardHeader>
                  <CardTitle>Total Funds Raised</CardTitle>
                  <CardDescription>Supporting our cause</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-4xl font-bold">৳{totalDonations.toLocaleString('en-IN')}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
              <Card>
                <CardHeader>
                  <CardTitle>Total Withdrawals</CardTitle>
                   <CardDescription>Funds utilized for projects</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-4xl font-bold">৳{totalWithdrawals.toLocaleString('en-IN')}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">Our Members</h2>
          <DataTable columns={publicMemberColumns} data={members} />
        </section>
      </div>
    </div>
  );
}
