
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
import Image from "next/image"

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

    const canvas = await html2canvas(pdfElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
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
             <div id={`pdf-content-${selectedMember.id}`} style={{ position: 'absolute', left: '-9999px', width: '595px', padding: '40px', fontFamily: 'sans-serif', color: '#000', background: '#fff' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{language === 'bn' ? 'সেবা সংগঠন' : 'Seva Sangathan'}</h1>
                    <p style={{ fontSize: '18px' }}>{language === 'bn' ? 'সদস্যের বিবরণ' : 'Member Details'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                     <img src={selectedMember.avatar} alt={selectedMember.name} style={{ borderRadius: '50%', width: '100px', height: '100px', marginRight: '20px' }} crossOrigin="anonymous"/>
                     <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{selectedMember.name}</h2>
                        <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>{selectedMember.email}</p>
                     </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'ফোন' : 'Phone'}</td><td style={{ padding: '10px 0' }}>{selectedMember.phone}</td></tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'অবস্থা' : 'Status'}</td><td style={{ padding: '10px 0' }}>{selectedMember.status === 'active' ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}</td></tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'যোগদানের তারিখ' : 'Join Date'}</td><td style={{ padding: '10px 0' }}>{new Date(selectedMember.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}</td></tr>
                    </tbody>
                </table>
                <div style={{ marginTop: '30px' }}>
                     <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{language === 'bn' ? 'অবদানসমূহ' : 'Contributions'}</h3>
                     <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{selectedMember.contributions || (language === 'bn' ? 'কোনো অবদান রেকর্ড করা হয়নি।' : 'No contributions recorded.')}</p>
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
