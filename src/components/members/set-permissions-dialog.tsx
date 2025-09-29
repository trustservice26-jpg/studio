
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import type { Member } from '@/lib/types';
import { Switch } from '../ui/switch';

type SetPermissionsDialogProps = {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SetPermissionsDialog({ member, open, onOpenChange }: SetPermissionsDialogProps) {
  const { updateMemberPermissions, language } = useAppContext();
  const [canManageTransactions, setCanManageTransactions] = React.useState(
    !!member.permissions?.canManageTransactions
  );
  const [canManageMembers, setCanManageMembers] = React.useState(
    !!member.permissions?.canManageMembers
  );

  React.useEffect(() => {
    if (open) {
      setCanManageTransactions(!!member.permissions?.canManageTransactions);
      setCanManageMembers(!!member.permissions?.canManageMembers);
    }
  }, [open, member.permissions]);

  const handleSave = () => {
    const newPermissions = { canManageTransactions, canManageMembers };
    
    let newRole: Member['role'] | undefined = undefined;
    if (canManageTransactions || canManageMembers) {
      newRole = 'moderator';
    }

    updateMemberPermissions(member.id, newPermissions, newRole);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'bn' ? `${member.name}-এর জন্য অনুমতি` : `Permissions for ${member.name}`}
          </DialogTitle>
          <DialogDescription>
            {language === 'bn' ? 'মডারেটর হিসাবে এই সদস্যের জন্য অনুমতিগুলি পরিচালনা করুন।' : 'Manage permissions for this member.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {language === 'bn' ? 'লেনদেন পরিচালনা' : 'Manage Transactions'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'অনুদান এবং উত্তোলন যোগ করার অনুমতি দিন।' : 'Allow adding donations and withdrawals.'}
              </p>
            </div>
            <Switch
              checked={canManageTransactions}
              onCheckedChange={setCanManageTransactions}
              id="manage-transactions-permission"
            />
          </div>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {language === 'bn' ? 'সদস্য পরিচালনা' : 'Manage Members'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'সদস্যদের যোগ, সম্পাদনা এবং মুছে ফেলার অনুমতি দিন।' : 'Allow adding, editing, and deleting members.'}
              </p>
            </div>
            <Switch
              checked={canManageMembers}
              onCheckedChange={setCanManageMembers}
              id="manage-members-permission"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </Button>
          <Button onClick={handleSave}>
            {language === 'bn' ? 'সংরক্ষণ' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    