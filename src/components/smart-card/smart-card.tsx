
'use client';

import type { Member } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { BarcodeDisplay } from './barcode-display';
import { Quote, HeartHandshake } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { useIsClient } from '@/hooks/use-is-client';
import { cn } from '@/lib/utils';

type SmartCardProps = {
  member: Partial<Member> | null;
  side: 'front' | 'back';
  isPdf?: boolean;
  language?: 'en' | 'bn';
};

export function SmartCard({ member, side, isPdf = false, language: propLanguage }: SmartCardProps) {
  const appContext = useAppContext();
  const language = propLanguage || appContext.language;
  const [frontQrCodeUrl, setFrontQrCodeUrl] = useState('');
  const isClient = useIsClient();

  const memberName = member?.name || (language === 'bn' ? 'মোহাম্মদ রহিম' : 'Sample Member');

  useEffect(() => {
    if (!isClient || side === 'back') return;
    
    const generateFrontQrCode = async () => {
        const details = [
          `Phone: ${member?.phone || 'N/A'}`,
          `Date of Birth: ${member?.dob || 'N/A'}`,
          `Father's Name: ${member?.fatherName || 'N/A'}`,
          `NID/Birth Certificate No.: ${member?.nid || 'N/A'}`,
          `Address: ${member?.address || 'N/A'}`,
        ].join('\n\n');

        try {
          const url = await QRCode.toDataURL(details, {
            errorCorrectionLevel: 'H', // Use high error correction
            type: 'image/png',
            margin: 1,
            scale: isPdf ? 6 : 4, // Higher scale for PDF
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setFrontQrCodeUrl(url);
        } catch (err) {
          console.error('Failed to generate QR code', err);
        }
      };
      generateFrontQrCode();

  }, [member, isPdf, side, isClient]);

  const cardBaseClasses = "aspect-[85.6/53.98] w-full flex flex-col overflow-hidden relative text-gray-800 font-body";
  const cardAppearanceClasses = isPdf ? "rounded-[3mm]" : "shadow-lg rounded-xl";

  const frontClasses = "bg-gradient-to-br from-white to-green-50/50 border border-gray-200";
  const backClasses = "bg-white border border-gray-200";


  if (side === 'front') {
    return (
      <div className={cn(cardBaseClasses, cardAppearanceClasses, frontClasses)}>
        {/* Header */}
        <div className="p-[8px_16px] border-b border-gray-200 flex items-center gap-3">
          <HeartHandshake className="text-green-800 h-7 w-7 shrink-0" />
          <div className="flex flex-col justify-center">
              <h1 className="font-card_headline text-[0.95rem] font-bold m-0 leading-tight whitespace-nowrap">
                <span className="text-green-800">HADIYA</span>{' - '}<span className="text-yellow-600">{` মানবতার উপহার`}</span>
              </h1>
              <p className="font-subheadline text-[0.4rem] text-gray-600 m-0 font-normal whitespace-nowrap pt-1">
                {language === 'bn' ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ' : 'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}
              </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-[8px_16px] flex-grow flex flex-col justify-center">
             <p className="text-[0.6rem] m-0 mb-1 text-gray-600 font-bold text-center">
              MEMBERSHIP IDENTIFICATION CARD
            </p>
            <div className="flex items-center">
                <div className={cn("flex items-center justify-center shrink-0 mr-[12px] p-1 bg-white border", isPdf ? "w-[70px] h-[70px]" : "w-[70px] h-[70px]")}>
                  {frontQrCodeUrl && <img src={frontQrCodeUrl} alt="QR Code" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }} />}
                </div>
                <div className="flex-grow">
                    <h2 className="font-body text-[0.9rem] font-bold m-0 text-black">{memberName}</h2>
                    <p className="text-[0.55rem] m-[3px_0] font-mono text-black">
                      <span className="font-bold">ID:</span> {member?.memberId || 'H-0000'}
                    </p>
                    <p className="text-[0.55rem] m-[3px_0] text-gray-600 whitespace-nowrap">
                      <span className="font-bold">{language === 'bn' ? 'পদবি:' : 'Designation:'}</span> Volunteer / Donor / Executive Member
                    </p>
                    <p className="text-[0.55rem] m-[3px_0] text-gray-600">
                      <span className="font-bold">{language === 'bn' ? 'যোগদানের তারিখ:' : 'Join Date:'}</span> {member?.joinDate ? new Date(member.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US') : 'dd/mm/yyyy'}
                    </p>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-[6px_16px] bg-green-900/5 border-t border-gray-200 text-center flex items-center justify-center gap-[8px]">
            <Quote className="w-[10px] h-[10px] text-yellow-600" />
            <p className="italic text-[0.5rem] text-black m-0 font-bold whitespace-nowrap">
             {language === 'bn' ? 'দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়। — শেখ সাদী' : 'Do not be ashamed of giving a little, for refusing is a greater shame. - Sheikh Saadi'}
            </p>
        </div>
      </div>
    );
  }

  // BACK SIDE
  const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  );
  const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="00 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  );
  const MapPinIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  );

  return (
    <div className={cn(cardBaseClasses, cardAppearanceClasses, backClasses)}>
      <div className="h-[20px] bg-gray-800 shrink-0 mt-3 w-full"></div>
      <div className="p-4 flex-grow">
        <div className="mb-3">
          <h3 className="font-bold text-[0.65rem] tracking-wide border-b border-gray-300 text-gray-800 pb-1 mb-1.5">{language === 'bn' ? 'শর্তাবলী এবং নোট' : 'TERMS & NOTES'}</h3>
          <ul className="m-0 pl-[12px] text-[0.5rem] text-gray-600 list-disc space-y-px text-left">
            <li>This card is non-transferable.</li>
            <li>Please return if found.</li>
            <li>Property of HADIYA - মানবতার উপহার.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[0.65rem] tracking-wide border-b border-gray-300 text-gray-800 pb-1 mb-1.5">{language === 'bn' ? 'যোগাযোগ' : 'CONTACT INFO'}</h3>
          <div className="flex items-center text-[0.45rem] text-gray-700 leading-tight">
            <GlobeIcon />
            <span className="ml-1">https://hadiya24.vercel.app</span>
          </div>
          <div className="flex items-center text-[0.45rem] text-gray-700 leading-tight mt-0.5">
            <MailIcon />
            <span className="ml-1">infohadiyateam@gmail.com</span>
          </div>
           <div className="flex items-center text-[0.45rem] text-gray-700 leading-tight mt-0.5">
            <MapPinIcon />
            <span className="ml-1">Chandgaon, Chattogram, Bangladesh.</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-2 pt-1 text-center">
        <BarcodeDisplay memberId={member?.memberId || 'H-0000'} isPdf={isPdf} />
      </div>
    </div>
  );
}
