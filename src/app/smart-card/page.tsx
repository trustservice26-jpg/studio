
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Download, User, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import type { Member } from '@/lib/types';
import { SmartCard } from '@/components/smart-card/smart-card';
import { DownloadSmartCardDialog } from '@/components/smart-card/download-smart-card-dialog';
import { useIsClient } from '@/hooks/use-is-client';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [open, setOpen] = React.useState(false);
  const isClient = useIsClient();
  
  const activeMembers = React.useMemo(() => members.filter(m => m.status === 'active'), [members]);

  const handleMemberSelect = (memberId: string) => {
    const member = activeMembers.find(m => m.id === memberId) || null;
    setSelectedMember(member);
    setOpen(false);
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

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
            <div className="w-full max-w-sm">
                <label className="text-sm font-medium mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {language === 'bn' ? 'সদস্য খুঁজুন' : 'Search for a member'}
                </label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {selectedMember
                        ? `${selectedMember.name} (${selectedMember.memberId})`
                        : (language === 'bn' ? 'সদস্য নির্বাচন করুন...' : 'Select member...')}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full max-w-sm p-0">
                    <Command>
                      <CommandInput placeholder={language === 'bn' ? 'নাম বা আইডি দিয়ে খুঁজুন...' : 'Search by name or ID...'} />
                      <CommandList>
                        <CommandEmpty>{language === 'bn' ? 'কোনো সদস্য পাওয়া যায়নি।' : 'No member found.'}</CommandEmpty>
                        <CommandGroup>
                          {activeMembers.map((member) => (
                            <CommandItem
                              key={member.id}
                              value={`${member.name} ${member.memberId}`}
                              onSelect={() => handleMemberSelect(member.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedMember?.id === member.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {member.name} ({member.memberId})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
            </div>
            <Button onClick={() => setDownloadDialogOpen(true)} disabled={!selectedMember} className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" /> {language === 'bn' ? 'স্মার্ট কার্ড ডাউনলোড' : 'Download Smart Card'}
            </Button>
        </div>
        
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

      </motion.div>
      <DownloadSmartCardDialog
        open={isDownloadDialogOpen}
        onOpenChange={setDownloadDialogOpen}
        member={selectedMember}
      />
    </>
  );
}

