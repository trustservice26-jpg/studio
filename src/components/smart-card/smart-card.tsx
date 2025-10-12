
'use client';

import type { Member } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { BarcodeDisplay } from './barcode-display';
import { Quote } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

type SmartCardProps = {
  member: Partial<Member> | null;
  side: 'front' | 'back';
  isPdf?: boolean;
  language?: 'en' | 'bn';
};

export function SmartCard({ member, side, isPdf = false, language: propLanguage }: SmartCardProps) {
  const appContext = useAppContext();
  const language = propLanguage || appContext.language;
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const generateQrCode = async () => {
      if (!member?.memberId) return;
      try {
        const url = await QRCode.toDataURL(member.memberId, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          quality: 0.9,
          margin: 1,
          width: isPdf ? 60 : 70,
          color: {
            dark: '#333',
            light: '#FFFFFF00' // Transparent background
          }
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      }
    };
    generateQrCode();
  }, [member?.memberId, isPdf]);

  const cardStyles: React.CSSProperties = {
    fontFamily: '"Poppins", "AdorshoLipi", sans-serif',
    width: '100%',
    aspectRatio: '85.6 / 53.98',
    borderRadius: isPdf ? '3mm' : '12px',
    boxShadow: isPdf ? 'none' : '0 10px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    color: '#2d3748', // Dark Green/Gray
  };

  const frontBackgroundStyles: React.CSSProperties = {
    background: 'linear-gradient(135deg, #ffffff 70%, rgba(0, 122, 61, 0.1) 100%)',
    border: '1px solid #e2e8f0',
  };

  const backBackgroundStyles: React.CSSProperties = {
    backgroundColor: '#f0fff4',
    border: `2px solid #D4AF37`,
  };
  
  if (side === 'front') {
    return (
      <div style={{ ...cardStyles, ...frontBackgroundStyles }}>
        {/* Header */}
        <div style={{ padding: isPdf ? '10px 12px' : '12px 16px', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: '"Montserrat", "SolaimanLipi", sans-serif', fontSize: isPdf ? '14px' : '1.1rem', fontWeight: 700, margin: 0 }}>
              <span style={{ color: '#007A3D' }}>HADIYA</span> – <span style={{ color: '#D4AF37' }}> মানবতার উপহার</span>
            </h1>
            <p style={{ fontFamily: '"AdorshoLipi", sans-serif', fontSize: isPdf ? '7px' : '0.5rem', color: '#4a5568', margin: '2px 0 0', fontWeight: 'normal' }}>
              শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ
            </p>
          </div>
          {qrCodeUrl && (
            <div style={{ position: 'absolute', top: isPdf ? '8px' : '10px', right: isPdf ? '8px' : '10px' }}>
                <img src={qrCodeUrl} alt="QR Code" style={{ width: isPdf ? '40px' : '45px', height: isPdf ? '40px' : '45px' }}/>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: isPdf ? '8px 12px' : '10px 16px', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
           <div style={{ width: isPdf ? '60px' : '70px', height: isPdf ? '75px' : '85px', border: '2px dashed #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', fontSize: isPdf ? '10px' : '12px', color: '#a0aec0', textAlign: 'center', flexShrink: 0, marginRight: isPdf ? '10px' : '16px' }}>
              {language === 'bn' ? 'ছবি' : 'Photo'}
            </div>
            <div style={{ flexGrow: 1 }}>
                <h2 style={{ fontSize: isPdf ? '16px' : '1.2rem', fontWeight: 'bold', margin: 0, color: '#007A3D' }}>{member?.name || (language === 'bn' ? 'সদস্যের নাম' : 'Member Name')}</h2>
                <p style={{ fontSize: isPdf ? '10px' : '0.8rem', margin: '4px 0', fontFamily: 'monospace' }}>
                  <span style={{fontWeight: 'bold'}}>ID:</span> {member?.memberId || 'H-0000'}
                </p>
                <p style={{ fontSize: isPdf ? '10px' : '0.8rem', margin: '4px 0', color: '#4a5568' }}>
                  <span style={{fontWeight: 'bold'}}>{language === 'bn' ? 'পদবি:' : 'Designation:'}</span> Executive Member/DONOR/Volunteer
                </p>
                <p style={{ fontSize: isPdf ? '10px' : '0.75rem', margin: '4px 0', color: '#4a5568' }}>
                  <span style={{fontWeight: 'bold'}}>{language === 'bn' ? 'যোগদানের তারিখ:' : 'Join Date:'}</span> {member?.joinDate ? new Date(member.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US') : 'dd/mm/yyyy'}
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
      <div style={{ ...cardStyles, ...backBackgroundStyles }}>
          <div style={{ height: isPdf ? '35px' : '40px', backgroundColor: '#2d3748', marginTop: isPdf ? '15px' : '20px' }}></div>
          <div style={{ padding: isPdf ? '8px' : '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <p style={{ fontFamily: 'monospace', fontSize: isPdf ? '10px' : '12px', color: '#2d3748', backgroundColor: '#fff', padding: '2px 4px', borderRadius: '3px' }}>{member?.memberId || 'H-0000'}</p>
              <div style={{ flexGrow: 1, height: isPdf ? '25px' : '30px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', textAlign: 'right', padding: '0 8px', fontStyle: 'italic', fontSize: isPdf ? '12px' : '14px', lineHeight: isPdf ? '25px' : '30px' }}>
                  {language === 'bn' ? 'সদস্যের স্বাক্ষর' : 'Member Signature'}
              </div>
          </div>
          <div style={{ flexGrow: 1, padding: isPdf ? '0 12px' : '0 16px', fontSize: isPdf ? '6.5px' : '0.5rem', color: '#4a5568' }}>
              <h3 style={{fontWeight: 'bold', fontSize: isPdf ? '8px' : '0.6rem', borderBottom: '1px solid #D4AF37', paddingBottom: '2px', marginBottom: '4px' }}>{language === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions'}</h3>
              <ol style={{ margin: 0, paddingLeft: '14px', listStyle: 'decimal' }}>
                  <li>This card is non-transferable.</li>
                  <li>Card must be presented upon request by an official.</li>
                  <li>Loss or theft of this card must be reported immediately.</li>
                  <li>This card remains the property of HADIYA.</li>
              </ol>
          </div>
          <div style={{ padding: isPdf ? '8px' : '10px', textAlign: 'center' }}>
              {member?.memberId && <BarcodeDisplay memberId={member.memberId} isPdf={isPdf} />}
          </div>
          <p style={{ fontSize: isPdf ? '8px' : '10px', textAlign: 'center', color: '#007A3D', padding: '4px', margin: 0 }}>
            www.hadiyabd.com
          </p>
      </div>
  )

}
