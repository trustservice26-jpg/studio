
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Eye, Users, Scale, HeartHandshake, Quote } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function AboutUsPage() {
  const { language } = useAppContext();

  const principles = [
    {
      icon: <HeartHandshake className="h-8 w-8 text-primary" />,
      title: language === 'bn' ? 'মানবতার সেবা' : 'Service to Humanity',
      description: language === 'bn' ? 'আমরা বিশ্বাস করি মানবতার সেবা ইবাদতের একটি অংশ, এবং আমাদের সকল কাজ মানুষের কল্যাণে নিবেদিত।' : 'We believe serving humanity is a part of worship, and all our actions are dedicated to people\'s well-being.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: language === 'bn' ? 'সম্প্রদায়-চালিত' : 'Community-Driven',
      description: language === 'bn' ? 'আমরা একটি সম্প্রদায়-ভিত্তিক সংগঠন যা স্থানীয় প্রয়োজন মেটাতে এবং একসাথে ইতিবাচক পরিবর্তন আনতে কাজ করে।' : 'We are a community-based organization working together to meet local needs and create positive change.',
    },
    {
      icon: <Scale className="h-8 w-8 text-primary" />,
      title: language === 'bn' ? 'সততা ও স্বচ্ছতা' : 'Integrity & Transparency',
      description: language === 'bn' ? 'আমরা আমাদের সকল কাজে সর্বোচ্চ সততা ও স্বচ্ছতা বজায় রাখি, যাতে আমাদের সম্প্রদায়ের বিশ্বাস অর্জন করা যায়।' : 'We uphold the highest standards of integrity and transparency in all our operations to earn the trust of our community.',
    }
  ];

  return (
    <motion.div
      className="container mx-auto flex-1 space-y-12 p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {language === 'bn' ? 'আমাদের সংস্থা এবং লক্ষ্য সম্পর্কে আরও জানুন।' : 'Learn more about our organization and mission.'}
        </p>
      </div>
      
      <motion.div 
        className="max-w-3xl mx-auto"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="h-full bg-accent/50">
            <CardContent className="flex flex-col items-center justify-center text-center p-6 h-full">
                <Quote className="w-8 h-8 text-muted-foreground mb-4" />
                <p className="prose dark:prose-invert">
                  <strong className="font-bold">HADIYA – মানবতার উপহার</strong> {language === 'bn' ? ' হলো একটি সম্প্রদায়-চালিত উদ্যোগ, যা পরিচালিত হচ্ছে ' : 'is a community-driven initiative supervised by '} <strong className="font-bold">{language === 'bn' ? 'শহীদ লিয়াকত স্মৃতি সংঘ (চান্দগাঁও)' : 'Shahid Liyakot Shriti Songo (Chandgaon)'}</strong>. {language === 'bn' ? 'আমাদের লক্ষ্য হলো ইসলামের আলোকে মানবতার কল্যাণে কাজ করা এবং সমাজে ইতিবাচক পরিবর্তন আনা।' : 'Our goal is to work for the welfare of humanity in the light of Islam and to bring positive change to society.'}
                </p>
            </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 rounded-full bg-accent/20 text-accent">
                        <Target className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl">{language === 'bn' ? 'আমাদের লক্ষ্য' : 'Our Mission'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{language === 'bn' ? 'ইসলামের আলোকে মানবতার কল্যাণে কাজ করা, সমাজে ইতিবাচক পরিবর্তন আনা, এবং প্রতিটি পদক্ষেপ মানুষের কল্যাণে নিবেদন করা।' : 'To work for the welfare of humanity in the light of Islam, bring positive change to society, and dedicate every step to the well-being of people.'}</p>
                </CardContent>
            </Card>
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} transition={{delay: 0.2}}>
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                       <Eye className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl">{language === 'bn' ? 'আমাদের দৃষ্টিভঙ্গি' : 'Our Vision'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{language === 'bn' ? 'একটি সহানুভূতিশীল এবং সহায়ক সম্প্রদায় তৈরি করা যেখানে প্রত্যেকে মর্যাদা ও সম্মানের সাথে বাঁচে, যা সেবা এবং ঐক্যের ইসলামী মূল্যবোধ দ্বারা পরিচালিত হয়।' : 'To create a compassionate and supportive community where everyone lives with dignity and respect, guided by the Islamic values of service and unity.'}</p>
                </CardContent>
            </Card>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-3xl font-bold mb-8">{language === 'bn' ? 'আমাদের मार्गदर्शक নীতি' : 'Our Guiding Principles'}</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
                 <motion.div key={principle.title} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} transition={{delay: index * 0.2}}>
                    <div className="text-center p-6 border rounded-lg bg-card h-full">
                        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                           {principle.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{principle.title}</h3>
                        <p className="text-muted-foreground">{principle.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
       <div className="text-center py-10">
            <h2 className="text-3xl font-bold mb-4">{language === 'bn' ? 'আমাদের দল' : 'Our Team'}</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">{language === 'bn' ? 'আমাদের নিবেদিত স্বেচ্ছাসেবক এবং সদস্যদের সাথে দেখা করুন যারা এই উদ্যোগকে সম্ভব করে তুলেছেন। তাদের আবেগ এবং কঠোর পরিশ্রম আমাদের সম্প্রদায়ের চালিকাশক্তি।' : 'Meet our dedicated volunteers and members who make this initiative possible. Their passion and hard work are the driving force behind our community.'}</p>
       </div>

    </motion.div>
  );
}
