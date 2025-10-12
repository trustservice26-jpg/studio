
'use client';

import type { Member } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { BarcodeDisplay } from './barcode-display';
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
      if (!member?.memberId) {
        setQrCodeUrl('');
        return;
      }
      try {
        const url = await QRCode.toDataURL(member.memberId, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          quality: 0.9,
          margin: 1,
          width: isPdf ? 40 : 45,
          color: {
            dark: '#FFFFFF',
            light: '#00000000' // Transparent background
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
  };

  if (side === 'front') {
    return (
      <div style={{ ...cardStyles, backgroundColor: '#007A3D' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
          <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: isPdf ? '3mm' : '12px', borderBottomLeftRadius: isPdf ? '3mm' : '12px' }}></div>
          <div style={{ flex: 0.5, backgroundColor: '#007A3D' }}></div>
           <div style={{
              position: 'absolute',
              top: 0, bottom: 0, left: '60%',
              width: '150px',
              backgroundColor: '#FFFFFF',
              transform: 'skewX(-15deg)',
          }}></div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: isPdf ? '8px 12px' : '12px 16px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontFamily: '"Montserrat", "SolaimanLipi", sans-serif', fontSize: isPdf ? '14px' : '1.1rem', fontWeight: 700, margin: 0, color: '#D4AF37', whiteSpace: 'nowrap' }}>
                HADIYA <span style={{ color: '#007A3D' }}>– মানবতার উপহার</span>
              </h1>
              <p style={{ fontFamily: '"AdorshoLipi", sans-serif', fontSize: isPdf ? '6px' : '0.45rem', color: '#4a5568', margin: '2px 0 0', fontWeight: 'normal', whiteSpace: 'nowrap' }}>
                {language === 'bn' ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি উদ্যোগ' : 'An initiative under Shahid Liyakot Shriti Songo (Chandgaon).'}
              </p>
            </div>
             {qrCodeUrl ? (
                <div style={{ width: isPdf ? '40px' : '45px', height: isPdf ? '40px' : '45px', backgroundColor: '#007A3D', borderRadius: '4px', padding: '2px' }}>
                    <img src={qrCodeUrl} alt="QR Code" style={{ width: '100%', height: '100%' }}/>
                </div>
            ) : (
                <div style={{ width: isPdf ? '40px' : '45px', height: isPdf ? '40px' : '45px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
            )}
          </div>
          
          {/* Spacer */}
          <div style={{ flexGrow: 1 }}></div>

          {/* Body */}
          <div style={{ color: '#FFFFFF' }}>
              <p style={{ fontSize: isPdf ? '10px' : '0.7rem', margin: 0, color: '#FFFFFF', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {language === 'bn' ? 'সদস্যের নাম' : 'Member Name'}
              </p>
              <h2 style={{ fontFamily: '"Montserrat", "AdorshoLipi", sans-serif', fontSize: isPdf ? '16px' : '1.2rem', fontWeight: 'bold', margin: '2px 0 0', color: '#FFFFFF' }}>{member?.name || (language === 'bn' ? 'সদস্যের নাম' : 'Member Name')}</h2>
              <p style={{ fontSize: isPdf ? '10px' : '0.8rem', margin: '8px 0 0', fontFamily: 'monospace' }}>
                {member?.memberId || 'H-0000'}
              </p>
          </div>
        </div>
      </div>
    );
  }

  // BACK SIDE
  return (
      <div style={{ ...cardStyles, backgroundColor: '#ffffff', border: '1px solid #D4AF37' }}>
          <div style={{ height: isPdf ? '20px' : '25px', backgroundColor: '#2d3748', marginTop: isPdf ? '12px' : '15px' }}></div>
          
          <div style={{ padding: isPdf ? '8px 12px' : '10px 16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#2d3748' }}>
            <div>
                <h3 style={{fontWeight: 'bold', fontSize: isPdf ? '8px' : '0.6rem', borderBottom: '1px solid #D4AF37', color: '#007A3D', paddingBottom: '2px', marginBottom: '4px' }}>{language === 'bn' ? 'শর্তাবলী এবং নোট' : 'Terms & Notes'}</h3>
                <ul style={{ margin: 0, paddingLeft: '14px', fontSize: isPdf ? '6.5px' : '0.55rem', color: '#4a5568', listStyle: 'disc' }}>
                    <li>This card is non-transferable.</li>
                    <li>Please return if found.</li>
                    <li>Property of HADIYA – মানবতার উপহার.</li>
                </ul>
            </div>
            
            <div style={{marginTop: isPdf ? '8px' : '10px'}}>
                <h3 style={{fontWeight: 'bold', fontSize: isPdf ? '8px' : '0.6rem', borderBottom: '1px solid #D4AF37', color: '#007A3D', paddingBottom: '2px', marginBottom: '4px' }}>{language === 'bn' ? 'যোগাযোগ' : 'Contact Info'}</h3>
                <p style={{ fontSize: isPdf ? '6.5px' : '0.55rem', color: '#4a5568', margin: 0, lineHeight: 1.4 }}>
                    <strong>Website:</strong> www.hadiya.org<br/>
                    <strong>Email:</strong> infohadiyateam@gmail.com<br/>
                    <strong>Address:</strong> Chandgaon, Chattogram, Bangladesh.
                </p>
            </div>
          </div>
          
          <div style={{ padding: isPdf ? '4px 12px 8px' : '5px 16px 10px', textAlign: 'center' }}>
              {member?.memberId && <BarcodeDisplay memberId={member.memberId} isPdf={isPdf} />}
          </div>
      </div>
  )
}
