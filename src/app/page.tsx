
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { publicMemberColumns } from '@/components/home/public-members-columns';
import { NoticeBoard } from '@/components/dashboard/notice-board';

export default function HomePage() {
  const { members, language } = useAppContext();

  const totalMembers = members.length;
  const activeMembers = useMemo(() => members.filter(m => m.status === 'active').length, [members]);
  const inactiveMembers = useMemo(() => members.filter(m => m.status === 'inactive').length, [members]);
  
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
          <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'আমাদের সদস্য' : 'Our Members'}</CardTitle>
                  <CardDescription>{language === 'bn' ? 'সংগঠনে মোট সদস্য' : 'Total members in the organization'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{totalMembers}</p>
                   <div className="text-sm text-muted-foreground mt-2">
                    <span className="font-semibold text-green-600">{activeMembers} {language === 'bn' ? 'সক্রিয়' : 'Active'}</span> | <span className="font-semibold text-red-600">{inactiveMembers} {language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive'}</span>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
        </section>

        <section className="mb-12">
            <Card>
                <CardContent className="flex flex-col items-center justify-center text-center p-6">
                    <Quote className="w-8 h-8 text-muted-foreground mb-4" />
                    <blockquote className="text-lg font-semibold italic">
                    {language === 'bn' ? "দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়।" : "Do not be ashamed of giving a little, for refusing is a greater shame."}
                    </blockquote>
                    <p className="text-muted-foreground mt-2">{language === 'bn' ? '— শেখ সাদী' : '— Sheikh Saadi'}</p>
                </CardContent>
            </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">{language === 'bn' ? 'আমাদের সদস্য' : 'Our Members'}</h2>
              <DataTable columns={publicMemberColumns} data={members} />
            </section>
            <section>
                <h2 className="text-3xl font-bold mb-6">{language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board'}</h2>
                <NoticeBoard />
            </section>
        </div>
      </div>
    </div>
  );
}
