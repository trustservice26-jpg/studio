
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Landmark, TrendingUp, TrendingDown, Users, Download, Trash2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import { DataTable } from '@/components/ui/data-table';
import { publicMemberColumns } from '@/components/home/public-members-columns';
import { TransactionHistory } from '@/components/home/transaction-history';
import { HomeMemberStatus } from '@/components/home/home-member-status';
import { Button } from '@/components/ui/button';
import { DownloadPdfDialog } from '@/components/members/download-pdf-dialog';
import { ClearDataDialog } from '@/components/home/clear-data-dialog';

export default function DetailsPage() {
  const { members, language, currentFunds, totalDonations, totalWithdrawals, user, publicUser } = useAppContext();
  const router = useRouter();
  const [isPdfOpen, setPdfOpen] = React.useState(false);
  const [isClearDataOpen, setClearDataOpen] = React.useState(false);

  React.useEffect(() => {
    if (!publicUser) {
        router.push('/');
    }
  }, [publicUser, router]);


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
  ];

  if (!publicUser) {
    return (
        <div className="flex flex-1 items-center justify-center p-4 text-center flex-col gap-4 h-screen">
            <ShieldAlert className="h-16 w-16 text-destructive" />
            <h2 className="text-2xl font-bold">{language === 'bn' ? 'প্রবেশাধিকার প্রয়োজন' : 'Access Required'}</h2>
            <p className="text-muted-foreground">{language === 'bn' ? 'অনুগ্রহ করে প্রথমে আপনার সদস্য আইডি দিয়ে প্রবেশ করুন।' : 'Please enter with your Member ID first.'}</p>
            <Button onClick={() => router.push('/')}>{language === 'bn' ? 'প্রবেশ পৃষ্ঠায় ফিরে যান' : 'Go to Entry Page'}</Button>
        </div>
      )
  }

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold">{language === 'bn' ? 'সদস্য বিবরণ ড্যাশবোর্ড' : 'Member Details Dashboard'}</h1>
            <p className="text-lg text-muted-foreground mt-2">
                {language === 'bn' ? 'আমাদের সম্প্রদায়ের শক্তি এবং অগ্রগতির একটি স্বচ্ছ দৃষ্টিভঙ্গি।' : 'A transparent view of our community\'s strength and progress.'}
            </p>
        </div>

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
      <ClearDataDialog open={isClearDataOpen} onOpenChange={setClearDataOpen} />
    </div>
  );
}
