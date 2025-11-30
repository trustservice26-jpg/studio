
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, MessageSquarePlus, Contact, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegisterMemberDialog } from '@/components/home/register-member-dialog';

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
};

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function ContactPage() {
  const { language } = useAppContext();
  const { toast } = useToast();
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

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
  ];

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    console.log(values); // In a real app, you'd send this to a server
    toast({
      title: language === 'bn' ? 'বার্তা পাঠানো হয়েছে' : 'Message Sent!',
      description: language === 'bn' ? 'আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।' : 'We will get back to you shortly.',
    });
    form.reset();
  }


  return (
    <>
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
      
      <motion.div className="max-w-3xl mx-auto" variants={itemVariants}>
        <Tabs defaultValue="message" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="message">
                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                    {language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}
                </TabsTrigger>
                <TabsTrigger value="info">
                    <Contact className="mr-2 h-4 w-4" />
                    {language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Info'}
                </TabsTrigger>
                <TabsTrigger value="register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    {language === 'bn' ? 'নিবন্ধন' : 'Register'}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="message">
                <Card>
                    <CardHeader>
                        <CardTitle>{language === 'bn' ? 'আমাদের একটি বার্তা পাঠান' : 'Send us a message'}</CardTitle>
                        <CardDescription>{language === 'bn' ? 'যেকোনো প্রশ্ন বা অনুসন্ধানের জন্য নিচের ফর্মটি পূরণ করুন।' : 'Fill out the form below for any questions or inquiries.'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>{language === 'bn' ? 'আপনার নাম' : 'Your Name'}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={language === 'bn' ? 'নাম' : 'Name'} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>{language === 'bn' ? 'আপনার ইমেইল' : 'Your Email'}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={language === 'bn' ? 'ইমেইল' : 'Email'} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>{language === 'bn' ? 'আপনার বার্তা' : 'Your Message'}</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder={language === 'bn' ? 'এখানে আপনার বার্তা লিখুন...' : 'Type your message here...'} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    <Send className="mr-2 h-4 w-4" />
                                    {language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="info">
                <Card>
                    <CardHeader>
                        <CardTitle>{language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Information'}</CardTitle>
                         <CardDescription>{language === 'bn' ? 'এখানে আমাদের সাথে যোগাযোগ করার বিভিন্ন উপায় রয়েছে।' : 'Here are the ways you can get in touch with us.'}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {contactDetails.map((detail, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
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
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="register">
                <Card>
                    <CardHeader>
                        <CardTitle>{language === 'bn' ? 'আমাদের সাথে যোগ দিতে চান?' : 'Want to join with us?'}</CardTitle>
                        <CardDescription>{language === 'bn' ? 'আমাদের সম্প্রদায়ে যোগ দিতে নিবন্ধন বোতামে ক্লিক করুন।' : 'Click the button below to register and join our community.'}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-48">
                       <Button onClick={() => setRegisterOpen(true)} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                           <UserPlus className="mr-2 h-5 w-5" />
                           {language === 'bn' ? 'এখন নিবন্ধন করুন' : 'Register Now'}
                       </Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </motion.div>

    </motion.div>
    <RegisterMemberDialog open={isRegisterOpen} onOpenChange={setRegisterOpen} />
    </>
  );
}
