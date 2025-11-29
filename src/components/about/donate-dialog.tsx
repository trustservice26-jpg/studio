
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppContext } from '@/context/app-context';
import { Check, ChevronsUpDown, User, Users } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import type { Member } from '@/lib/types';


const donationSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
  donorType: z.enum(['member', 'public']),
  memberId: z.string().optional(),
  publicDonorName: z.string().optional(),
  transactionId: z.string().optional(),
}).refine(data => {
    if (data.donorType === 'member') return !!data.memberId;
    return true;
}, {
    message: "Please select a member.",
    path: ['memberId'],
}).refine(data => {
    if (data.donorType === 'public') return !!data.publicDonorName;
    return true;
}, {
    message: "Please enter your name.",
    path: ['publicDonorName'],
});

type DonateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DonateDialog({ open, onOpenChange }: DonateDialogProps) {
  const { addTransaction, members, language } = useAppContext();
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);

  const form = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 0,
      donorType: 'member',
      memberId: '',
      publicDonorName: '',
      transactionId: '',
    },
  });
  
  const donorType = form.watch('donorType');
  const activeMembers = React.useMemo(() => members.filter(m => m.status === 'active'), [members]);


  React.useEffect(() => {
    form.reset({
        amount: 0,
        donorType: 'member',
        memberId: '',
        publicDonorName: '',
        transactionId: ''
    });
  }, [open, form]);

  const handleMemberSelect = (member: Member) => {
    form.setValue('memberId', member.id);
    setPopoverOpen(false);
  }

  function onSubmit(values: z.infer<typeof donationSchema>) {
    let memberName = '';
    if (values.donorType === 'member') {
        const member = members.find(m => m.id === values.memberId);
        memberName = member ? member.name : (language === 'bn' ? 'অজানা' : 'Anonymous');
    } else {
        memberName = values.publicDonorName || (language === 'bn' ? 'অজানা' : 'Anonymous');
    }
    
    addTransaction({ 
        amount: values.amount,
        type: 'donation',
        description: language === 'bn' ? 'অনলাইন অনুদান' : 'Online Donation',
        memberName: memberName,
        transactionId: values.transactionId
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{language === 'bn' ? 'অনুদান করুন' : 'Make a Donation'}</DialogTitle>
          <DialogDescription>{language === 'bn' ? 'আপনার উদারতা আমাদের সম্প্রদায়কে শক্তিশালী করে।' : 'Your generosity strengthens our community.'}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'bn' ? 'লেনদেন আইডি (ঐচ্ছিক)' : 'Transaction ID (Optional)'}</FormLabel>
                  <FormControl>
                    <Input placeholder={language === 'bn' ? 'ম্যানুয়ালি আইডি লিখুন বা পেস্ট করুন' : 'Manually type or paste ID'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            
            <FormField
              control={form.control}
              name="donorType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{language === 'bn' ? 'আমি একজন...' : 'I am a...'}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <FormItem>
                        <FormControl>
                           <RadioGroupItem value="member" id="member" className="sr-only peer" />
                        </FormControl>
                         <Label htmlFor="member" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <Users className="mb-3 h-6 w-6" />
                            {language === 'bn' ? 'সদস্য দাতা' : 'Member Donor'}
                        </Label>
                      </FormItem>
                      <FormItem>
                       <FormControl>
                          <RadioGroupItem value="public" id="public" className="sr-only peer" />
                        </FormControl>
                         <Label htmlFor="public" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <User className="mb-3 h-6 w-6" />
                            {language === 'bn' ? 'সাধারণ দাতা' : 'Public Donor'}
                         </Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {donorType === 'member' && (
                <FormField
                    control={form.control}
                    name="memberId"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>{language === 'bn' ? 'সদস্য নির্বাচন করুন' : 'Select Member'}</FormLabel>
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
                                    {field.value
                                    ? activeMembers.find(
                                        (member) => member.id === field.value
                                    )?.name
                                    : (language === 'bn' ? 'সদস্য নির্বাচন করুন' : "Select member")}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                <Command>
                                <CommandInput placeholder={language === 'bn' ? 'সদস্য খুঁজুন...' : 'Search member...'} />
                                <CommandList>
                                <CommandEmpty>{language === 'bn' ? 'কোন সদস্য পাওয়া যায়নি।' : 'No member found.'}</CommandEmpty>
                                <CommandGroup>
                                    {activeMembers.map((member) => (
                                    <CommandItem
                                        value={member.name}
                                        key={member.id}
                                        onSelect={() => handleMemberSelect(member)}
                                    >
                                        <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            member.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                        />
                                        {member.name}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                                </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}

            {donorType === 'public' && (
                 <FormField
                    control={form.control}
                    name="publicDonorName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{language === 'bn' ? 'আপনার নাম' : 'Your Name'}</FormLabel>
                        <FormControl>
                            <Input placeholder={language === 'bn' ? 'যেমন, মোঃ আব্দুল্লাহ' : 'e.g., John Doe'} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <DialogFooter>
              <Button type="submit">{language === 'bn' ? 'এখনই দান করুন' : 'Donate Now'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
