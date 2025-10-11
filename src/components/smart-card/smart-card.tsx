
'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import type { Member } from "@/lib/types";
import { useAppContext } from '@/context/app-context';

type SmartCardProps = {
    member: Partial<Member>;
    isPdf?: boolean;
};

const Logo = ({ isPdf = false }: { isPdf?: boolean }) => (
    <svg
        width={isPdf ? "32" : "32"}
        height={isPdf ? "32" : "32"}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fill: "hsl(var(--brand-gold))" }}
    >
        <path d="M50 0 L65.45 22.36 L90.45 22.36 L72.5 36.18 L79.39 59.55 L50 45.73 L20.61 59.55 L27.5 36.18 L9.55 22.36 L34.55 22.36 Z M50 11.2 L40.45 33.4 L17.15 33.4 L34.55 47.22 L27.66 69.5 L50 55.68 L72.34 69.5 L65.45 47.22 L82.85 33.4 L59.55 33.4 Z" />
        <path d="M50 5a45 45 0 1 0 0 90a45 45 0 1 0 0 -90zm0 8a37 37 0 1 1 0 74a37 37 0 1 1 0 -74z" />
        <path d="M54 35c-6.627 0-12 5.373-12 12s5.373 12 12 12c1.73 0 3.37-.365 4.857-1.02A16.993 16.993 0 0 0 50 63c-9.389 0-17-7.611-17-17s7.611-17 17-17c1.768 0 3.456.273 5.03.77A11.94 11.94 0 0 1 54 35zm5.556 12.316l-4.708 2.362 1.776 4.752 3.12-1.565-0.188-5.55z" />
    </svg>
);

export function SmartCard({ member, isPdf = false }: SmartCardProps) {
    const { language } = useAppContext();
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        const generateQrCode = async () => {
            try {
                const url = await QRCode.toDataURL('https://hadiya24.vercel.app', {
                    errorCorrectionLevel: 'H',
                    type: 'image/png',
                    width: 200,
                    margin: 1,
                    color: {
                        dark: '#C9A959', // Gold
                        light: '#0000' // Transparent background
                    }
                });
                setQrCodeUrl(url);
            } catch (err) {
                console.error('Failed to generate QR code', err);
            }
        };
        generateQrCode();
    }, []);
    
    const cardStyles = {
        width: isPdf ? '323px' : '100%',
        height: isPdf ? '204px' : 'auto',
        aspectRatio: '85.6 / 53.98',
        fontFamily: '"PT Sans", sans-serif',
        color: '#000',
        background: 'linear-gradient(135deg, #F8F8F8 0%, #E8F5E9 100%)', // subtle gradient background
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        position: 'relative' as 'relative',
        overflow: 'hidden',
        boxShadow: isPdf ? 'none' : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        border: '1px solid #E0E0E0'
    };

    const InfoField = ({ label, value }: { label: string, value?: string }) => (
        <div>
            <p style={{ fontSize: isPdf ? '6px' : '0.6em', color: '#666', margin: 0, fontWeight: 'bold' }}>{label}</p>
            <p style={{ fontSize: isPdf ? '8px' : '0.75em', color: '#000', margin: 0, fontWeight: 'normal', minHeight: '1em' }}>{value || 'N/A'}</p>
        </div>
    );

    return (
        <div style={cardStyles}>
            {/* Header */}
             <div style={{ padding: '8px', borderBottom: '1px solid hsl(var(--brand-gold))', backgroundColor: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Logo isPdf={isPdf} />
                <div>
                    <h1 style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: isPdf ? '14px' : '1.2em', margin: 0, fontWeight: 'bold', textAlign: 'left' }}>
                        <span style={{ color: 'hsl(var(--brand-green))' }}>HADIYA</span> <span style={{ color: 'hsl(var(--brand-gold))' }}>–মানবতার উপহার</span>
                    </h1>
                    <p style={{ fontSize: isPdf ? '6px' : '0.5em', color: '#555', margin: '2px 0 0 0', textAlign: 'left', lineHeight: '1.2' }}>
                        {language === 'bn' ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ' : 'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}
                    </p>
                </div>
            </div>


            {/* Body */}
            <div style={{ padding: '8px', display: 'flex', flex: 1, gap: '8px' }}>
                 {/* QR Code */}
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" style={{ width: isPdf ? '70px' : '80px', height: isPdf ? '70px' : '80px' }} />}
                </div>


                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10px' }}>
                    <div>
                        <p style={{ fontSize: isPdf ? '16px' : '1.5em', fontWeight: 'bold', margin: '0 0 4px 0', lineHeight: '1.2' }}>{member.name}</p>
                        <p style={{ fontFamily: 'monospace', fontSize: isPdf ? '10px' : '0.9em', color: 'hsl(var(--brand-green))', margin: '0 0 10px 0', backgroundColor: 'hsla(var(--primary), 0.1)', padding: '2px 4px', borderRadius: '3px', display: 'inline-block', fontWeight: 'bold' }}>
                           ID: {member.memberId}
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: isPdf ? '4px' : '8px' }}>
                        <InfoField label={language === 'bn' ? "পিতার নাম" : "Father's Name"} value={member.fatherName} />
                        <InfoField label={language === 'bn' ? "মাতার নাম" : "Mother's Name"} value={member.motherName} />
                        <InfoField label={language === 'bn' ? "ঠিকানা" : "Address"} value={member.address} />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 'auto', fontSize: isPdf ? '5px' : '0.5em', color: '#fff', textAlign: 'center', padding: '3px', background: 'hsl(var(--brand-green))' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{language === 'bn' ? "সদস্য কার্ড" : "MEMBERSHIP CARD"}</p>
            </div>
        </div>
    );
}
