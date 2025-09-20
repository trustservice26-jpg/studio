
'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Download, Loader2 } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';


const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number is too short.' }),
  dob: z.date({ required_error: 'Date of birth is required.' }),
  fatherName: z.string().min(2, { message: "Father's name is required." }),
  motherName: z.string().min(2, { message: "Mother's name is required." }),
  nid: z.string().min(10, { message: 'NID or Birth Certificate No. is required.' }),
  address: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

type RegisterMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RegisterMemberDialog({ open, onOpenChange }: RegisterMemberDialogProps) {
  const { language, addMember } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormValues | null>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      fatherName: '',
      motherName: '',
      nid: '',
      address: '',
    },
  });

  const handleGeneratePdf = async (values: RegistrationFormValues) => {
    addMember({
      ...values,
      dob: values.dob.toISOString(),
      status: 'inactive'
    }, true);
    
    setFormData(values);
    setIsLoading(true);

    // Allow time for the hidden div to render with the new data
    setTimeout(async () => {
      const pdfElement = document.getElementById('pdf-registration-content');
      if (!pdfElement) {
        setIsLoading(false);
        return;
      }

      const canvas = await html2canvas(pdfElement, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      let canvasPdfWidth = pdfWidth - 20; // 10mm margin on each side
      let canvasPdfHeight = canvasPdfWidth / ratio;

      if (canvasPdfHeight > pdfHeight - 20) {
        canvasPdfHeight = pdfHeight - 20;
        canvasPdfWidth = canvasPdfHeight * ratio;
      }

      const x = (pdfWidth - canvasPdfWidth) / 2;
      const y = 10;

      pdf.addImage(imgData, 'PNG', x, y, canvasPdfWidth, canvasPdfHeight);
      pdf.save(`${values.name}-registration-form.pdf`);

      setIsLoading(false);
      onOpenChange(false);
      form.reset();
    }, 1000);
  };
  
  const conditions_en = [
    "ALL members will have to active at any time.",
    "If any member will not active in organization team then he will shown as inactive.",
    "IF any members does not give money for orgnisation or making late more then 3 times then he will be inactive also can make resigned from the organization team.",
    "For adding again as a member he will have to registered for member and also have to give late fine 50 taka for adding again as a member.",
    "If any member make improper behavior then he will have to resigned from organization team.",
    "For late paying he will have to pay 20 taka extra ,which will add in the organization fund otherwise admin can make inactive.",
    "You as a member cannot collect money from other member team if it is proof then he will have to make resigned from the team.",
    "If member collect from outsource then it will have to give proof otherwise it will not exceptable.",
    "If the member give money to other member for the organization team then this risk will taken by that member who collected the money.",
    "Remember ,Never tell a lie , because this organization will growup if all member are as a friend.",
    "Every member will have a chance to talk with organistion team about his idea,so we can growup.",
    "We all are friend and we will support the society and family members also."
  ];

  const conditions_bn = [
    "সকল সদস্যকে সর্বদা সক্রিয় থাকতে হবে।",
    "যদি কোনো সদস্য সংগঠনের দলে সক্রিয় না থাকেন তবে তাকে নিষ্ক্রিয় হিসাবে দেখানো হবে।",
    "যদি কোনো সদস্য সংগঠনের জন্য টাকা না দেন বা ৩ বারের বেশি দেরি করেন তবে তাকে নিষ্ক্রিয় করা হবে এবং সংগঠন থেকে পদত্যাগ করানো হতে পারে।",
    "পুনরায় সদস্য হিসাবে যোগদানের জন্য তাকে সদস্য হিসাবে নিবন্ধিত হতে হবে এবং পুনরায় সদস্য হিসাবে যোগদানের জন্য ৫০ টাকা বিলম্ব জরিমানা দিতে হবে।",
    "যদি কোনো সদস্য অশোভন আচরণ করেন তবে তাকে সংগঠন থেকে পদত্যাগ করতে হবে।",
    "বিলম্ব পরিশোধের জন্য তাকে ২০ টাকা অতিরিক্ত দিতে হবে, যা সংগঠনের তহবিলে যোগ হবে, অন্যথায় অ্যাডমিন তাকে নিষ্ক্রিয় করতে পারে।",
    "আপনি সদস্য হিসাবে অন্য কোনো সদস্যের কাছ থেকে টাকা সংগ্রহ করতে পারবেন না, যদি তা প্রমাণিত হয় তবে তাকে দল থেকে পদত্যাগ করতে হবে।",
    "যদি সদস্য বাইরের উৎস থেকে টাকা সংগ্রহ করেন তবে তার প্রমাণ দিতে হবে, অন্যথায় তা গ্রহণযোগ্য হবে না।",
    "যদি কোনো সদস্য সংগঠনের দলের জন্য অন্য সদস্যকে টাকা দেন তবে সেই ঝুঁকি টাকা সংগ্রহকারী সদস্যকে নিতে হবে।",
    "মনে রাখবেন, কখনো মিথ্যা বলবেন না, কারণ এই সংগঠনটি तभी বড় হবে যখন সব সদস্য বন্ধু হিসাবে থাকবে।",
    "প্রত্যেক সদস্যের তার ধারণা সম্পর্কে সংগঠন দলের সাথে কথা বলার সুযোগ থাকবে, যাতে আমরা উন্নতি করতে পারি।",
    "আমরা সবাই বন্ধু এবং আমরা সমাজ ও পরিবারের সদস্যদেরও সমর্থন করব।"
  ];
  
  const conditions = language === 'bn' ? conditions_bn : conditions_en;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'সদস্য নিবন্ধন' : 'Member Registration'}</DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'পিডিএফ ফর্ম ডাউনলোড করতে আপনার বিবরণ পূরণ করুন।' : 'Fill in your details to download the PDF form.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGeneratePdf)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'bn' ? 'ইമെ일' : 'Email'}</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
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
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{language === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{language === 'bn' ? 'একটি তারিখ বাছুন' : 'Pick a date'}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{language === 'bn' ? 'পিতার নাম' : "Father's Name"}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{language === 'bn' ? 'মাতার নাম' : "Mother's Name"}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <FormField
                control={form.control}
                name="nid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'bn' ? 'এনআইডি / জন্ম সনদ নম্বর' : 'NID / Birth Certificate No.'}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'bn' ? 'ঠিকানা (ঐচ্ছিক)' : 'Address (Optional)'}</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === 'bn' ? 'প্রসেসিং...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      {language === 'bn' ? 'নিবন্ধন ও ডাউনলোড' : 'Register & Download'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Hidden element for PDF generation */}
      {formData && (
         <div id="pdf-registration-content" style={{ position: 'absolute', left: '-9999px', width: '800px', padding: '40px', fontFamily: 'sans-serif', color: '#000', background: '#fff', border: '1px solid #eee' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #87CEEB', paddingBottom: '20px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976D2', margin: 0, marginBottom: '10px' }}>{language === 'bn' ? 'সেবা সংগঠন' : 'Seva Sangathan'}</h1>
                <p style={{ fontSize: '14px', color: '#555', marginTop: '15px' }}>{language === 'bn' ? 'শহীদ লিয়াকত স্মৃতি সংঘ-চান্দগাঁও-এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ' : 'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon'}</p>
            </div>
            <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '30px' }}>{language === 'bn' ? 'সদস্য নিবন্ধন ফর্ম' : 'Member Registration Form'}</h2>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '30px', justifyContent: 'space-between' }}>
                 <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#333' }}>{formData.name}</h3>
                 </div>
                 <div style={{ marginLeft: '30px' }}>
                    <div style={{ width: '150px', height: '180px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
                       <p style={{ color: '#aaa', fontSize: '12px', textAlign: 'center' }}>{language === 'bn' ? 'পাসপোর্ট সাইজের ছবি' : 'Passport Size Photo'}</p>
                    </div>
                 </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', marginBottom: '30px' }}>
                <tbody>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{format(formData.dob, 'PPP')}</td></tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'পিতার নাম' : "Father's Name"}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{formData.fatherName}</td></tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'মাতার নাম' : "Mother's Name"}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{formData.motherName}</td></tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'এনআইডি / জন্ম সনদ' : 'NID / Birth Cert.'}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{formData.nid}</td></tr>
                    <tr>
                        <td style={{ padding: '12px 0', fontWeight: 'bold', verticalAlign: 'top' }}>{language === 'bn' ? 'ঠিকানা' : 'Address'}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right' }}>
                            {formData.address ? <div style={{ minHeight: '64px', whiteSpace: 'pre-wrap' }}>{formData.address}</div> : (
                                <>
                                    <div style={{borderBottom: '1px solid #999', height: '24px', marginBottom: '16px'}}></div>
                                    <div style={{borderBottom: '1px solid #999', height: '24px'}}></div>
                                </>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div style={{marginTop: '20px'}}>
                <h3 style={{fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '15px'}}>{language === 'bn' ? 'শর্তাবলী' : 'Conditions'}</h3>
                <ul style={{ listStyleType: 'none', paddingLeft: '0px', fontSize: '12px', color: '#333' }}>
                    {conditions.map((condition, index) => (
                        <li key={index} style={{ marginBottom: '8px', fontWeight: 'bold', textIndent: '-1em', paddingLeft: '1em' }}>• {condition}</li>
                    ))}
                </ul>
            </div>

            <div style={{ marginTop: '80px', paddingTop: '20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '2px dotted #aaa', width: '200px', margin: '40px 0 5px 0' }}></div>
                    <p style={{ fontSize: '14px', color: '#333' }}>{language === 'bn' ? 'সদস্যের স্বাক্ষর' : 'Member Signature'}</p>
                </div>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '2px dotted #aaa', width: '200px', margin: '40px 0 5px 0' }}></div>
                    <p style={{ fontSize: '14px', color: '#333' }}>{language === 'bn' ? 'কর্তৃপক্ষের স্বাক্ষর' : 'Authority Signature'}</p>
                 </div>
            </div>
             <div style={{ marginTop: '30px', fontSize: '12px', color: '#555', textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <p style={{ fontWeight: 'bold' }}>© 2025 Seva Sangathan (community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.) All rights reserved.</p>
             </div>
         </div>
      )}
    </>
  );
}
