
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/app-context';

export default function AboutUsPage() {
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
          <h1 className="text-3xl font-bold">{language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</h1>
          <p className="text-muted-foreground">
            {language === 'bn' ? 'আমাদের সংস্থা এবং লক্ষ্য সম্পর্কে আরও জানুন।' : 'Learn more about our organization and mission.'}
          </p>
        </div>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <p>{language === 'bn' ? 'এখানে আমাদের সম্পর্কে বিস্তারিত তথ্য যোগ করা হবে।' : 'More information about us will be added here.'}</p>
      </div>

    </motion.div>
  );
}
