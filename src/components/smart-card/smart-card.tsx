
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

  const memberName = member?.name || (language === 'bn' ? 'মোহাম্মদ রহিম' : 'Mohammad Rahim');
  const memberId = member?.memberId || 'HADIYA-24021';
  const joinDate = member?.joinDate ? new Date(member.joinDate).toLocaleDateString('en-GB') : '01/01/2025';
  const role = language === 'bn' ? 'স্বেচ্ছাসেবক / দাতা / নির্বাহী সদস্য' : 'Volunteer / Donor / Executive Member';
  
  const cardStyles: React.CSSProperties = {
    width: '100%',
    aspectRatio: '85.6 / 53.98',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    color: '#2d3748',
  };
  
  const frontBackgroundStyles: React.CSSProperties = {
    background: 'linear-gradient(135deg, #ffffff 70%, rgba(229, 245, 238, 0.5) 100%)',
    border: '1px solid #e2e8f0',
  };

  const backBackgroundStyles: React.CSSProperties = {
    backgroundColor: '#ffffff',
    border: `1px solid #D4AF37`,
  };

  if (side === 'front') {
    return (
      <div style={{ ...cardStyles, ...frontBackgroundStyles }} className={cn("font-body", isPdf ? "pdf-card" : "shadow-lg rounded-xl")}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center'}} className={isPdf ? "p-[6px_12px] gap-[6px]" : "p-[8px_16px] gap-[8px]"}>
          <HeartHandshake style={{color: '#007A3D', flexShrink: 0 }} className={isPdf ? "h-[20px] w-[20px]" : "h-[24px] w-[24px]"} />
          <div style={{ lineHeight: '1.2' }}>
            <h1 className="font-card_headline" style={{ fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>
              <span style={{ color: '#007A3D' }}>HADIYA</span>{' – '}<span style={{ color: '#D4AF37' }}>{`মানবতার উপহার`}</span>
            </h1>
            <p className={cn("font-subheadline", isPdf ? "text-[5px]" : "text-[0.4rem]")} style={{ color: '#4a5568', margin: '1px 0 0', fontWeight: 'normal', whiteSpace: 'nowrap' }}>
              {'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }} className={isPdf ? "p-[6px_12px]" : "p-[8px_16px]"}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0', textAlign: 'center', flexShrink: 0 }} className={isPdf ? "w-[50px] h-[65px] text-[8px] mr-[8px]" : "w-[60px] h-[75px] text-[10px] mr-[12px]"}>
              {/* Photo placeholder, no frame */}
            </div>
            <div style={{ flexGrow: 1 }}>
                <h2 className={cn("font-body", isPdf ? "text-[10px]" : "text-[0.9rem]")} style={{ fontWeight: 'bold', margin: 0, color: '#000' }}>{memberName}</h2>
                <p style={{ margin: '3px 0', fontFamily: 'monospace', color: '#000' }} className={isPdf ? "text-[7px]" : "text-[0.55rem]"}>
                  <span style={{fontWeight: 'bold'}}>ID:</span> {memberId}
                </p>
                <p style={{ margin: '3px 0', color: '#4a5568' }} className={isPdf ? "text-[7px]" : "text-[0.55rem]"}>
                  <span style={{fontWeight: 'bold'}}>{language === 'bn' ? 'পদবি:' : 'Designation:'}</span> {role}
                </p>
                <p style={{ margin: '3px 0', color: '#4a5568' }} className={isPdf ? "text-[7px]" : "text-[0.55rem]"}>
                  <span style={{fontWeight: 'bold'}}>{language === 'bn' ? 'যোগদানের তারিখ:' : 'Join Date:'}</span> {joinDate}
                </p>
            </div>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: 'rgba(0, 122, 61, 0.05)', borderTop: '1px solid #e2e8f0', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} className={isPdf ? "p-[5px_12px]" : "p-[6px_16px]"}>
             <p style={{ fontWeight: 'bold', color: '#000', margin: 0 }} className={isPdf ? "text-[6px]" : "text-[0.5rem]"}>
              দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়। — শেখ সাদী
            </p>
        </div>
      </div>
    );
  }

  // BACK SIDE
  return (
      <div style={{ ...cardStyles, ...backBackgroundStyles }} className={cn("font-body", isPdf ? "pdf-card" : "shadow-lg rounded-xl")}>
          <div style={{ backgroundColor: '#2d3748' }} className={isPdf ? "h-[20px] mt-[12px]" : "h-[25px] mt-[15px]"}></div>
          
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className={isPdf ? "p-[8px_12px]" : "p-[10px_16px]"}>
            <div>
                <h3 style={{fontWeight: 'bold', borderBottom: '1px solid #D4AF37', color: '#007A3D', paddingBottom: '2px', marginBottom: '4px' }} className={isPdf ? "text-[8px]" : "text-[0.6rem]"}>{language === 'bn' ? 'শর্তাবলী এবং নোট' : 'Terms & Notes'}</h3>
                <ul style={{ margin: 0, paddingLeft: '14px', color: '#4a5568', listStyle: 'disc' }} className={isPdf ? "text-[6.5px]" : "text-[0.55rem]"}>
                    <li>This card is non-transferable.</li>
                    <li>Please return if found.</li>
                    <li>Property of HADIYA – মানবতার উপহার.</li>
                </ul>
            </div>
            
            <div>
                <h3 style={{fontWeight: 'bold', borderBottom: '1px solid #D4AF37', color: '#007A3D', paddingBottom: '2px', marginBottom: '4px' }} className={isPdf ? "text-[8px] mt-[8px]" : "text-[0.6rem] mt-[10px]"}>{language === 'bn' ? 'যোগাযোগ' : 'Contact Info'}</h3>
                <p style={{ color: '#4a5568', margin: 0, lineHeight: 1.4 }} className={isPdf ? "text-[6.5px]" : "text-[0.55rem]"}>
                    <strong>Website:</strong> www.hadiya.org<br/>
                    <strong>Email:</strong> infohadiyateam@gmail.com<br/>
                    <strong>Address:</strong> Chandgaon, Chattogram, Bangladesh.
                </p>
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }} className={isPdf ? "p-[4px_12px_8px]" : "p-[5px_16px_10px]"}>
              <BarcodeDisplay memberId={memberId} isPdf={isPdf} />
          </div>
      </div>
  )
}
