
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Quote, UserPlus, LogIn, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { RegisterMemberDialog } from '@/components/home/register-member-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { members, language, setPublicUser } = useAppContext();
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
      router.push('/details');
    } else {
      setError(language === 'bn' ? 'সক্রিয় সদস্য খুঁজে পাওয়া যায়নি বা ভুল আইডি।' : 'Active member not found or incorrect ID.');
    }
  };

  return (
    <div className="flex-1 bg-background">
      <motion.section
        className="relative w-full pt-20 pb-12 lg:pt-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto text-center px-4">
          <motion.h1
            className="text-2xl md:text-5xl font-headline font-bold mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="whitespace-nowrap"><span className="text-primary">HADIYA</span> <span className="text-accent">- মানবতার উপহার</span></span>
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-black mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="whitespace-nowrap">{language === 'bn'
              ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ'
              : 'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}</span>
          </motion.p>
          <motion.p
            className="mb-8 max-w-3xl mx-auto text-base md:text-lg text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {language === 'bn' ? 'আমাদের সম্প্রদায়ের শক্তি এবং অগ্রগতির একটি স্বচ্ছ দৃষ্টিভঙ্গি।' : 'A transparent view of our community\'s strength and progress.'}
          </motion.p>
        </div>

        <motion.div
            className="max-w-md mx-auto px-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
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
            <Button variant="outline" onClick={() => setRegisterOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                {language === 'bn' ? 'নতুন সদস্য হিসেবে নিবন্ধন করুন' : 'Register as a New Member'}
            </Button>
        </div>

      </motion.section>
      
      <RegisterMemberDialog open={isRegisterOpen} onOpenChange={setRegisterOpen} />

       <footer className="py-6 px-4 md:px-6 border-t mt-12">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>© 2025 <span className="font-bold text-primary whitespace-nowrap">HADIYA</span> <span className="font-bold text-accent whitespace-nowrap">- মানবতার উপহার</span> (<span className="whitespace-nowrap">{language === 'bn' ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ' : 'a community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}</span>) All rights reserved.</p>
          <p className="font-bold italic mt-2 text-xs text-foreground">Developed & Supported by AL-SADEEQ Team.</p>
        </div>
      </footer>
    </div>
  );
}
