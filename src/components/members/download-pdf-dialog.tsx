
'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppContext } from '@/context/app-context';
import type { Member } from '@/lib/types';
import { Download, Loader2 } from 'lucide-react';

type DownloadPdfDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DownloadPdfDialog({ open, onOpenChange }: DownloadPdfDialogProps) {
  const { members, language } = useAppContext();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!selectedMemberId) return;
    
    const member = members.find(m => m.id === selectedMemberId);
    if (!member) return;

    setIsLoading(true);

    const pdfElement = document.getElementById(`pdf-content-${member.id}`);
    if (!pdfElement) {
        setIsLoading(false);
        return;
    }

    const canvas = await html2canvas(pdfElement, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    const canvasPdfWidth = pdfWidth - 20; // 10mm margin on each side
    const canvasPdfHeight = canvasPdfWidth / ratio;

    // Center the image
    const x = (pdfWidth - canvasPdfWidth) / 2;
    const y = (pdfHeight - canvasPdfHeight) / 2 > 10 ? (pdfHeight - canvasPdfHeight) / 2 : 10;


    pdf.addImage(imgData, 'PNG', x, y, canvasPdfWidth, canvasPdfHeight);
    pdf.save(`${member.name}-details.pdf`);

    setIsLoading(false);
    onOpenChange(false);
    setSelectedMemberId(null);
  };
  
  const selectedMember = members.find(m => m.id === selectedMemberId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{language === 'bn' ? 'সদস্যের তথ্য ডাউনলোড' : 'Download Member Info'}</DialogTitle>
          <DialogDescription>
            {language === 'bn' ? 'পিডিএফ হিসাবে ডাউনলোড করতে একজন সদস্য নির্বাচন করুন।' : 'Select a member to download their information as a PDF.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Select onValueChange={setSelectedMemberId} value={selectedMemberId || ''}>
            <SelectTrigger>
              <SelectValue placeholder={language === 'bn' ? 'একজন সদস্য নির্বাচন করুন' : 'Select a member'} />
            </SelectTrigger>
            <SelectContent>
              {members.map(member => (
                <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Hidden element for PDF generation */}
          {selectedMember && (
             <div id={`pdf-content-${selectedMember.id}`} style={{ position: 'absolute', left: '-9999px', width: '800px', padding: '40px', fontFamily: 'sans-serif', color: '#000', background: '#fff', border: '1px solid #eee' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #87CEEB', paddingBottom: '20px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976D2', margin: 0 }}>{language === 'bn' ? 'সেবা সংগঠন' : 'Seva Sangathan'}</h1>
                    <p style={{ fontSize: '14px', color: '#555' }}>{language === 'bn' ? 'শহীদ লিয়াকত স্মৃতি সংঘ-চান্দগাঁও-এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ' : 'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon'}</p>
                </div>
                <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '30px' }}>{language === 'bn' ? 'সদস্যের বিবরণ' : 'Member Details'}</h2>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '30px', justifyContent: 'space-between' }}>
                     <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#333' }}>{selectedMember.name}</h3>
                        <p style={{ fontSize: '16px', color: '#555', margin: '5px 0 0 0' }}>{selectedMember.email}</p>
                     </div>
                     <div style={{ marginLeft: '30px' }}>
                        <div style={{ width: '150px', height: '180px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
                           <p style={{ color: '#aaa', fontSize: '12px', textAlign: 'center' }}>{language === 'bn' ? 'পাসপোর্ট সাইজের ছবি' : 'Passport Size Photo'}</p>
                        </div>
                     </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'ফোন' : 'Phone'}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{selectedMember.phone}</td></tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'অবস্থা' : 'Status'}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{selectedMember.status === 'active' ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}</td></tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'যোগদানের তারিখ' : 'Join Date'}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{new Date(selectedMember.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}</td></tr>
                    </tbody>
                </table>
                
                <div style={{ marginTop: '40px' }}>
                     <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>{language === 'bn' ? 'অবদানসমূহ' : 'Contributions'}</h3>
                     <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#333' }}>{selectedMember.contributions || (language === 'bn' ? 'কোনো অবদান রেকর্ড করা হয়নি।' : 'No contributions recorded.')}</p>
                </div>

                <div style={{ marginTop: '80px', paddingTop: '20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#555' }}>{language === 'bn' ? 'ধন্যবাদ!' : 'Thank you!'}</p>
                     <div style={{ textAlign: 'center' }}>
                        <div style={{ borderTop: '2px dotted #aaa', width: '200px', margin: '40px 0 5px 0' }}></div>
                        <p style={{ fontSize: '14px', color: '#333' }}>{language === 'bn' ? 'কর্তৃপক্ষের স্বাক্ষর' : 'Authority Signature'}</p>
                     </div>
                </div>
             </div>
          )}

        </div>
        <DialogFooter>
          <Button onClick={handleDownload} disabled={!selectedMemberId || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Downloading...'}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {language === 'bn' ? 'ডাউনলোড' : 'Download'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
