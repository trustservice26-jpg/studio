'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import { useMemo } from 'react';

export default function HomePage() {
  const { members, donations, notices } = useAppContext();

  const totalMembers = members.length;
  const totalDonations = useMemo(() => {
    return donations.reduce((acc, donation) => acc + donation.amount, 0);
  }, [donations]);

  const recentNotices = notices.slice(0, 3);

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
      {/* Hero Section */}
      <motion.section
        className="relative h-[60vh] min-h-[400px] w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="https://picsum.photos/seed/hero-bg/1600/900"
          alt="Community gathering"
          fill
          className="object-cover"
          data-ai-hint="community event"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <motion.h1
            className="mb-4 text-4xl font-bold tracking-tight md:text-6xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Shahid Liyakot Shiriti Songo (Chandgaon)
          </motion.h1>
          <motion.p
            className="mb-8 max-w-2xl text-lg md:text-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            A non-profit organization dedicated to community development and support in Chandgaon.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link href="/dashboard">
              <Button size="lg" variant="default">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto py-12">
        {/* Quote Section */}
        <section className="mb-12 text-center">
            <motion.blockquote 
              className="mx-auto max-w-3xl text-xl italic text-foreground"
              variants={cardVariants} initial="hidden" animate="visible"
            >
             "দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়।"
            </motion.blockquote>
            <motion.p className="mt-2 text-muted-foreground" variants={cardVariants} initial="hidden" animate="visible" custom={1}>— Sheikh Saadi</motion.p>
        </section>

        {/* Stats Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <Card>
                <CardHeader>
                  <CardTitle>Our Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalMembers}</p>
                  <p className="text-muted-foreground">Dedicated individuals</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
              <Card>
                <CardHeader>
                  <CardTitle>Total Funds Raised</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="text-3xl font-bold">৳{totalDonations.toLocaleString('en-IN')}</p>
                   <p className="text-muted-foreground">Supporting our cause</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Recent Notices Section */}
        <section className="mb-12">
          <motion.h2 className="mb-4 text-3xl font-bold text-center" variants={cardVariants} initial="hidden" animate="visible">
            Recent Notices
          </motion.h2>
          <motion.div className="space-y-4" variants={cardVariants} initial="hidden" animate="visible" custom={1}>
            {recentNotices.length > 0 ? (
              recentNotices.map((notice) => (
                <Card key={notice.id} className="bg-accent/50">
                  <CardContent className="p-4 flex items-start gap-4">
                    <MessageSquare className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm">{notice.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notice.date), { addSuffix: true })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No recent notices.</p>
            )}
          </motion.div>
        </section>

        {/* About Section */}
        <section className="text-center">
            <motion.h2 className="mb-4 text-3xl font-bold" variants={cardVariants} initial="hidden" animate="visible">About Us</motion.h2>
            <motion.p className="mx-auto max-w-3xl text-muted-foreground" variants={cardVariants} initial="hidden" animate="visible" custom={1}>
              We are a community-focused non-profit organization striving to make a positive impact through various social welfare and development projects in the Chandgaon area. Our strength lies in our passionate members and generous donors.
            </motion.p>
        </section>
      </div>
    </div>
  );
}
