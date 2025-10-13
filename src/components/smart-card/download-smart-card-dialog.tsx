
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
import { useAppContext } from '@/context/app-context';
import { Download, Loader2 } from 'lucide-react';
import type { Member } from '@/lib/types';
import { SmartCard } from './smart-card';

type DownloadSmartCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
};

export function DownloadSmartCardDialog({ open, onOpenChange, member }: DownloadSmartCardDialogProps) {
  const { language } = useAppContext();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfContent, setPdfContent] = useState<React.ReactNode | null>(null);

  const handleDownloadClick = async () => {
    if (!member) return;
    setIsGeneratingPdf(true);
    // Set content for PDF generation with both front and back
    setPdfContent(
        <div style={{ display: 'flex', gap: '20px', padding: '20px', background: 'white' }}>
            <div style={{width: '400px'}}>
                <SmartCard member={member} side="front" isPdf={true} language={language} />
            </div>
            <div style={{width: '400px'}}>
                 <SmartCard member={member} side="back" isPdf={true} language={language} />
            </div>
        </div>
    );
  };
  
  useEffect(() => {
    if (pdfContent && isGeneratingPdf) {
      const generatePdf = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));

        const pdfElement = document.getElementById('pdf-smart-card-wrapper');
        
        if (!pdfElement) {
            console.error("PDF content elements not found");
            setIsGeneratingPdf(false);
            setPdfContent(null);
            return;
        }

        try {
            const canvas = await html2canvas(pdfElement, { scale: 3, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [148, 105] // A6 size landscape
            });
            
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            const ratio = canvasWidth / canvasHeight;
            
            let finalWidth = pageWidth - 10;
            let finalHeight = finalWidth / ratio;
            
            if (finalHeight > pageHeight - 10) {
              finalHeight = pageHeight - 10;
              finalWidth = finalHeight * ratio;
            }

            const x = (pageWidth - finalWidth) / 2;
            const y = (pageHeight - finalHeight) / 2;
            
            pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
            
            pdf.save(`${member!.name}-SmartCard.pdf`);

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
  }, [pdfContent, isGeneratingPdf, member, onOpenChange]);
  
  useEffect(() => {
    if (!open) {
      setIsGeneratingPdf(false);
      setPdfContent(null);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'স্মার্ট কার্ড ডাউনলোড' : 'Download Smart Card'}</DialogTitle>
            <DialogDescription>
              {language === 'bn' ? `আপনি কি নিশ্চিত যে আপনি ${member?.name} এর জন্য স্মার্ট কার্ড ডাউনলোড করতে চান?` : `Are you sure you want to download the smart card for ${member?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>{language === 'bn' ? 'বাতিল' : 'Cancel'}</Button>
            <Button onClick={handleDownloadClick} disabled={!member || isGeneratingPdf}>
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Downloading...'}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  {language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
        {isGeneratingPdf && <div id="pdf-smart-card-wrapper">{pdfContent}</div>}
      </div>
    </>
  );
}
