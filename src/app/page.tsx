
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Quote, Landmark, TrendingUp, TrendingDown, Users, Download, UserPlus, Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import { DataTable } from '@/components/ui/data-table';
import { publicMemberColumns } from '@/components/home/public-members-columns';
import { TransactionHistory } from '@/components/home/transaction-history';
import { HomeMemberStatus } from '@/components/home/home-member-status';
import { Button } from '@/components/ui/button';
import { DownloadPdfDialog } from '@/components/members/download-pdf-dialog';
import { RegisterMemberDialog } from '@/components/home/register-member-dialog';
import { ClearDataDialog } from '@/components/home/clear-data-dialog';

export default function HomePage() {
  const { members, language, currentFunds, totalDonations, totalWithdrawals, user } = useAppContext();
  const [isPdfOpen, setPdfOpen] = React.useState(false);
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);
  const [isClearDataOpen, setClearDataOpen] = React.useState(false);

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

  const financialStats = [
    { title: language === 'bn' ? 'বর্তমান তহবিল' : 'Current Funds', value: formatCurrency(currentFunds), icon: Landmark },
    { title: language === 'bn' ? 'মোট অনুদান' : 'Total Donations', value: formatCurrency(totalDonations), icon: TrendingUp },
    { title: language === 'bn' ? 'মোট উত্তোলন' : 'Total Withdrawals', value: formatCurrency(totalWithdrawals), icon: TrendingDown },
    { title: language === 'bn' ? 'মোট সদস্য' : 'Total Members', value: members.length.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US'), icon: Users },
  ]

  return (
    <div className="flex-1 bg-background">
      <motion.section
        className="relative w-full pt-20 pb-12 lg:pt-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto text-center">
          <motion.h1
            className="text-2xl md:text-5xl font-headline font-bold mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="whitespace-nowrap"><span className="text-primary">HADIYA</span> <span className="text-accent">- মানবতার উপহার</span></span>
          </motion.h1>
          <motion.p
            className="text-xs md:text-base text-black mb-4 whitespace-nowrap"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {language === 'bn'
              ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ'
              : 'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}
          </motion.p>
          <motion.p
            className="mb-8 max-w-3xl mx-auto text-sm md:text-base text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {language === 'bn' ? 'আমাদের সম্প্রদায়ের শক্তি এবং অগ্রগতির একটি স্বচ্ছ দৃষ্টিভঙ্গি।' : 'A transparent view of our community\'s strength and progress.'}
          </motion.p>

           <motion.div 
            className="max-w-3xl mx-auto"
            variants={cardVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.5 }}
            transition={{delay: 0.5}}>
                <Card className="h-full bg-accent/50">
                    <CardContent className="flex flex-col items-center justify-center text-center p-6 h-full">
                        <Quote className="w-8 h-8 text-muted-foreground mb-4" />
                        <blockquote className="text-base font-semibold italic">
                         "দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়।"
                         <br />
                         "Do not be ashamed of giving a little, for refusing is a greater shame."
                        </blockquote>
                        <p className="text-muted-foreground mt-2">- শেখ সাদী / Sheikh Saadi</p>
                    </CardContent>
                </Card>
           </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto py-12 px-4 md:px-6">
        {user?.role === 'admin' && (
          <section className="mb-8 flex justify-end">
              <Button variant="destructive" onClick={() => setClearDataOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {language === 'bn' ? 'সমস্ত ডেটা মুছুন' : 'Clear All Data'}
              </Button>
          </section>
        )}
        <section className="mb-12">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {financialStats.map((stat, index) => (
                <motion.div key={stat.title} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} custom={index} transition={{delay: index * 0.1}}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
        </section>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-sm md:text-base">{language === 'bn' ? 'সদস্য অবস্থা' : 'Member Status'}</h2>
                    <HomeMemberStatus />
                </section>
                <section>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                         <h2 className="text-2xl font-bold text-sm md:text-base">{language === 'bn' ? 'সদস্য তালিকা' : 'Member Directory'}</h2>
                         <div className="flex gap-2 w-full sm:w-auto">
                            <Button onClick={() => setPdfOpen(true)} variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" /> {language === 'bn' ? 'সদস্য ফর্ম ডাউনলোড' : 'Download Member Form'}
                            </Button>
                        </div>
                    </div>
                    <DataTable columns={publicMemberColumns} data={members} pageSize={5} />
                </section>
            </div>
          <section className="lg:col-span-1 space-y-6">
             <TransactionHistory />
          </section>
        </div>
      </div>
      <DownloadPdfDialog open={isPdfOpen} onOpenChange={setPdfOpen} />
      <RegisterMemberDialog open={isRegisterOpen} onOpenChange={setRegisterOpen} />
      <ClearDataDialog open={isClearDataOpen} onOpenChange={setClearDataOpen} />
       <footer className="py-6 px-4 md:px-6 border-t">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>© 2025 <span className="font-bold text-primary whitespace-nowrap">HADIYA</span> <span className="font-bold text-accent whitespace-nowrap">- মানবতার উপহার</span> (<span className="whitespace-nowrap">{language === 'bn' ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ' : 'a community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}</span>) All rights reserved.</p>
          <p className="font-bold italic mt-2 text-xs text-foreground">Developed & Supported by AL-SADEEQ Team.</p>
        </div>
      </footer>
    </div>
  );
}
