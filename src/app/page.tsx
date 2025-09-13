
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
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function HomePage() {
  const { members, donations, notices } = useAppContext();

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
      {/* Hero Section */}
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
            A non-profit organization dedicated to community development and support in Chandgaon. Welcome to our public dashboard.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link href="/dashboard">
              <Button size="lg">
                Go to Full Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto py-12">

        {/* Stats Section */}
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
                   <p className="text-4xl font-bold">৳{useAppContext().totalWithdrawals.toLocaleString('en-IN')}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Member Directory */}
          <section className="lg:col-span-2">
            <motion.h2 className="mb-4 text-3xl font-bold" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Member Directory
            </motion.h2>
            <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Join Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.slice(0, 5).map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Image
                              src={member.avatar}
                              alt={member.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <div className="font-medium">{member.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.status === "active" ? "default" : "secondary"} className={member.status === "active" ? "bg-green-500/20 text-green-700 border-green-500/20" : ""}>
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 <div className="p-4 text-center">
                    <Link href="/members">
                        <Button variant="outline">View All Members</Button>
                    </Link>
                </div>
              </Card>
            </motion.div>
          </section>

          {/* Notice Board */}
          <section>
            <motion.h2 className="mb-4 text-3xl font-bold" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Notice Board
            </motion.h2>
            <motion.div className="space-y-4" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              <Card>
                <CardContent className="p-4 space-y-4">
                  {notices.length > 0 ? (
                    notices.slice(0, 4).map((notice) => (
                      <div key={notice.id} className="flex items-start gap-4">
                        <MessageSquare className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm">{notice.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notice.date), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No recent notices.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </section>
        </div>
        
        {/* Quote Section */}
        <section className="my-16 text-center">
            <motion.blockquote 
              className="mx-auto max-w-3xl text-xl italic font-bold text-foreground"
               variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
             "দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়।"
            </motion.blockquote>
            <motion.p className="mt-2 text-muted-foreground" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>— Sheikh Saadi</motion.p>
        </section>

      </div>
    </div>
  );
}
