
'use client';

import type { Member } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { BarcodeDisplay } from './barcode-display';
import { Quote, HeartHandshake } from 'lucide-react';

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
    borderRadius: isPdf ? '3mm' : '12px',
    boxShadow: isPdf ? 'none' : '0 10px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.1)',
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
      <div style={{ ...cardStyles, ...frontBackgroundStyles }} className="font-body">
        {/* Header */}
        <div style={{ padding: isPdf ? '10px 12px' : '12px 16px', borderBottom: '1px solid #e2e8f0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <HeartHandshake style={{ height: isPdf ? '20px' : '24px', width: isPdf ? '20px' : '24px', color: '#007A3D' }} />
          <div style={{ textAlign: 'center' }}>
            <h1 className="font-headline" style={{ fontSize: isPdf ? '14px' : '1.1rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>
              <span style={{ color: '#007A3D' }}>HADIYA</span>{' – '}<span style={{ color: '#D4AF37' }}>{`মানবতার উপহার`}</span>
            </h1>
            <p style={{ fontFamily: '"AdorshoLipi", sans-serif', fontSize: isPdf ? '7px' : '0.5rem', color: '#4a5568', margin: '2px 0 0', fontWeight: 'normal', whiteSpace: 'nowrap' }}>
              {'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: isPdf ? '8px 12px' : '10px 16px', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
           <div style={{ width: isPdf ? '60px' : '70px', height: isPdf ? '75px' : '85px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isPdf ? '10px' : '12px', color: '#a0aec0', textAlign: 'center', flexShrink: 0, marginRight: isPdf ? '10px' : '16px' }}>
              {/* Photo placeholder, no frame */}
            </div>
            <div style={{ flexGrow: 1 }}>
                <h2 style={{ fontSize: isPdf ? '16px' : '1.2rem', fontWeight: 'bold', margin: 0, color: '#007A3D' }}>{memberName}</h2>
                <p style={{ fontSize: isPdf ? '10px' : '0.8rem', margin: '4px 0', fontFamily: 'monospace' }}>
                  <span style={{fontWeight: 'bold'}}>ID:</span> {memberId}
                </p>
                <p style={{ fontSize: isPdf ? '10px' : '0.8rem', margin: '4px 0', color: '#4a5568' }}>
                  <span style={{fontWeight: 'bold'}}>{language === 'bn' ? 'পদবি:' : 'Designation:'}</span> {role}
                </p>
                <p style={{ fontSize: isPdf ? '10px' : '0.75rem', margin: '4px 0', color: '#4a5568' }}>
                  <span style={{fontWeight: 'bold'}}>{language === 'bn' ? 'যোগদানের তারিখ:' : 'Join Date:'}</span> {joinDate}
                </p>
            </div>
        </div>

        {/* Footer */}
        <div style={{ padding: isPdf ? '6px 12px' : '8px 16px', backgroundColor: 'rgba(0, 122, 61, 0.05)', borderTop: '1px solid #e2e8f0', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Quote style={{ width: isPdf ? '10px' : '12px', height: isPdf ? '10px' : '12px', color: '#D4AF37', marginRight: '8px' }} />
            <p style={{ fontStyle: 'italic', fontSize: isPdf ? '8px' : '0.6rem', color: '#4a5568', margin: 0 }}>
              {language === 'bn' ? 'দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়। — শেখ সাদী' : 'Do not be ashamed of giving a little, for refusing is a greater shame. — Sheikh Saadi'}
            </p>
        </div>
      </div>
    );
  }

  // BACK SIDE
  return (
      <div style={{ ...cardStyles, ...backBackgroundStyles }} className="font-body">
          <div style={{ height: isPdf ? '20px' : '25px', backgroundColor: '#2d3748', marginTop: isPdf ? '12px' : '15px' }}></div>
          
          <div style={{ padding: isPdf ? '8px 12px' : '10px 16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
                <h3 style={{fontWeight: 'bold', fontSize: isPdf ? '8px' : '0.6rem', borderBottom: '1px solid #D4AF37', color: '#007A3D', paddingBottom: '2px', marginBottom: '4px' }}>{language === 'bn' ? 'শর্তাবলী এবং নোট' : 'Terms & Notes'}</h3>
                <ul style={{ margin: 0, paddingLeft: '14px', fontSize: isPdf ? '6.5px' : '0.55rem', color: '#4a5568', listStyle: 'disc' }}>
                    <li>This card is non-transferable.</li>
                    <li>Please return if found.</li>
                    <li>Property of HADIYA – মানবতার উপহার.</li>
                </ul>
            </div>
            
            <div>
                <h3 style={{fontWeight: 'bold', fontSize: isPdf ? '8px' : '0.6rem', borderBottom: '1px solid #D4AF37', color: '#007A3D', paddingBottom: '2px', marginBottom: '4px', marginTop: isPdf ? '8px' : '10px' }}>{language === 'bn' ? 'যোগাযোগ' : 'Contact Info'}</h3>
                <p style={{ fontSize: isPdf ? '6.5px' : '0.55rem', color: '#4a5568', margin: 0, lineHeight: 1.4 }}>
                    <strong>Website:</strong> www.hadiya.org<br/>
                    <strong>Email:</strong> infohadiyateam@gmail.com<br/>
                    <strong>Address:</strong> Chandgaon, Chattogram, Bangladesh.
                </p>
            </div>
          </div>
          
          <div style={{ padding: isPdf ? '4px 12px 8px' : '5px 16px 10px', textAlign: 'center' }}>
              <BarcodeDisplay memberId={memberId} isPdf={isPdf} />
          </div>
      </div>
  )
}
