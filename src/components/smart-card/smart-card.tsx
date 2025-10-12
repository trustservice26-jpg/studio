
'use client';

import type { Member } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { BarcodeDisplay } from './barcode-display';
import { HeartHandshake } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a placeholder on the server
    return <div className="aspect-[85.6/53.98] w-full rounded-xl bg-muted" />;
  }

  const memberName = member?.name || (language === 'bn' ? 'মোহাম্মদ রহিম' : 'Mohammad Rahim');
  const memberId = member?.memberId || 'HADIYA-24021';
  const joinDate = member?.joinDate ? new Date(member.joinDate).toLocaleDateString('en-GB') : '01/01/2025';
  const role = language === 'bn' ? 'স্বেচ্ছাসেবক / দাতা / নির্বাহী সদস্য' : 'Volunteer / Donor / Executive Member';
  
  const baseCardStyles = "w-full aspect-[85.6/53.98] flex flex-col overflow-hidden relative text-gray-800 font-body";
  const cardAppearance = isPdf ? "pdf-card" : "shadow-lg rounded-xl";

  if (side === 'front') {
    return (
      <div className={cn(baseCardStyles, cardAppearance, "bg-gradient-to-br from-white from-70% to-green-50/50 border border-gray-200")}>
        {/* Header */}
        <div className={cn("border-b border-gray-200 flex items-center", isPdf ? "p-[6px_12px] gap-[6px]" : "p-[8px_16px] gap-[8px]")}>
          <HeartHandshake className={cn("text-green-700 flex-shrink-0", isPdf ? "h-[20px] w-[20px]" : "h-[24px] w-[24px]")} />
          <div className="leading-tight">
            <h1 className={cn("font-card_headline font-bold m-0 whitespace-nowrap", isPdf ? 'text-sm' : 'text-base' )}>
              <span className="text-green-700">HADIYA</span>{' – '}<span className="text-yellow-600">{`মানবতার উপহার`}</span>
            </h1>
            <p className={cn("font-subheadline text-gray-600 m-0 font-normal whitespace-nowrap", isPdf ? "text-[5px]" : "text-[0.4rem]")}>
              {'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className={cn("flex-grow flex items-center", isPdf ? "p-[6px_12px]" : "p-[8px_16px]")}>
           <div className={cn("flex items-center justify-center text-gray-400 text-center flex-shrink-0", isPdf ? "w-[50px] h-[65px] text-[8px] mr-[8px]" : "w-[60px] h-[75px] text-[10px] mr-[12px]")}>
              {/* Photo placeholder, no frame */}
            </div>
            <div className="flex-grow">
                <h2 className={cn("font-bold m-0 text-black", isPdf ? "text-[10px]" : "text-[0.9rem]")}>{memberName}</h2>
                <p className={cn("my-[3px] font-mono text-black", isPdf ? "text-[7px]" : "text-[0.55rem]")}>
                  <span className="font-bold">ID:</span> {memberId}
                </p>
                <p className={cn("my-[3px] text-gray-600", isPdf ? "text-[7px]" : "text-[0.55rem]")}>
                  <span className="font-bold">{language === 'bn' ? 'পদবি:' : 'Designation:'}</span> {role}
                </p>
                <p className={cn("my-[3px] text-gray-600", isPdf ? "text-[7px]" : "text-[0.55rem]")}>
                  <span className="font-bold">{language === 'bn' ? 'যোগদানের তারিখ:' : 'Join Date:'}</span> {joinDate}
                </p>
            </div>
        </div>

        {/* Footer */}
        <div className={cn("bg-green-700/5 border-t border-gray-200 text-center flex items-center justify-center gap-2", isPdf ? "p-[5px_12px]" : "p-[6px_16px]")}>
             <p className={cn("font-bold text-black m-0", isPdf ? "text-[6px]" : "text-[0.5rem]")}>
              দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়। — শেখ সাদী
            </p>
        </div>
      </div>
    );
  }

  // BACK SIDE
  return (
      <div className={cn(baseCardStyles, cardAppearance, "bg-white border border-yellow-500")}>
          <div className={cn("bg-gray-800", isPdf ? "h-[20px] mt-[12px]" : "h-[25px] mt-[15px]")}></div>
          
          <div className={cn("flex-grow flex flex-col justify-between", isPdf ? "p-[8px_12px]" : "p-[10px_16px]")}>
            <div>
                <h3 className={cn("font-bold border-b border-yellow-500 text-green-700 pb-[2px] mb-1", isPdf ? "text-[8px]" : "text-[0.6rem]")}>{language === 'bn' ? 'শর্তাবলী এবং নোট' : 'Terms & Notes'}</h3>
                <ul className={cn("m-0 pl-3.5 text-gray-600 list-disc", isPdf ? "text-[6.5px]" : "text-[0.55rem]")}>
                    <li>This card is non-transferable.</li>
                    <li>Please return if found.</li>
                    <li>Property of HADIYA – মানবতার উপহার.</li>
                </ul>
            </div>
            
            <div>
                <h3 className={cn("font-bold border-b border-yellow-500 text-green-700 pb-[2px] mb-1", isPdf ? "text-[8px] mt-[8px]" : "text-[0.6rem] mt-[10px]")}>{language === 'bn' ? 'যোগাযোগ' : 'Contact Info'}</h3>
                <p className={cn("text-gray-600 m-0 leading-snug", isPdf ? "text-[6.5px]" : "text-[0.55rem]")}>
                    <strong>Website:</strong> www.hadiya.org<br/>
                    <strong>Email:</strong> infohadiyateam@gmail.com<br/>
                    <strong>Address:</strong> Chandgaon, Chattogram, Bangladesh.
                </p>
            </div>
          </div>
          
          <div className={cn("text-center", isPdf ? "p-[4px_12px_8px]" : "p-[5px_16px_10px]")}>
              <BarcodeDisplay memberId={memberId} isPdf={isPdf} />
          </div>
      </div>
  )
}
