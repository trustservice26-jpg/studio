
'use client';

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
import { Textarea } from '../ui/textarea';

const transactionSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
  description: z.string().min(2, { message: 'Description must be at least 2 characters.' }),
  memberName: z.string().optional(),
});

type AddTransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'donation' | 'withdrawal';
};

export function AddTransactionDialog({ open, onOpenChange, type }: AddTransactionDialogProps) {
  const { addTransaction, members, language } = useAppContext();

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      description: '',
      memberName: '',
    },
  });
  
  const isDonation = type === 'donation';
  const title = isDonation ? (language === 'bn' ? 'নতুন অনুদান যোগ করুন' : 'Add New Donation') : (language === 'bn' ? 'নতুন উত্তোলন যোগ করুন' : 'Add New Withdrawal');
  const description = isDonation ? (language === 'bn' ? 'অনুদান যোগ করতে বিবরণ লিখুন।' : 'Enter the details of the new donation.') : (language === 'bn' ? 'উত্তোলন যোগ করতে বিবরণ লিখুন।' : 'Enter the details of the new withdrawal.');

  function onSubmit(values: z.infer<typeof transactionSchema>) {
    addTransaction({ ...values, type });
    form.reset();
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
                 <FormField
                    control={form.control}
                    name="memberName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{language === 'bn' ? 'দাতা (ঐচ্ছিক)' : 'Donated By (Optional)'}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder={language === 'bn' ? 'সদস্য নির্বাচন করুন' : 'Select a member'} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="">{language === 'bn' ? 'অজানা/অন্যান্য' : 'Anonymous/Other'}</SelectItem>
                            {members.map(member => (
                                <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'bn' ? 'বিবরণ' : 'Description'}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={language === 'bn' ? 'লেনদেনের উদ্দেশ্য...' : 'Purpose of transaction...'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{isDonation ? (language === 'bn' ? 'অনুদান যোগ করুন' : 'Add Donation') : (language === 'bn' ? 'উত্তোলন যোগ করুন' : 'Add Withdrawal')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
