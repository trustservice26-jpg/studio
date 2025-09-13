
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Quote, Users, PiggyBank, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import { DataTable } from '@/components/ui/data-table';
import { publicMemberColumns } from '@/components/home/public-members-columns';
import { NoticeBoard } from '@/components/dashboard/notice-board';
import { MemberStatusChart } from '@/components/home/member-status-chart';

export default function HomePage() {
  const { members, language, currentFunds, totalDonations, totalWithdrawals } = useAppContext();

  const totalMembers = members.length;

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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  const stats = [
    { title: language === 'bn' ? 'বর্তমান তহবিল' : 'Current Funds', value: formatCurrency(currentFunds), icon: PiggyBank },
    { title: language === 'bn' ? 'মোট অনুদান' : 'Total Donations', value: formatCurrency(totalDonations), icon: ArrowUpCircle },
    { title: language === 'bn' ? 'মোট উত্তোলন' : 'Total Withdrawals', value: formatCurrency(totalWithdrawals), icon: ArrowDownCircle },
    { title: language === 'bn' ? 'মোট সদস্য' : 'Total Members', value: totalMembers, icon: Users },
  ]

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
            {language === 'bn' ? 'সেবা সংগঠন' : 'Seva Sangathan'}
          </motion.h1>
          <motion.p
            className="mb-8 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {language === 'bn' ? 'চাঁদগাঁওয়ে सामुदायिक উন্নয়ন ও সহায়তায় समर्पित একটি অলাভজনক সংস্থা।' : 'A non-profit organization dedicated to community development and support in Chandgaon.'}
          </motion.p>
        </div>
      </motion.section>

      <div className="container mx-auto py-12 px-4 md:px-6">
        <section className="mb-12">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div key={stat.title} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} custom={index} transition={{delay: index * 0.1}}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <section className="lg:col-span-1">
                <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center text-center p-6 h-full">
                        <Quote className="w-8 h-8 text-muted-foreground mb-4" />
                        <blockquote className="text-lg font-semibold italic">
                        {language === 'bn' ? "দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়।" : "Do not be ashamed of giving a little, for refusing is a greater shame."}
                        </blockquote>
                        <p className="text-muted-foreground mt-2">{language === 'bn' ? '— শেখ সাদী' : '— Sheikh Saadi'}</p>
                    </CardContent>
                </Card>
            </section>
            <section className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-6">{language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board'}</h2>
                <NoticeBoard />
            </section>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">{language === 'bn' ? 'আমাদের সদস্য' : 'Our Members'}</h2>
            <DataTable columns={publicMemberColumns} data={members} />
           </div>
           <div>
             <h2 className="text-3xl font-bold mb-6">{language === 'bn' ? 'সদস্য স্ট্যাটাস ওভারভিউ' : 'Member Status Overview'}</h2>
              <MemberStatusChart />
           </div>
        </section>
      </div>
    </div>
  );
}
