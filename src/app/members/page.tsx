
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Download, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/members/columns';
import { useAppContext } from '@/context/app-context';
import { Input } from '@/components/ui/input';
import { DownloadPdfDialog } from '@/components/members/download-pdf-dialog';
import { AddMemberDialog } from '@/components/members/add-member-dialog';

export default function MembersPage() {
  const { members, user, language } = useAppContext();
  const [isPdfOpen, setPdfOpen] = React.useState(false);
  const [isAddMemberOpen, setAddMemberOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('');

  const filteredMembers = React.useMemo(() => {
    return members.filter(member =>
      member.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [members, filter]);

  const canManageMembers = user?.role === 'admin' || user?.permissions?.canManageMembers;
  
  return (
    <motion.div
      className="container mx-auto flex-1 p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{language === 'bn' ? 'সদস্য তালিকা' : 'Member Directory'}</h1>
          <p className="text-muted-foreground">
            {language === 'bn' ? 'সংগঠনের সকল সদস্যদের তালিকা।' : 'A list of all members in the organization.'}
          </p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => setPdfOpen(true)} variant="outline">
                <Download className="mr-2 h-4 w-4" /> {language === 'bn' ? 'পিডিএফ ডাউনলোড' : 'Download PDF'}
            </Button>
            {canManageMembers && (
                <Button onClick={() => setAddMemberOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" /> {language === 'bn' ? 'সদস্য যোগ করুন' : 'Add Member'}
                </Button>
            )}
        </div>
      </div>

      <DataTable columns={columns} data={filteredMembers} noPagination>
         <Input
          placeholder={language === 'bn' ? 'সদস্য খুঁজুন...' : 'Filter members...'}
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm w-full"
        />
      </DataTable>

      <DownloadPdfDialog open={isPdfOpen} onOpenChange={setPdfOpen} />
      <AddMemberDialog open={isAddMemberOpen} onOpenChange={setAddMemberOpen} />
    </motion.div>
  );
}
