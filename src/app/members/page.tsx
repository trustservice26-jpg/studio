'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/members/columns';
import { useAppContext } from '@/context/app-context';
import { AddMemberDialog } from '@/components/members/add-member-dialog';
import { Input } from '@/components/ui/input';

export default function MembersPage() {
  const { members, userRole, language } = useAppContext();
  const [isAddMemberOpen, setAddMemberOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('');

  const filteredMembers = React.useMemo(() => {
    return members.filter(member =>
      member.name.toLowerCase().includes(filter.toLowerCase()) ||
      member.email.toLowerCase().includes(filter.toLowerCase())
    );
  }, [members, filter]);

  return (
    <motion.div
      className="container mx-auto py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{language === 'bn' ? 'সদস্য তালিকা' : 'Member Directory'}</h1>
          <p className="text-muted-foreground">
            {language === 'bn' ? 'সংগঠনের সকল সদস্যদের তালিকা।' : 'A list of all members in the organization.'}
          </p>
        </div>
        {userRole === 'admin' && (
          <Button onClick={() => setAddMemberOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> {language === 'bn' ? 'সদস্য যোগ করুন' : 'Add Member'}
          </Button>
        )}
      </div>

      <DataTable columns={columns} data={filteredMembers}>
         <Input
          placeholder={language === 'bn' ? 'সদস্য খুঁজুন...' : 'Filter members...'}
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
      </DataTable>

      <AddMemberDialog open={isAddMemberOpen} onOpenChange={setAddMemberOpen} />
    </motion.div>
  );
}
