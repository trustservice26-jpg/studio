
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Download, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppContext } from '@/context/app-context';
import type { Member } from '@/lib/types';
import { SmartCard } from '@/components/smart-card/smart-card';
import { DownloadSmartCardDialog } from '@/components/smart-card/download-smart-card-dialog';
import { useIsClient } from '@/hooks/use-is-client';

const sampleMember: Partial<Member> = {
  name: 'Sample Member',
  memberId: 'H-0000',
  joinDate: new Date().toISOString(),
  status: 'active',
  phone: '+8801234567890',
  dob: '01-01-2000',
  fatherName: "Sample Father",
  nid: '1234567890',
  address: 'Sample Address, Bangladesh'
};


export default function SmartCardPage() {
  const { language, members } = useAppContext();
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [isDownloadDialogOpen, setDownloadDialogOpen] = React.useState(false);
  const isClient = useIsClient();
  
  const handleMemberSelect = (memberId: string) => {
    const member = members.find(m => m.id === memberId) || null;
    setSelectedMember(member);
  };
  
  const memberForDisplay = selectedMember || sampleMember;

  return (
    <>
      <motion.div
        className="container mx-auto flex-1 p-4 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{language === 'bn' ? 'সদস্য স্মার্ট কার্ড' : 'Membership Smart Card'}</h1>
            <p className="text-muted-foreground">
              {language === 'bn' ? 'আপনার সদস্য কার্ড দেখুন এবং ডাউনলোড করুন।' : 'View and download your membership card.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-8">
            <div className="w-full max-w-sm">
                <label className="text-sm font-medium mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {language === 'bn' ? 'আপনার নাম নির্বাচন করুন' : 'Select Your Name'}
                </label>
                 <Select onValueChange={handleMemberSelect} value={selectedMember?.id || ''}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={language === 'bn' ? 'সদস্য নির্বাচন করুন' : 'Select a member'} />
                    </SelectTrigger>
                    <SelectContent>
                        {members.map(member => (
                        <SelectItem key={member.id} value={member.id}>{member.name} ({member.memberId})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={() => setDownloadDialogOpen(true)} disabled={!selectedMember}>
                <Download className="mr-2 h-4 w-4" /> {language === 'bn' ? 'স্মার্ট কার্ড ডাউনলোড' : 'Download Smart Card'}
            </Button>
        </div>
        
        {isClient && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center">
                  <h2 className="text-xl font-semibold mb-4">{language === 'bn' ? 'কার্ডের সামনের অংশ' : 'Card Front'}</h2>
                  <SmartCard member={memberForDisplay} side="front" />
              </div>
              <div className="flex flex-col items-center">
                  <h2 className="text-xl font-semibold mb-4">{language === 'bn' ? 'কার্ডের পিছনের অংশ' : 'Card Back'}</h2>
                  <SmartCard member={memberForDisplay} side="back" />
              </div>
          </div>
        )}

      </motion.div>
      <DownloadSmartCardDialog
        open={isDownloadDialogOpen}
        onOpenChange={setDownloadDialogOpen}
        member={selectedMember}
      />
    </>
  );
}
