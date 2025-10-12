
'use client';

import type { Member } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { Quote, Globe, Mail, Phone, MapPin } from 'lucide-react';
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

  const memberName = member?.name || (language === 'bn' ? 'মোহাম্মদ রহিম' : 'Mohammad Rahim');
  const memberId = member?.memberId || 'HADIYA-24021';
  const joinDate = member?.joinDate ? new Date(member.joinDate).toLocaleDateString('en-GB') : '01/01/2025';
  const validTill = '31/12/2025';
  const role = language === 'bn' ? 'স্বেচ্ছাসেবক / দাতা / নির্বাহী সদস্য' : 'Volunteer / Donor / Executive Member';

  useEffect(() => {
    const generateQrCode = async () => {
      if (!memberId) return;
      try {
        const url = await QRCode.toDataURL(memberId, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          quality: 0.9,
          margin: 1,
          width: isPdf ? 50 : 60,
          color: {
            dark: '#000000',
            light: '#FFFFFF00' // Transparent background
          }
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      }
    };
    generateQrCode();
  }, [memberId, isPdf]);

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
    color: '#2d3748',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
  };

  const backSideStyles: React.CSSProperties = {
    ...cardStyles,
    border: isPdf ? '1px solid #e2e8f0' : '1px solid #ddd',
    backgroundColor: 'white',
  };

  if (side === 'front') {
    return (
      <div style={cardStyles}>
        {/* Header */}
        <div style={{ position: 'relative', padding: isPdf ? '8px 12px' : '10px 16px', color: '#007A3D', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '70%', backgroundColor: '#F0FFF4', zIndex: 0 }}>
            <svg style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0 }} viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 10 C 20 20, 40 0, 60 15 S 80 0, 100 10 L 100 20 L 0 20 Z" fill="white" />
            </svg>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontFamily: '"Montserrat", "SolaimanLipi", sans-serif', fontSize: isPdf ? '13px' : '1rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>
              HADIYA – মানবতার উপহার
            </h1>
            <p style={{ fontFamily: '"AdorshoLipi", sans-serif', fontSize: isPdf ? '8px' : '0.6rem', color: '#007A3D', margin: '2px 0 0', fontWeight: 'normal', whiteSpace: 'nowrap' }}>
              একটি মানবতার সেবা উদ্যোগ
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: isPdf ? '4px 12px' : '5px 16px', flexGrow: 1, display: 'flex', gap: isPdf ? '8px' : '12px' }}>
          <div style={{ width: isPdf ? '60px' : '70px', height: isPdf ? '75px' : '85px', backgroundColor: '#e2e8f0', borderRadius: '8px', flexShrink: 0, alignSelf: 'center' }} />
          <div style={{ flexGrow: 1 }}>
            <h2 style={{ fontFamily: '"Montserrat", "AdorshoLipi", sans-serif', fontSize: isPdf ? '13px' : '1.1rem', fontWeight: 'bold', margin: '2px 0 0 0', color: '#2d3748' }}>{memberName}</h2>
            <p style={{ fontSize: isPdf ? '10px' : '0.8rem', margin: '2px 0', fontFamily: 'monospace' }}>{memberId}</p>
            <p style={{ fontSize: isPdf ? '8px' : '0.65rem', margin: '4px 0', color: '#4a5568' }}>{role}</p>
          </div>
        </div>

        {/* Mid Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isPdf ? '0px 12px' : '0px 16px' }}>
           <div style={{ fontSize: isPdf ? '8px' : '0.7rem' }}>
              <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>Join Date</span> &nbsp;&nbsp;{joinDate}</p>
              <p style={{ margin: '2px 0 0' }}><span style={{ fontWeight: 'bold' }}>Valid Till</span> &nbsp;&nbsp;&nbsp; {validTill}</p>
           </div>
           {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code" style={{ width: isPdf ? '35px' : '45px', height: isPdf ? '35px' : '45px' }} /> : <div style={{ width: isPdf ? '35px' : '45px', height: isPdf ? '35px' : '45px', backgroundColor: '#f0f0f0' }} />}
        </div>
        
        {/* Signature */}
        <div style={{ padding: isPdf ? '4px 12px' : '5px 16px', marginTop: isPdf ? '4px' : '5px' }}>
          <div style={{ borderTop: '1px solid #ccc', paddingTop: '2px' }}>
            <p style={{ margin: 0, fontStyle: 'italic', fontSize: isPdf ? '9px' : '0.7rem', color: '#4a5568', position: 'relative', top: '-6px', left: '10px', background: 'white', padding: '0 5px', width: 'fit-content' }}>Signature</p>
            <p style={{ margin: '-8px 0 0 0', textAlign: 'right', fontSize: isPdf ? '7px' : '0.6rem', color: '#4a5568' }}>Signature of Authority</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: isPdf ? '4px 12px' : '5px 16px', textAlign: 'center' }}>
            <p style={{ fontStyle: 'italic', fontSize: isPdf ? '8px' : '0.65rem', color: '#4a5568', margin: 0 }}>
              ‘মানবতার সেবাই আমাদের উদ্যোগ’
            </p>
        </div>
      </div>
    );
  }

  // BACK SIDE
  return (
      <div style={{ ...backSideStyles, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: isPdf ? '8px 12px' : '10px 16px', backgroundColor: '#007A3D', color: 'white', textAlign: 'center', borderTopLeftRadius: isPdf ? '2.5mm' : '10px', borderTopRightRadius: isPdf ? '2.5mm' : '10px' }}>
            <h1 style={{ fontFamily: '"Montserrat", "SolaimanLipi", sans-serif', fontSize: isPdf ? '13px' : '1rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>
              HADIYA – মানবতার উপহার
            </h1>
            <p style={{ fontFamily: '"AdorshoLipi", sans-serif', fontSize: isPdf ? '8px' : '0.6rem', margin: '2px 0 0', fontWeight: 'normal', whiteSpace: 'nowrap' }}>
              একটি মানবতার সেবা উদ্যোগ
            </p>
          </div>
           <div style={{ height: '3px', backgroundColor: '#D4AF37' }}></div>

          <div style={{ padding: isPdf ? '8px 12px' : '10px 16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', fontSize: isPdf ? '8px' : '0.65rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={isPdf ? 12 : 14} color="#007A3D" /> <span>www.hadiya.org</span>
              </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={isPdf ? 12 : 14} color="#007A3D" /> <span>info@hadiya.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={isPdf ? 12 : 14} color="#007A3D" /> <span>+8801XXXXXXXXX</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={isPdf ? 12 : 14} color="#007A3D" /> <span>Chandgaon, Chattogram, Bangladesh</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: isPdf ? '8px' : '12px', marginTop: isPdf ? '8px' : '10px' }}>
                 {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code" style={{ width: isPdf ? '40px' : '50px', height: isPdf ? '40px' : '50px' }} /> : <div style={{ width: isPdf ? '40px' : '50px', height: isPdf ? '40px' : '50px', backgroundColor: '#f0f0f0' }} />}
                 <div style={{ fontSize: isPdf ? '7px' : '0.6rem', color: '#4a5568' }}>
                    <b>QR Code / NFC tag –</b><br /> scan or tap to verify membership
                 </div>
              </div>
          </div>
          
          <div style={{ padding: isPdf ? '4px 12px 8px' : '5px 16px 10px' }}>
              <ul style={{ margin: 0, paddingLeft: '14px', fontSize: isPdf ? '6px' : '0.5rem', color: '#4a5568', listStyle: 'disc' }}>
                    <li>This card is non-transferable.</li>
                    <li>Please return if found.</li>
              </ul>
              <p style={{ textAlign: 'center', fontSize: isPdf ? '6.5px' : '0.55rem', color: '#4a5568', margin: '4px 0 0 0', fontWeight: 'bold' }}>
                  Property of HADIYA – মানবতার উপহার
              </p>
          </div>
      </div>
  )
}
