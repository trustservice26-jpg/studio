
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Megaphone } from 'lucide-react';

export function PublicNoticeBoard() {
  const { notices, language } = useAppContext();

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'bn' ? 'সাম্প্রতিক ঘোষণা' : 'Recent Announcements'}</CardTitle>
          <CardDescription>{language === 'bn' ? 'সংগঠনের সর্বশেষ খবর এবং আপডেট।' : 'Latest news and updates from the organization.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 md:h-[280px]">
             {notices.length > 0 ? (
                <motion.div className="space-y-4" variants={cardVariants}>
                    {notices.map((notice) => (
                    <motion.div key={notice.id} className="flex items-start gap-4 p-3 rounded-md bg-muted/50" variants={itemVariants}>
                         <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Megaphone className="h-5 w-5" />
                        </div>
                        <div>
                        <p className="text-sm font-medium whitespace-pre-wrap">{notice.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notice.date), { addSuffix: true, locale: language === 'bn' ? bn : undefined })}
                        </p>
                        </div>
                    </motion.div>
                    ))}
                </motion.div>
                ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                    <Megaphone className="w-12 h-12 mb-4" />
                    <p>{language === 'bn' ? 'এখনও কোনো নোটিশ নেই।' : 'No notices posted yet.'}</p>
                    <p className="text-sm">{language === 'bn' ? 'শীঘ্রই আবার দেখুন!' : 'Check back soon!'}</p>
                </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
