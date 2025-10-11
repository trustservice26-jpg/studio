
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import { DownloadSmartCardDialog } from '@/components/smart-card/download-smart-card-dialog';
import type { Member } from '@/lib/types';
import { SmartCard } from '@/components/smart-card/smart-card';

export default function SmartCardPage() {
  const { language, members } = useAppContext();
  const [isDownloadOpen, setDownloadOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(members[0] || null);

  return (
    <motion.div
      className="container mx-auto flex-1 p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{language === 'bn' ? 'স্মার্ট কার্ড' : 'Smart Card'}</h1>
          <p className="text-muted-foreground">
            {language === 'bn' ? 'সদস্যদের জন্য স্মার্ট কার্ড তৈরি ও ডাউনলোড করুন।' : 'Generate and download smart cards for members.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setDownloadOpen(true)}>
            <Download className="mr-2 h-4 w-4" /> {language === 'bn' ? 'কার্ড ডাউনলোড করুন' : 'Download Card'}
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        {selectedMember ? (
           <div className="w-full max-w-lg">
             <SmartCard member={selectedMember} />
           </div>
        ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg p-12 h-[500px]">
                <CreditCard className="h-16 w-16 mb-4" />
                <h3 className="text-xl font-semibold">{language === 'bn' ? 'কোনো সদস্য নির্বাচিত নেই' : 'No Member Selected'}</h3>
                <p>{language === 'bn' ? 'একটি কার্ড প্রিভিউ করতে ডাউনলোড ডায়ালগ থেকে একজন সদস্য নির্বাচন করুন।' : 'Select a member from the download dialog to preview a card.'}</p>
            </div>
        )}
      </div>

      <DownloadSmartCardDialog
        open={isDownloadOpen}
        onOpenChange={setDownloadOpen}
        setSelectedMember={setSelectedMember}
      />
    </motion.div>
  );
}
