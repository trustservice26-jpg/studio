
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
import { useAppContext } from '@/context/app-context';
import { Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

type DownloadStatementDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DownloadStatementDialog({ open, onOpenChange }: DownloadStatementDialogProps) {
  const { transactions, language, totalDonations, totalWithdrawals, currentFunds } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  const formatDate = (date: string) => {
      return format(new Date(date), 'PP', { locale: language === 'bn' ? bn : undefined });
  }

  const handleDownload = async () => {
    setIsLoading(true);

    const pdfElement = document.getElementById('pdf-statement-content');
    if (!pdfElement) {
        setIsLoading(false);
        return;
    }

    const canvas = await html2canvas(pdfElement, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    
    let finalWidth = pageWidth;
    let finalHeight = finalWidth / ratio;

    if (finalHeight > pageHeight) {
        finalHeight = pageHeight;
        finalWidth = finalHeight * ratio;
    }
    
    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
    pdf.save(`Seva-Sangathan-Statement-${new Date().toISOString().split('T')[0]}.pdf`);

    setIsLoading(false);
    onOpenChange(false);
  };

  const donations = transactions.filter(t => t.type === 'donation');
  const withdrawals = transactions.filter(t => t.type === 'withdrawal');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{language === 'bn' ? 'অ্যাকাউন্ট স্টেটমেন্ট ডাউনলোড' : 'Download Account Statement'}</DialogTitle>
          <DialogDescription>
            {language === 'bn' ? 'সংগঠনের সম্পূর্ণ আর্থিক বিবরণের একটি পিডিএফ ডাউনলোড করুন।' : 'Download a PDF of the organization\'s complete financial statement.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center py-4">
            <p className="text-muted-foreground">{language === 'bn' ? 'পিডিএফ প্রস্তুত। ডাউনলোড করতে ক্লিক করুন।' : 'The PDF is ready. Click to download.'}</p>
        </div>

        {/* Hidden element for PDF generation */}
        <div id="pdf-statement-content" style={{ position: 'absolute', left: '-9999px', width: '800px', padding: '40px 20px', fontFamily: 'sans-serif', color: '#000', background: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #87CEEB', paddingBottom: '20px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976D2', margin: 0, marginBottom: '10px' }}>{language === 'bn' ? 'সেবা সংগঠন' : 'Seva Sangathan'}</h1>
                <p style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>{language === 'bn' ? 'শহীদ লিয়াকত স্মৃতি সংঘ-চান্দগাঁও-এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ' : 'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon'}</p>
                 <p style={{ fontSize: '14px', color: '#555', marginTop: '10px' }}>
                    {language === 'bn' ? 'স্টেটমেন্ট তৈরির তারিখ:' : 'Statement Date:'} {new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}
                </p>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>{language === 'bn' ? 'আর্থিক সারাংশ' : 'Financial Summary'}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', marginBottom: '30px' }}>
                <tbody>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'মোট অনুদান' : 'Total Donations'}</td><td style={{ padding: '8px 0', textAlign: 'right' }}>{formatCurrency(totalDonations)}</td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'মোট উত্তোলন' : 'Total Withdrawals'}</td><td style={{ padding: '8px 0', textAlign: 'right' }}>{formatCurrency(totalWithdrawals)}</td></tr>
                    <tr style={{ borderTop: '2px solid #000' }}><td style={{ padding: '8px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'বর্তমান তহবিল' : 'Current Funds'}</td><td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(currentFunds)}</td></tr>
                </tbody>
            </table>

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>{language === 'bn' ? 'অনুদান' : 'Donations'}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead><tr style={{background: '#f2f2f2'}}><th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'তারিখ' : 'Date'}</th><th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'বিবরণ' : 'Description'}</th><th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'দাতা' : 'By'}</th><th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'পরিমাণ' : 'Amount'}</th></tr></thead>
                <tbody>
                    {donations.map(tx => (<tr key={tx.id}><td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{formatDate(tx.date)}</td><td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{tx.description}</td><td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{tx.memberName || (language === 'bn' ? 'অজানা' : 'Anonymous')}</td><td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatCurrency(tx.amount)}</td></tr>))}
                </tbody>
            </table>

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>{language === 'bn' ? 'উত্তোলন' : 'Withdrawals'}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead><tr style={{background: '#f2f2f2'}}><th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'তারিখ' : 'Date'}</th><th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'বিবরণ' : 'Description'}</th><th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'পরিমাণ' : 'Amount'}</th></tr></thead>
                <tbody>
                    {withdrawals.map(tx => (<tr key={tx.id}><td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{formatDate(tx.date)}</td><td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{tx.description}</td><td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatCurrency(tx.amount)}</td></tr>))}
                </tbody>
            </table>
            
            <p style={{ marginTop: '40px', fontSize: '12px', fontStyle: 'italic', color: '#555', textAlign: 'center' }}>{language === 'bn' ? 'এটি একটি কম্পিউটার-জেনারেটেড স্টেটমেন্ট।' : 'This is a computer-generated statement.'}</p>
        </div>

        <DialogFooter>
          <Button onClick={handleDownload} disabled={isLoading}>
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
