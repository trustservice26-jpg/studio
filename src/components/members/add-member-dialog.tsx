
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

const memberSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Phone number is too short.' }),
  status: z.enum(['active', 'inactive']),
});

type AddMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddMemberDialog({ open, onOpenChange }: AddMemberDialogProps) {
  const { addMember, language } = useAppContext();

  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      phone: '',
      status: 'active',
    },
  });

  function onSubmit(values: z.infer<typeof memberSchema>) {
    addMember(values);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{language === 'bn' ? 'নতুন সদস্য যোগ করুন' : 'Add New Member'}</DialogTitle>
          <DialogDescription>
            {language === 'bn' ? 'সংগঠনে নতুন সদস্য যোগ করতে তাদের বিবরণ লিখুন।' : 'Enter the details of the new member to add them to the organization.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}</FormLabel>
                  <FormControl>
                    <Input placeholder={language === 'bn' ? 'অনিকা শর্মা' : 'Anika Sharma'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'bn' ? 'ফোন' : 'Phone'}</FormLabel>
                  <FormControl>
                    <Input placeholder="+8801700000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'bn' ? 'অবস্থা' : 'Status'}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'bn' ? 'সদস্যের অবস্থা নির্বাচন করুন' : 'Select member status'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">{language === 'bn' ? 'সক্রিয়' : 'Active'}</SelectItem>
                        <SelectItem value="inactive">{language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <DialogFooter>
              <Button type="submit">{language === 'bn' ? 'সদস্য যোগ করুন' : 'Add Member'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
