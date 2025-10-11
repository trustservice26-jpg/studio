
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
import { SmartCard } from './smart-card';

type DownloadSmartCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setSelectedMember: (member: Member | null) => void;
};

export function DownloadSmartCardDialog({ open, onOpenChange, setSelectedMember: setPreviewMember }: DownloadSmartCardDialogProps) {
  const { members, language } = useAppContext();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfContent, setPdfContent] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    if (open && members.length > 0 && !selectedMember) {
        setSelectedMember(members[0]);
        setPreviewMember(members[0]);
    }
  }, [open, members, selectedMember, setPreviewMember]);

  const handleDownloadClick = async () => {
    if (!selectedMember) return;
    setIsGeneratingPdf(true);
    setPdfContent(<SmartCard member={selectedMember} isPdf={true} />);
  };

  useEffect(() => {
    if (pdfContent && isGeneratingPdf && selectedMember) {
      const generatePdf = async () => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Ensure DOM update

        const pdfElement = document.getElementById('pdf-smart-card-content');
        if (!pdfElement) {
          console.error("PDF content element not found");
          setIsGeneratingPdf(false);
          setPdfContent(null);
          return;
        }

        try {
          const canvas = await html2canvas(pdfElement, { scale: 3, useCORS: true, backgroundColor: null });
          const imgData = canvas.toDataURL('image/png');

          const cardWidth = 85.6; // mm (CR80 standard)
          const cardHeight = 54.0; // mm (CR80 standard)

          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [cardWidth, cardHeight],
          });

          pdf.addImage(imgData, 'PNG', 0, 0, cardWidth, cardHeight);
          pdf.save(`${selectedMember.name}-Smart-Card.pdf`);
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
    setPreviewMember(member);
  };

  useEffect(() => {
    if (!open) {
      // Don't clear selection on close, so preview remains
      setIsGeneratingPdf(false);
      setPdfContent(null);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'স্মার্ট কার্ড ডাউনলোড' : 'Download Smart Card'}</DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'পিডিএফ হিসাবে ডাউনলোড করতে একজন সদস্য নির্বাচন করুন।' : 'Select a member to download their smart card as a PDF.'}
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
      
      {/* Hidden element for PDF generation */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
        {isGeneratingPdf && <div id="pdf-smart-card-content">{pdfContent}</div>}
      </div>
    </>
  );
}
