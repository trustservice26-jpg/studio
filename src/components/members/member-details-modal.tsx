
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

import type { Member } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '../ui/badge';

type MemberDetailsModalProps = {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MemberDetailsModal({
  member,
  open,
  onOpenChange,
}: MemberDetailsModalProps) {
  const { language } = useAppContext();
  
  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'PP', { locale: language === 'bn' ? bn : undefined });
  };
  
  const DetailRow = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
    <div className="py-2 px-3 grid grid-cols-3 gap-4 hover:bg-muted/50 rounded-md">
        <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
        <dd className="text-sm col-span-2">{value || <span className="text-muted-foreground/60">N/A</span>}</dd>
    </div>
  )

  const roles = [];
    if(member.role === 'admin') {
        roles.push(language === 'bn' ? 'এডমিন' : 'Admin');
    }
    if (member.permissions?.canManageTransactions) {
        roles.push(language === 'bn' ? 'লেনদেন মডারেটর' : 'Transaction Moderator');
    }
    if (member.permissions?.canManageMembers) {
        roles.push(language === 'bn' ? 'সদস্য মডারেটর' : 'Member Moderator');
    }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {language === 'bn'
              ? `${member.name}-এর বিবরণ`
              : `Details for ${member.name}`}
          </DialogTitle>
          <DialogDescription>
            {language === 'bn'
              ? `সদস্য সম্পর্কে বিস্তারিত তথ্য নিচে দেওয়া হলো।`
              : 'Detailed information about the member.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96">
          <dl className="divide-y divide-border">
            <DetailRow label={language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'} value={member.name} />
            <DetailRow label={language === 'bn' ? 'সদস্য আইডি' : 'Member ID'} value={<span className="font-mono">{member.memberId}</span>} />
            <DetailRow label={language === 'bn' ? 'অবস্থা' : 'Status'} value={
                <Badge variant={member.status === 'active' ? "default" : "secondary"} className={member.status === "active" ? "bg-green-500/20 text-green-700 border-green-500/20" : ""}>
                    {member.status === 'active' ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}
                </Badge>
            } />
             <DetailRow label={language === 'bn' ? 'ভূমিকা' : 'Roles'} value={
                roles.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {roles.map(r => <Badge key={r} variant={member.role === 'admin' ? "default" : "secondary"}>{r}</Badge>)}
                    </div>
                ) : <span className="text-muted-foreground">{language === 'bn' ? 'সদস্য' : 'Member'}</span>
            } />
            <DetailRow label={language === 'bn' ? 'যোগদানের তারিখ' : 'Join Date'} value={formatDate(member.joinDate)} />
            <DetailRow label={language === 'bn' ? 'ফোন' : 'Phone'} value={<a href={`tel:${member.phone}`} className="hover:underline">{member.phone}</a>} />
            <DetailRow label={language === 'bn' ? 'ইমেইল' : 'Email'} value={member.email ? <a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a> : null} />
            <DetailRow label={language === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'} value={member.dob} />
            <DetailRow label={language === 'bn' ? 'পিতার নাম' : 'Father\'s Name'} value={member.fatherName} />
            <DetailRow label={language === 'bn' ? 'মাতার নাম' : 'Mother\'s Name'} value={member.motherName} />
            <DetailRow label={language === 'bn' ? 'এনআইডি / জন্ম সনদ' : 'NID / Birth Cert.'} value={member.nid} />
            <DetailRow label={language === 'bn' ? 'ঠিকানা' : 'Address'} value={member.address} />
          </dl>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
