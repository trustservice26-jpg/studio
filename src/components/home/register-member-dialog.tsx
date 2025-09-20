
'use client';

import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
import { Download, Loader2 } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { PdfDocument } from '../ui/pdf-document';

const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number is too short.' }),
  dob: z.string().min(1, { message: 'Date of birth is required.' }),
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
  const [formData, setFormData] = useState<RegistrationFormValues & { joinDate: string } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dob: '',
      fatherName: '',
      motherName: '',
      nid: '',
      address: '',
    },
  });

  const { isSubmitting } = form.formState;

  const handleRegistration = async (values: RegistrationFormValues) => {
    const joinDate = new Date().toISOString();
    const fullData = { ...values, joinDate };
    
    await addMember(
      {
        ...values,
        joinDate: joinDate,
        status: 'inactive'
      },
      true
    );

    setFormData(fullData);
    setIsGeneratingPdf(true); // Trigger PDF generation via useEffect
  };
  
  useEffect(() => {
    if (isGeneratingPdf && formData) {
      const generatePdf = async () => {
        const pdfElement = document.getElementById('pdf-registration-content');
        if (!pdfElement) {
          console.error("PDF content element not found");
          setIsGeneratingPdf(false);
          return;
        }

        try {
          const canvas = await html2canvas(pdfElement, { scale: 2, useCORS: true });
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
          
          let finalWidth = pdfWidth - 20; // 10mm margin on each side
          let finalHeight = finalWidth / ratio;

          if (finalHeight > pdfHeight - 20) {
              finalHeight = pdfHeight - 20;
              finalWidth = finalHeight * ratio;
          }

          const x = (pdfWidth - finalWidth) / 2;
          const y = 10;

          pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
          pdf.save(`${formData.name}-registration-form.pdf`);

        } catch (error) {
          console.error("Error generating PDF:", error);
        } finally {
          setIsGeneratingPdf(false);
          onOpenChange(false);
        }
      };

      // Delay to ensure the DOM is fully updated
      const timer = setTimeout(generatePdf, 100);
      return () => clearTimeout(timer);
    }
  }, [isGeneratingPdf, formData, onOpenChange]);
  
  useEffect(() => {
    if (!open) {
      form.reset();
      setFormData(null);
      setIsGeneratingPdf(false);
    }
  }, [open, form]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'সদস্য নিবন্ধন' : 'Member Registration'}</DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'পিডিএফ ফর্ম ডাউনলোড করতে আপনার বিবরণ পূরণ করুন।' : 'Fill in your details to download the PDF form.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-4">
              <ScrollArea className="h-[60vh] pr-6">
                <div className="space-y-4">
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
                      <FormItem>
                        <FormLabel>{language === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'}</FormLabel>
                        <FormControl>
                          <Input placeholder={language === 'bn' ? 'দিন-মাস-বছর' : 'DD-MM-YYYY'} {...field} />
                        </FormControl>
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
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting || isGeneratingPdf}>
                  {isSubmitting || isGeneratingPdf ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === 'bn' ? 'প্রসেসিং...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      {language === 'bn' ? 'এখন নিবন্ধন করুন' : 'Register Now'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
        {formData && isGeneratingPdf && <div id="pdf-registration-content"><PdfDocument member={formData} language={language} isRegistration={true} /></div>}
      </div>
    </>
  );
}
