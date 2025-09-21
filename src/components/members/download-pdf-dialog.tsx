
'use client';

import { useState, useEffect } from 'react';
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
import { Download, Loader2 } from 'lucide-react';
import type { Member } from '@/lib/types';
import { PdfDocument } from '../ui/pdf-document';

type DownloadPdfDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DownloadPdfDialog({ open, onOpenChange }: DownloadPdfDialogProps) {
  const { members, language } = useAppContext();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfContent, setPdfContent] = useState<React.ReactNode | null>(null);

  const handleDownloadClick = async () => {
    if (!selectedMember) return;
    setIsGeneratingPdf(true);

    // Prepare the content first
    setPdfContent(<PdfDocument member={selectedMember} language={language} isRegistration={false} />);
  };
  
  useEffect(() => {
    if (pdfContent && isGeneratingPdf) {
      const generatePdf = async () => {
        // A small delay to ensure the DOM is fully updated with the new content
        await new Promise(resolve => setTimeout(resolve, 100));

        const pdfElement = document.getElementById('pdf-content-wrapper');
        if (!pdfElement) {
            console.error("PDF content element not found");
            setIsGeneratingPdf(false);
            setPdfContent(null);
            return;
        }

        try {
            const canvas = await html2canvas(pdfElement, { scale: 2, useCORS: true });
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
            
            let finalWidth = pdfWidth - 20;
            let finalHeight = finalWidth / ratio;

            if (finalHeight > pdfHeight - 20) {
                finalHeight = pdfHeight - 20;
                finalWidth = finalHeight * ratio;
            }

            const x = (pdfWidth - finalWidth) / 2;
            const y = 10;

            pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
            pdf.save(`${selectedMember!.name}-details.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGeneratingPdf(false);
            setPdfContent(null);
            onOpenChange(false);
        }
      };

      generatePdf();
    }
  }, [pdfContent, isGeneratingPdf, selectedMember, onOpenChange]);


  const handleMemberSelect = (memberId: string) => {
    const member = members.find(m => m.id === memberId) || null;
    setSelectedMember(member);
  }
  
  useEffect(() => {
    if (!open) {
      setSelectedMember(null);
      setIsGeneratingPdf(false);
      setPdfContent(null);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'সদস্যের তথ্য ডাউনলোড' : 'Download Member Info'}</DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'পিডিএফ হিসাবে ডাউনলোড করতে একজন সদস্য নির্বাচন করুন।' : 'Select a member to download their information as a PDF.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Select onValueChange={handleMemberSelect} value={selectedMember?.id || ''}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'bn' ? 'একজন সদস্য নির্বাচন করুন' : 'Select a member'} />
              </SelectTrigger>
              <SelectContent>
                {members.map(member => (
                  <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>
          <DialogFooter>
            <Button onClick={handleDownloadClick} disabled={!selectedMember || isGeneratingPdf}>
              {isGeneratingPdf ? (
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
      
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
        {isGeneratingPdf && (
            <div id="pdf-content-wrapper">
              {pdfContent}
            </div>
        )}
      </div>
    </>
  );
}
