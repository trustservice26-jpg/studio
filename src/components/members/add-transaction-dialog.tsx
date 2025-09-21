
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppContext } from '@/context/app-context';
import { Label } from '../ui/label';

const transactionSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
  description: z.string().optional(),
  memberId: z.string().optional(),
  customDonorName: z.string().optional(),
}).refine(data => {
    if (data.memberId === 'other') {
        return !!data.customDonorName;
    }
    return true;
}, {
    message: "Donor name is required when 'Other' is selected.",
    path: ['customDonorName'],
});

type AddTransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'donation' | 'withdrawal';
};

export function AddTransactionDialog({ open, onOpenChange, type }: AddTransactionDialogProps) {
  const { addTransaction, members, language } = useAppContext();
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      description: '',
      memberId: '',
      customDonorName: '',
    },
  });

  const memberIdValue = form.watch('memberId');

  React.useEffect(() => {
    form.reset({
        amount: 0,
        description: '',
        memberId: '',
        customDonorName: '',
    });
    setPassword('');
    setPasswordError('');
  }, [open, form]);

  const handleMemberChange = (value: string) => {
    form.setValue('memberId', value);
    if (value !== 'other') {
        form.setValue('customDonorName', '');
    }
  }
  
  const isDonation = type === 'donation';
  const title = isDonation ? (language === 'bn' ? 'নতুন অনুদান যোগ করুন' : 'Add New Donation') : (language === 'bn' ? 'নতুন উত্তোলন যোগ করুন' : 'Add New Withdrawal');
  const description = isDonation ? (language === 'bn' ? 'অনুদান যোগ করতে বিবরণ লিখুন।' : 'Enter the details of the new donation.') : (language === 'bn' ? 'উত্তোলন যোগ করতে বিবরণ লিখুন।' : 'Enter the details of the new withdrawal.');
  
  function onSubmit(values: z.infer<typeof transactionSchema>) {
    setPasswordError('');

    if (!isDonation) {
        if (password !== 'ADMIN') {
            setPasswordError(language === 'bn' ? 'ভুল পাসওয়ার্ড।' : 'Incorrect password.');
            return;
        }
    }

    const description = values.description || (isDonation ? (language === 'bn' ? 'অনুদান' : 'Donation') : (language === 'bn' ? 'উত্তোলন' : 'Withdrawal'));
    
    let memberName = '';
    if (values.memberId === 'other') {
        memberName = values.customDonorName || (language === 'bn' ? 'অজানা' : 'Anonymous');
    } else {
        const member = members.find(m => m.id === values.memberId);
        memberName = member ? member.name : (language === 'bn' ? 'অজানা' : 'Anonymous');
    }
    
    addTransaction({ ...values, memberName, description, type });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'bn' ? 'পরিমাণ' : 'Amount'}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isDonation && (
              <>
                 <FormField
                    control={form.control}
                    name="memberId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{language === 'bn' ? 'দাতা' : 'Donated By'}</FormLabel>
                        <Select onValueChange={handleMemberChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder={language === 'bn' ? 'দাতা নির্বাচন করুন' : 'Select a donor'} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="anonymous">{language === 'bn' ? 'অজানা' : 'Anonymous'}</SelectItem>
                            {members.filter(member => member.status === 'active').map(member => (
                                <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                            ))}
                             <SelectItem value="other">{language === 'bn' ? 'অন্যান্য...' : 'Other...'}</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                {memberIdValue === 'other' && (
                  <FormField
                    control={form.control}
                    name="customDonorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'bn' ? 'দাতার নাম' : 'Donor Name'}</FormLabel>
                        <FormControl>
                          <Input placeholder={language === 'bn' ? 'দাতার নাম লিখুন' : 'Enter donor name'} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'bn' ? 'বিবরণ (ঐচ্ছিক)' : 'Description (Optional)'}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isDonation && (
                <div className="space-y-2">
                  <Label htmlFor="withdrawal-password">{language === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড' : 'Admin Password'}</Label>
                  <Input
                    id="withdrawal-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'bn' ? 'পাসওয়ার্ড লিখুন' : 'Enter password'}
                  />
                  {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
                </div>
            )}
            <DialogFooter>
              <Button type="submit">{isDonation ? (language === 'bn' ? 'অনুদান যোগ করুন' : 'Add Donation') : (language === 'bn' ? 'উত্তোলন যোগ করুন' : 'Add Withdrawal')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
