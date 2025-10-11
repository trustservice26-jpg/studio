
'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import type { Member } from "@/lib/types";
import { useAppContext } from '@/context/app-context';

type SmartCardProps = {
    member: Partial<Member>;
    isPdf?: boolean;
};

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
                        dark: '#000000',
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
            <div style={{ padding: '8px', borderBottom: '1px solid hsl(var(--brand-gold))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                <h1 style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: isPdf ? '14px' : '1.2em', margin: 0, fontWeight: 'bold' }}>
                    <span style={{ color: 'hsl(var(--brand-green))' }}>HADIYA</span> <span style={{ color: 'hsl(var(--brand-gold))' }}>–মানবতার উপহার</span>
                </h1>
                <p style={{ fontSize: isPdf ? '5px' : '0.4em', color: '#555', margin: 0, textAlign: 'right', lineHeight: '1.2' }}>
                    Shahid Liyakot Shriti Songo<br/>(Chandgaon)
                </p>
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
