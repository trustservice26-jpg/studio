
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Quote, UserPlus, LogIn, ShieldAlert, LayoutDashboard, ArrowRight, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { RegisterMemberDialog } from '@/components/home/register-member-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { members, language, setPublicUser, user, publicUser } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);
  const [memberId, setMemberId] = React.useState('');
  const [error, setError] = React.useState('');

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

  const handleLogin = () => {
    setError('');
    const foundMember = members.find(m => m.memberId.toLowerCase() === memberId.toLowerCase() && m.status === 'active');
    
    if (foundMember) {
      setPublicUser(foundMember);
      toast({
        title: language === 'bn' ? 'স্বাগতম' : 'Welcome',
        description: language === 'bn' ? `${foundMember.name} হিসাবে সফলভাবে প্রবেশ করেছেন।` : `Successfully entered as ${foundMember.name}.`,
      });
    } else {
      setError(language === 'bn' ? 'সক্রিয় সদস্য খুঁজে পাওয়া যায়নি বা ভুল আইডি।' : 'Active member not found or incorrect ID.');
    }
  };

  return (
    <div className="flex-1 bg-background">
      <motion.section
        className="relative w-full pt-12 pb-8 md:pt-20 lg:pt-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto text-center px-4">
          <motion.h1
            className="text-2xl md:text-3xl font-headline font-bold mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="whitespace-nowrap"><span className="text-primary">HADIYA</span> <span className="text-accent">- মানবতার উপহার</span></span>
          </motion.h1>
          <motion.p
            className="text-[11px] md:text-xs text-foreground/80 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span>{language === 'bn'
              ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ'
              : 'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}</span>
          </motion.p>
          <motion.p
            className="mb-8 max-w-3xl mx-auto text-muted-foreground text-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {language === 'bn' ? 'আমাদের সম্প্রদায়ের শক্তি এবং অগ্রগতির একটি স্বচ্ছ দৃষ্টিভঙ্গি।' : 'A transparent view of our community\'s strength and progress.'}
          </motion.p>
        </div>

        <motion.div 
            className="max-w-md mx-auto px-4 mb-8"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
        >
            <Card className="bg-accent/10 border-accent/20">
                <CardContent className="flex flex-col items-center justify-center text-center p-3">
                    <Quote className="w-5 h-5 text-accent mb-1" />
                    <blockquote className="font-bold text-foreground/90 text-xs">
                        {`“দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়।”`}
                        <footer className="text-[10px] font-medium text-foreground/70 mt-1">— শেখ সাদী</footer>
                    </blockquote>
                </CardContent>
            </Card>
        </motion.div>
        
        {user ? (
            <motion.div
                className="max-w-md mx-auto px-4"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <LayoutDashboard />
                           {language === 'bn' ? 'অ্যাডমিন ভিউ' : 'Admin View'}
                        </CardTitle>
                        <CardDescription>
                            {language === 'bn' ? `স্বাগতম, ${user.name}। আপনার সরঞ্জামগুলি অ্যাক্সেস করতে নেভিগেশন মেনু ব্যবহার করুন।` : `Welcome, ${user.name}. Use the navigation menu to access your tools.`}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </motion.div>
        ) : publicUser ? (
             <motion.div
                className="max-w-md mx-auto px-4"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <UserCheck />
                           {language === 'bn' ? 'স্বাগতম' : 'Welcome'}
                        </CardTitle>
                        <CardDescription>
                            {language === 'bn' ? `স্বাগতম, ${publicUser.name}। আমাদের বিবরণ দেখতে নীচের বোতামে ক্লিক করুন।` : `Welcome, ${publicUser.name}. Click the button below to view our details.`}
                        </CardDescription>
                    </CardHeader>
                     <CardContent>
                        <Button onClick={() => router.push('/details')} className="w-full">
                            {language === 'bn' ? 'চালিয়ে যান' : 'Continue'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        ) : (
        <>
            <motion.div
                className="max-w-md mx-auto px-4"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LogIn />
                            {language === 'bn' ? 'সদস্য প্রবেশ' : 'Member Entry'}
                        </CardTitle>
                        <CardDescription>
                            {language === 'bn' ? 'বিস্তারিত দেখতে দয়া করে আপনার সদস্য আইডি লিখুন।' : 'Please enter your Member ID to view details.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="member-id">{language === 'bn' ? 'সদস্য আইডি' : 'Member ID'}</Label>
                            <Input 
                                id="member-id" 
                                placeholder={language === 'bn' ? 'আপনার আইডি এখানে লিখুন...' : 'Enter your ID here...'}
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                onKeyUp={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-destructive flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}
                        <Button onClick={handleLogin} className="w-full">
                            {language === 'bn' ? 'প্রবেশ করুন' : 'Enter'}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
            
            <div className="text-center mt-8">
                <Button variant="default" onClick={() => setRegisterOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <UserPlus className="mr-2 h-4 w-4" />
                    {language === 'bn' ? 'নতুন সদস্য হিসেবে নিবন্ধন করুন' : 'Register as a New Member'}
                </Button>
            </div>
        </>
        )}


      </motion.section>
      
      <RegisterMemberDialog open={isRegisterOpen} onOpenChange={setRegisterOpen} />

       <footer className="py-6 px-4 md:px-6 border-t mt-12">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>© 2025 <span className="font-bold text-primary whitespace-nowrap">HADIYA</span> <span className="font-bold text-accent whitespace-nowrap">- মানবতার উপহার</span> ({language === 'bn' ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ' : 'a community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}) All rights reserved.</p>
          <p className="font-bold italic mt-2 text-xs text-foreground">Developed & Supported by AL-SADEEQ Team.</p>
        </div>
      </footer>
    </div>
  );
}
