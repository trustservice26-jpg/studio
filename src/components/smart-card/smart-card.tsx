
'use client';

import type { Member } from '@/lib/types';
import { BarcodeDisplay } from './barcode-display';
import { HeartHandshake } from 'lucide-react';
import { useAppContext } from '@/context/app-context';

type SmartCardProps = {
  member: Partial<Member> | null;
  isPdf?: boolean;
  language?: 'en' | 'bn';
};

export function SmartCard({ member, isPdf = false, language: propLanguage }: SmartCardProps) {
  const appContext = useAppContext();
  const language = propLanguage || appContext.language;
  
  const cardStyles: React.CSSProperties = {
    fontFamily: '"PT Sans", sans-serif',
    width: isPdf ? '323px' : '100%', // 85.6mm at 96dpi is ~323px
    aspectRatio: '85.6 / 53.98',
    borderRadius: '12px', // 3mm at 96dpi is ~11.3px
    background: 'linear-gradient(135deg, #ffffff 0%, #f0fff0 100%)',
    border: '1px solid #007A3D',
    color: '#333',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  };

  const headerStyles: React.CSSProperties = {
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #007A3D'
  };

  const logoContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };
  
  const orgNameStyles: React.CSSProperties = {
    fontFamily: '"Cinzel Decorative", serif',
    fontSize: isPdf ? '14px' : '1rem',
    fontWeight: 'bold',
  };

  const subtitleStyles: React.CSSProperties = {
    fontFamily: '"Noto Serif Bengali", serif',
    fontSize: isPdf ? '10px' : '0.75rem',
    color: '#555',
    marginTop: '2px',
  };
  
  const bodyStyles: React.CSSProperties = {
    padding: '12px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const detailItemStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: isPdf ? '10px' : '0.75rem',
    padding: '4px 0',
    borderBottom: '1px solid #e0e0e0',
  };
  
  const detailLabelStyles: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#007A3D',
  };

  const footerStyles: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: 'rgba(240, 255, 240, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };


  if (!member) {
    return (
        <div style={cardStyles} className="items-center justify-center text-muted-foreground">
            {language === 'bn' ? 'সদস্য নির্বাচন করুন' : 'Select a member'}
        </div>
    );
  }

  return (
    <div style={cardStyles}>
        <div style={{...headerStyles, background: 'linear-gradient(135deg, #ffffff 0%, #f0fff0 100%)' }}>
            <div style={logoContainerStyles}>
                <HeartHandshake style={{ color: '#007A3D', height: isPdf ? '24px' : '28px', width: isPdf ? '24px' : '28px' }} />
                <div>
                   <h1 style={orgNameStyles}>
                        <span style={{ color: '#007A3D' }}>HADIYA</span> <span style={{ color: '#D4AF37' }}>–মানবতার উপহার</span>
                   </h1>
                   <p style={subtitleStyles}>
                        {language === 'bn'
                        ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও )'
                        : 'Shahid Liyakot Shriti Songo (Chandgaon)'}
                    </p>
                </div>
            </div>
             <div style={{ width: isPdf ? '50px' : '60px', height: isPdf ? '65px' : '75px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', fontSize: isPdf ? '8px' : '10px', color: '#aaa', textAlign: 'center' }}>
                {language === 'bn' ? 'ছবি' : 'Photo'}
            </div>
        </div>
      
        <div style={bodyStyles}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: isPdf ? '16px' : '1.25rem', fontWeight: 'bold', margin: 0 }}>{member.name}</h2>
                <p style={{ fontSize: isPdf ? '12px' : '0.9rem', color: '#555', margin: '2px 0 0', fontFamily: 'monospace' }}>
                    {member.memberId}
                </p>
            </div>
            <div>
                <div style={detailItemStyles}>
                    <span style={detailLabelStyles}>{language === 'bn' ? 'যোগদানের তারিখ' : 'Join Date'}</span>
                    <span>{member.joinDate ? new Date(member.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US') : 'N/A'}</span>
                </div>
                 <div style={detailItemStyles}>
                    <span style={detailLabelStyles}>{language === 'bn' ? 'ফোন' : 'Phone'}</span>
                    <span>{member.phone || 'N/A'}</span>
                </div>
                 <div style={{ ...detailItemStyles, borderBottom: 'none' }}>
                    <span style={detailLabelStyles}>{language === 'bn' ? 'ঠিকানা' : 'Address'}</span>
                    <span style={{ textAlign: 'right' }}>{member.address || 'N/A'}</span>
                </div>
            </div>
        </div>

        <div style={footerStyles}>
            {member.memberId && <BarcodeDisplay memberId={member.memberId} isPdf={isPdf} />}
        </div>
    </div>
  );
}
