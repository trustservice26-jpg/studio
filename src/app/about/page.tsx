
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
      
      <div className="prose dark:prose-invert max-w-none space-y-4">
        {language === 'bn' ? (
          <>
            <p>
              <strong className="font-bold">HADIYA – মানবতার উপহার</strong> হলো একটি সম্প্রদায়-চালিত উদ্যোগ, যা পরিচালিত হচ্ছে <strong className="font-bold">শহীদ লিয়াকত স্মৃতি সংঘ (চান্দগাঁও)</strong>-এর তত্ত্বাবধানে। আমাদের লক্ষ্য হলো ইসলামের আলোকে মানবতার কল্যাণে কাজ করা এবং সমাজে ইতিবাচক পরিবর্তন আনা।
            </p>
            <p>
              আমরা বিশ্বাস করি, মানবতার সেবা করা ইবাদতের একটি গুরুত্বপূর্ণ অংশ। তাই HADIYA-র প্রতিটি পদক্ষেপ মানুষের কল্যাণে নিবেদিত।
            </p>
          </>
        ) : (
          <>
            <p>
              <strong className="font-bold">HADIYA – A Gift for Humanity</strong> is a community-driven initiative supervised by <strong className="font-bold">Shahid Liyakot Shriti Songo (Chandgaon)</strong>. Our goal is to work for the welfare of humanity in the light of Islam and to bring positive change to society.
            </p>
            <p>
              We believe that serving humanity is an important part of worship. Therefore, every step of HADIYA is dedicated to the well-being of people.
            </p>
          </>
        )}
      </div>

    </motion.div>
  );
}
