
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Download, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import type { Member } from '@/lib/types';
import { SmartCard } from '@/components/smart-card/smart-card';
import { DownloadSmartCardDialog } from '@/components/smart-card/download-smart-card-dialog';
import { useIsClient } from '@/hooks/use-is-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { smartCardMemberColumns } from '@/components/smart-card/columns';
import { Input } from '@/components/ui/input';

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
  const [filter, setFilter] = React.useState('');
  const isClient = useIsClient();
  
  const activeMembers = React.useMemo(() => members.filter(m => m.status === 'active'), [members]);
  
  const filteredMembers = React.useMemo(() => {
    return activeMembers.filter(member =>
      member.name.toLowerCase().includes(filter.toLowerCase()) ||
      (member.memberId && member.memberId.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [activeMembers, filter]);

  const memberForDisplay = selectedMember || sampleMember;

  const handleRowClick = (member: Member) => {
    setSelectedMember(member);
    const cardElement = document.getElementById('smart-card-view');
    if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const columns = smartCardMemberColumns;

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
            <h1 className="text-2xl sm:text-3xl font-bold">{language === 'bn' ? 'সদস্য স্মার্ট কার্ড' : 'Membership Smart Card'}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {language === 'bn' ? 'আপনার সদস্য কার্ড দেখুন এবং ডাউনলোড করুন।' : 'View and download your membership card.'}
            </p>
          </div>
           <Button onClick={() => setDownloadDialogOpen(true)} disabled={!selectedMember} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> {language === 'bn' ? 'স্মার্ট কার্ড ডাউনলোড' : 'Download Smart Card'}
           </Button>
        </div>
        
        <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">{language === 'bn' ? 'সদস্য নির্বাচন করুন' : 'Select a Member'}</h2>
            <DataTable columns={columns} data={filteredMembers} pageSize={3} onRowClick={handleRowClick}>
                <Input
                placeholder={language === 'bn' ? 'নাম বা আইডি দিয়ে সদস্য খুঁজুন...' : 'Filter by name or ID...'}
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="max-w-sm w-full"
                />
            </DataTable>
        </div>

        <Card id="smart-card-view">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <CreditCard />
                    {selectedMember ? `${language === 'bn' ? 'স্মার্ট কার্ড ভিউ:' : 'Smart Card View:'} ${selectedMember.name}` : (language === 'bn' ? 'স্মার্ট কার্ড ভিউ' : 'Smart Card View')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isClient && (
                <>
                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl font-semibold mb-4">{language === 'bn' ? 'কার্ডের সামনের অংশ' : 'Card Front'}</h2>
                            <SmartCard member={memberForDisplay} side="front" />
                        </div>
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl font-semibold mb-4">{language === 'bn' ? 'কার্ডের পিছনের অংশ' : 'Card Back'}</h2>
                            <SmartCard member={memberForDisplay} side="back" />
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden max-w-md mx-auto">
                    <Tabs defaultValue="front" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="front">{language === 'bn' ? 'সামনের অংশ' : 'Front'}</TabsTrigger>
                        <TabsTrigger value="back">{language === 'bn' ? 'পিছনের অংশ' : 'Back'}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="front" className="mt-4">
                        <SmartCard member={memberForDisplay} side="front" />
                        </TabsContent>
                        <TabsContent value="back" className="mt-4">
                        <SmartCard member={memberForDisplay} side="back" />
                        </TabsContent>
                    </Tabs>
                    </div>
                </>
                )}
            </CardContent>
        </Card>
      </motion.div>
      <DownloadSmartCardDialog
        open={isDownloadDialogOpen}
        onOpenChange={setDownloadDialogOpen}
        member={selectedMember}
      />
    </>
  );
}
