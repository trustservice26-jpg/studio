
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PublicNoticeBoard } from '@/components/home/public-notice-board';
import { useAppContext } from '@/context/app-context';

export default function NoticeBoardPage() {
  const { language } = useAppContext();

  return (
    <motion.div
      className="container mx-auto flex-1 p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board'}</h1>
          <p className="text-muted-foreground">
            {language === 'bn' ? 'সংগঠনের সর্বশেষ খবর এবং আপডেট।' : 'Latest news and updates from the organization.'}
          </p>
        </div>
      </div>
      
      <PublicNoticeBoard />

    </motion.div>
  );
}
