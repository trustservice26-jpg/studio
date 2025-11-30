
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2
    },
  },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export default function ContactPage() {
  const { language } = useAppContext();

  const contactDetails = [
    {
        icon: <Mail className="h-8 w-8 text-primary" />,
        title: language === 'bn' ? 'ইমেইল' : 'Email',
        value: 'infoteamhadiya@gmail.com',
        href: 'mailto:infoteamhadiya@gmail.com'
    },
    {
        icon: <Phone className="h-8 w-8 text-primary" />,
        title: language === 'bn' ? 'ফোন' : 'Phone',
        value: '+880 123 456 7890',
        href: 'tel:+8801234567890'
    },
    {
        icon: <MapPin className="h-8 w-8 text-primary" />,
        title: language === 'bn' ? 'ঠিকানা' : 'Address',
        value: language === 'bn' ? 'চান্দগাঁও, চট্টগ্রাম, বাংলাদেশ' : 'Chandgaon, Chattogram, Bangladesh',
    }
  ]

  return (
    <motion.div
      className="container mx-auto flex-1 space-y-12 p-4 md:p-6"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <div className="text-center">
        <motion.h1 
            className="text-3xl md:text-4xl font-bold tracking-tight"
            variants={itemVariants}
        >
            {language === 'bn' ? 'যোগাযোগ করুন' : 'Connect With Us'}
        </motion.h1>
        <motion.p 
            className="mt-2 text-lg text-muted-foreground"
            variants={itemVariants}
        >
          {language === 'bn' ? 'আমরা আপনার কাছ থেকে শুনতে চাই!' : 'We would love to hear from you!'}
        </motion.p>
      </div>
      
      <motion.div 
        className="max-w-3xl mx-auto"
        variants={cardVariants}
        >
        <Card>
            <CardHeader>
                <CardTitle className="text-center">{language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Information'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {contactDetails.map((detail, index) => (
                     <motion.div 
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                        variants={itemVariants}
                    >
                        <div className="p-3 bg-primary/10 rounded-full">
                            {detail.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{detail.title}</h3>
                            {detail.href ? (
                                <a href={detail.href} className="text-muted-foreground hover:text-primary transition-colors">
                                    {detail.value}
                                </a>
                            ) : (
                                <p className="text-muted-foreground">{detail.value}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  );
}
