
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
import { useAppContext } from '@/context/app-context';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

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
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);

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
  const activeMembers = React.useMemo(() => members.filter(m => m.status === 'active'), [members]);

  React.useEffect(() => {
    form.reset({
        amount: 0,
        description: '',
        memberId: '',
        customDonorName: '',
    });
  }, [open, form]);

  const handleMemberChange = (value: string) => {
    form.setValue('memberId', value);
    if (value !== 'other') {
        form.setValue('customDonorName', '');
    }
    setPopoverOpen(false);
  }
  
  const isDonation = type === 'donation';
  const title = isDonation ? (language === 'bn' ? 'নতুন অনুদান যোগ করুন' : 'Add New Donation') : (language === 'bn' ? 'নতুন উত্তোলন যোগ করুন' : 'Add New Withdrawal');
  const description = isDonation ? (language === 'bn' ? 'অনুদান যোগ করতে বিবরণ লিখুন।' : 'Enter the details of the new donation.') : (language === 'bn' ? 'উত্তোলন যোগ করতে বিবরণ লিখুন।' : 'Enter the details of the new withdrawal.');
  
  function onSubmit(values: z.infer<typeof transactionSchema>) {
    const description = values.description || (isDonation ? (language === 'bn' ? 'অনুদান' : 'Donation') : (language === 'bn' ? 'উত্তোলন' : 'Withdrawal'));
    
    let memberName = '';
    if (isDonation) {
      if (values.memberId === 'other') {
          memberName = values.customDonorName || (language === 'bn' ? 'অজানা' : 'Anonymous');
      } else {
          const member = members.find(m => m.id === values.memberId);
          memberName = member ? member.name : (language === 'bn' ? 'অজানা' : 'Anonymous');
      }
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
                    <FormItem className="flex flex-col">
                        <FormLabel>{language === 'bn' ? 'দাতা' : 'Donated By'}</FormLabel>
                        <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value === 'anonymous' 
                                        ? (language === 'bn' ? 'অজানা' : 'Anonymous')
                                        : field.value === 'other'
                                        ? (language === 'bn' ? 'অন্যান্য...' : 'Other...')
                                        : field.value
                                        ? activeMembers.find(m => m.id === field.value)?.name
                                        : (language === 'bn' ? 'দাতা নির্বাচন করুন' : "Select a donor")}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder={language === 'bn' ? 'দাতা খুঁজুন...' : 'Search donor...'} />
                                    <CommandList>
                                        <CommandEmpty>{language === 'bn' ? 'কোন দাতা পাওয়া যায়নি।' : 'No donor found.'}</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem
                                                value={language === 'bn' ? 'অজানা anonymous' : 'Anonymous anonymous'}
                                                onSelect={() => handleMemberChange('anonymous')}
                                            >
                                                <Check className={cn("mr-2 h-4 w-4", field.value === 'anonymous' ? "opacity-100" : "opacity-0")} />
                                                {language === 'bn' ? 'অজানা' : 'Anonymous'}
                                            </CommandItem>
                                            {activeMembers.map((member) => (
                                                <CommandItem
                                                    value={`${member.name} ${member.memberId}`}
                                                    key={member.id}
                                                    onSelect={() => handleMemberChange(member.id)}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", field.value === member.id ? "opacity-100" : "opacity-0")} />
                                                    <div className="flex flex-col">
                                                        <span>{member.name}</span>
                                                        <span className="text-[10px] text-muted-foreground">{member.memberId}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                            <CommandItem
                                                value={language === 'bn' ? 'অন্যান্য other' : 'Other other'}
                                                onSelect={() => handleMemberChange('other')}
                                            >
                                                <Check className={cn("mr-2 h-4 w-4", field.value === 'other' ? "opacity-100" : "opacity-0")} />
                                                {language === 'bn' ? 'অন্যান্য...' : 'Other...'}
                                            </CommandItem>
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
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
            <DialogFooter>
              <Button type="submit">{isDonation ? (language === 'bn' ? 'অনুদান যোগ করুন' : 'Add Donation') : (language === 'bn' ? 'উত্তোলন যোগ করুন' : 'Add Withdrawal')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
