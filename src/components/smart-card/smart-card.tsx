
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
  const [backQrCodeUrl, setBackQrCodeUrl] = useState('');
  const isClient = useIsClient();

  const memberName = member?.name || (language === 'bn' ? 'মোহাম্মদ রহিম' : 'Mohammad Rahim');

  useEffect(() => {
    if (!isClient) return;
    
    const generateFrontQrCode = async () => {
        const memberId = member?.memberId || 'N/A';
        const memberName = member?.name || 'N/A';
        const joinDate = member?.joinDate ? new Date(member.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US') : 'N/A';
        const status = member?.status || 'N/A';

        const qrData = `Member ID: ${memberId}\nName: ${memberName}\nJoin Date: ${joinDate}\nStatus: ${status}`;

        try {
          const url = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.9,
            margin: 1,
            width: isPdf ? 60 : 70,
            color: {
              dark: '#2d3748',
              light: '#FFFFFF00' // Transparent background
            }
          });
          setFrontQrCodeUrl(url);
        } catch (err) {
          console.error('Failed to generate QR code', err);
        }
      };
      generateFrontQrCode();

    const generateBackQrCode = async () => {
       try {
        const url = await QRCode.toDataURL('hadiya24.vercel.app', {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          quality: 0.9,
          margin: 1,
          width: 45,
          version: 1,
          color: {
            dark: '#2d3748',
            light: '#FFFFFF00' // Transparent background
          }
        });
        setBackQrCodeUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      }
    };

    generateBackQrCode();
  }, [member, isPdf, side, language, isClient]);

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
                <span className="text-green-800">HADIYA</span>{' – '}<span className="text-yellow-600">{` মানবতার উপহার`}</span>
              </h1>
              <p className="font-subheadline text-[0.4rem] text-gray-600 m-0 font-normal whitespace-nowrap pt-1">
                {'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ'}
              </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-[8px_16px] flex-grow flex flex-col justify-center">
             <p className="text-[0.6rem] m-0 mb-1 text-gray-600 font-bold text-center">
              MEMBERSHIP IDENTIFICATION CARD
            </p>
            <div className="flex items-center">
                <div className={cn("flex items-center justify-center shrink-0 mr-[12px]", isPdf ? "w-[60px] h-[60px]" : "w-[70px] h-[70px]")}>
                  {frontQrCodeUrl && <img src={frontQrCodeUrl} alt="QR Code" className="w-full h-full" />}
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
            <p className="italic text-[0.5rem] text-black m-0 font-bold">
              দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়। — শেখ সাদী
            </p>
        </div>
      </div>
    );
  }

  // BACK SIDE
  return (
      <div className={cn(cardBaseClasses, cardAppearanceClasses, backClasses)}>
          <div className="h-[25px] bg-gray-800 mt-[15px]"></div>
          
          <div className="p-[10px_16px] flex-grow flex items-center">
            <div className="flex-1">
                <h3 className="font-bold text-[0.6rem] border-b border-gray-300 text-gray-800 pb-[2px] mb-1">{language === 'bn' ? 'শর্তাবলী এবং নোট' : 'Terms & Notes'}</h3>
                <ul className="m-0 pl-[14px] text-[0.5rem] text-gray-600 list-disc space-y-px">
                    <li>This card is non-transferable.</li>
                    <li>Please return if found.</li>
                    <li>Property of HADIYA – মানবতার উপহার.</li>
                </ul>
                <h3 className="font-bold text-[0.6rem] border-b border-gray-300 text-gray-800 pb-[2px] mb-1 mt-[8px]">{language === 'bn' ? 'যোগাযোগ' : 'Contact Info'}</h3>
                <p className="text-[0.5rem] text-gray-600 m-0 leading-snug">
                    <strong>Website:</strong> www.hadiya.org<br/>
                    <strong>Email:</strong> infohadiyateam@gmail.com<br/>
                    <strong>Address:</strong> Chandgaon, Chattogram, Bangladesh.
                </p>
            </div>
            <div className="w-[45px] h-[45px] flex-shrink-0 ml-2">
                {backQrCodeUrl && <img src={backQrCodeUrl} alt="QR Code" className="w-full h-full" />}
            </div>
          </div>
          
          <div className="p-[5px_16px_10px] text-center">
            <BarcodeDisplay memberId={member?.memberId || 'H-0000'} isPdf={isPdf} />
          </div>
      </div>
  );
}
