
'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { format, getYear, getMonth, startOfMonth, endOfMonth } from 'date-fns';
import { bn } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type DownloadStatementDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DownloadStatementDialog({ open, onOpenChange }: DownloadStatementDialogProps) {
  const { transactions, language } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>();

  const availableYears = useMemo(() => {
    if (transactions.length === 0) return [getYear(new Date())];
    const years = new Set(transactions.map(tx => getYear(new Date(tx.date))));
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  const availableMonths = [
    { value: 0, name: 'January', bn_name: 'জানুয়ারি' },
    { value: 1, name: 'February', bn_name: 'ফেব্রুয়ারি' },
    { value: 2, name: 'March', bn_name: 'মার্চ' },
    { value: 3, name: 'April', bn_name: 'এপ্রিল' },
    { value: 4, name: 'May', bn_name: 'মে' },
    { value: 5, name: 'June', bn_name: 'জুন' },
    { value: 6, name: 'July', bn_name: 'জুলাই' },
    { value: 7, name: 'August', bn_name: 'আগস্ট' },
    { value: 8, name: 'September', bn_name: 'সেপ্টেম্বর' },
    { value: 9, name: 'October', bn_name: 'অক্টোবর' },
    { value: 10, name: 'November', bn_name: 'নভেম্বর' },
    { value: 11, name: 'December', bn_name: 'ডিসেম্বর' },
  ];
  
  useEffect(() => {
    if (open) {
      const currentYear = getYear(new Date());
      if (availableYears.includes(currentYear)) {
          setSelectedYear(currentYear);
      } else if (availableYears.length > 0) {
          setSelectedYear(availableYears[0]);
      }
      setSelectedMonth(getMonth(new Date()));
    } else {
      setSelectedYear(undefined);
      setSelectedMonth(undefined);
    }
  }, [open, availableYears]);


  const filteredTransactions = useMemo(() => {
    if (selectedYear === undefined || selectedMonth === undefined) {
      return [];
    }
    const from = startOfMonth(new Date(selectedYear, selectedMonth));
    const to = endOfMonth(new Date(selectedYear, selectedMonth));
    
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= from && txDate <= to;
    });
  }, [transactions, selectedYear, selectedMonth]);

  const { totalDonations, totalWithdrawals, currentFunds } = useMemo(() => {
    const donations = filteredTransactions.filter(t => t.type === 'donation').reduce((sum, d) => sum + d.amount, 0);
    const withdrawals = filteredTransactions.filter(t => t.type === 'withdrawal').reduce((sum, w) => sum + w.amount, 0);
    return {
      totalDonations: donations,
      totalWithdrawals: withdrawals,
      currentFunds: donations - withdrawals
    };
  }, [filteredTransactions]);
  

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
      return format(new Date(dateString), 'PP', { locale: language === 'bn' ? bn : undefined });
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

    let finalWidth = pageWidth - 20;
    let finalHeight = finalWidth / ratio;
    
    let y = 10;
    if (finalHeight > pageHeight - 20) { // Add margin
      finalHeight = pageHeight - 20;
      finalWidth = finalHeight * ratio;
      y = 10;
    } else {
      y = (pageHeight - finalHeight) / 2;
    }
    
    pdf.addImage(imgData, 'PNG', 10, y, finalWidth, finalHeight);
    pdf.save(`HADIYA-Statement-${selectedYear}-${(selectedMonth ?? 0) + 1}.pdf`);

    setIsLoading(false);
    onOpenChange(false);
  };

  const donations = filteredTransactions.filter(t => t.type === 'donation');
  const withdrawals = filteredTransactions.filter(t => t.type === 'withdrawal');
  
  const dateRangeString = useMemo(() => {
    if (selectedYear !== undefined && selectedMonth !== undefined) {
      const monthName = availableMonths.find(m => m.value === selectedMonth)?.[language === 'bn' ? 'bn_name' : 'name'];
      return `${monthName}, ${selectedYear}`;
    }
    return language === 'bn' ? 'সম্পূর্ণ ইতিহাস' : 'Full History';
  }, [selectedYear, selectedMonth, language, availableMonths]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{language === 'bn' ? 'অ্যাকাউন্ট স্টেটমেন্ট ডাউনলোড' : 'Download Account Statement'}</DialogTitle>
          <DialogDescription>
            {language === 'bn' ? 'একটি মাস এবং বছর নির্বাচন করে একটি পিডিএফ ডাউনলোড করুন।' : 'Download a PDF by selecting a month and year.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
            <Select onValueChange={(v) => setSelectedYear(Number(v))} value={selectedYear?.toString()}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'bn' ? 'বছর নির্বাচন করুন' : 'Select Year'} />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(v) => setSelectedMonth(Number(v))} value={selectedMonth?.toString()}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'bn' ? 'মাস নির্বাচন করুন' : 'Select Month'} />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map(month => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {language === 'bn' ? month.bn_name : month.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        {/* Hidden element for PDF generation */}
        <div id="pdf-statement-content" style={{ position: 'absolute', left: '-9999px', width: '800px', padding: '20px', color: '#000', background: '#fff', fontFamily: '"PT Sans", sans-serif' }}>
            <div style={{ textAlign: 'center', marginBottom: '15px', borderBottom: '2px solid hsl(var(--brand-gold))', paddingBottom: '8px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px 0', fontFamily: '"Cinzel Decorative", serif' }}>
                  <span style={{color: 'hsl(var(--brand-green))'}}>HADIYA</span>
                  <span style={{color: 'hsl(var(--brand-gold))'}}> –মানবতার উপহার</span>
                </h1>
                <p style={{ fontSize: '13px', color: '#555', margin: 0, fontWeight: 'bold' }}>{language === 'bn' ? 'শহীদ লিয়াকত স্মৃতি সংঘ-চান্দগাঁও-এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ' : 'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon'}</p>
                 <p style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>
                    {language === 'bn' ? 'স্টেটমেন্টের সময়কাল:' : 'Statement for:'} {dateRangeString}
                </p>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>{language === 'bn' ? 'আর্থিক সারাংশ' : 'Financial Summary'}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginBottom: '15px' }}>
                <tbody>
                    <tr><td style={{ padding: '4px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'এই মাসের মোট অনুদান' : 'Total Donations for Month'}</td><td style={{ padding: '4px 0', textAlign: 'right' }}>{formatCurrency(totalDonations)}</td></tr>
                    <tr><td style={{ padding: '4px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'এই মাসের মোট উত্তোলন' : 'Total Withdrawals for Month'}</td><td style={{ padding: '4px 0', textAlign: 'right' }}>{formatCurrency(totalWithdrawals)}</td></tr>
                    <tr style={{ borderTop: '2px solid #000' }}><td style={{ padding: '4px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'এই মাসের নেট তহবিল' : 'Net Funds for Month'}</td><td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(currentFunds)}</td></tr>
                </tbody>
            </table>

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '15px 0 10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>{language === 'bn' ? 'অনুদান' : 'Donations'}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead><tr style={{background: '#f2f2f2'}}><th style={{ padding: '5px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'তারিখ' : 'Date'}</th><th style={{ padding: '5px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'বিবরণ' : 'Description'}</th><th style={{ padding: '5px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'দাতা' : 'By'}</th><th style={{ padding: '5px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'পরিমাণ' : 'Amount'}</th></tr></thead>
                <tbody>
                    {donations.length > 0 ? donations.map(tx => (<tr key={tx.id}><td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{formatDate(tx.date)}</td><td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{tx.description}</td><td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{tx.memberName || (language === 'bn' ? 'অজানা' : 'Anonymous')}</td><td style={{ padding: '4px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatCurrency(tx.amount)}</td></tr>)) : <tr><td colSpan={4} style={{ padding: '10px', textAlign: 'center' }}>No donations in this period.</td></tr>}
                </tbody>
            </table>

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '15px 0 10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>{language === 'bn' ? 'উত্তোলন' : 'Withdrawals'}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead><tr style={{background: '#f2f2f2'}}><th style={{ padding: '5px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'তারিখ' : 'Date'}</th><th style={{ padding: '5px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'বিবরণ' : 'Description'}</th><th style={{ padding: '5px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>{language === 'bn' ? 'পরিমাণ' : 'Amount'}</th></tr></thead>
                <tbody>
                    {withdrawals.length > 0 ? withdrawals.map(tx => (<tr key={tx.id}><td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{formatDate(tx.date)}</td><td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{tx.description}</td><td style={{ padding: '4px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatCurrency(tx.amount)}</td></tr>)) : <tr><td colSpan={3} style={{ padding: '10px', textAlign: 'center' }}>No withdrawals in this period.</td></tr>}
                </tbody>
            </table>
            
            <p style={{ marginTop: '20px', fontSize: '10px', fontStyle: 'italic', color: '#555', textAlign: 'center' }}>{language === 'bn' ? `এই স্টেটমেন্টটি ${new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}-এ তৈরি করা হয়েছে।` : `This statement was generated on ${new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}.`}</p>
        </div>

        <DialogFooter>
          <Button onClick={handleDownload} disabled={isLoading || selectedYear === undefined || selectedMonth === undefined}>
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

    