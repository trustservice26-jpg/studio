
'use client';

import type { Member } from "@/lib/types";
import { useAppContext } from '@/context/app-context';
import { HeartHandshake } from 'lucide-react';
import BarcodeDisplay from './barcode-display';

type SmartCardProps = {
    member: Partial<Member>;
    isPdf?: boolean;
    language?: 'en' | 'bn';
};

const Logo = ({ isPdf = false }: { isPdf?: boolean }) => (
    <HeartHandshake 
        color="#007A3D"
        size={isPdf ? 32 : 32}
    />
);

export function SmartCard({ member, isPdf = false, language: propLanguage }: SmartCardProps) {
    const context = useAppContext();
    const language = propLanguage || context.language;
    
    const cardStyles = {
        width: isPdf ? '323px' : '100%',
        height: isPdf ? '204px' : 'auto',
        aspectRatio: '85.6 / 53.98',
        fontFamily: '"PT Sans", sans-serif',
        color: '#002B15', // Dark Green
        background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(230,245,233,1) 60%, rgba(212,235,217,1) 100%)',
        borderRadius: isPdf ? '11px' : '15px', // Approx 3mm on 85.6mm width
        display: 'flex',
        flexDirection: 'column' as 'column',
        position: 'relative' as 'relative',
        overflow: 'hidden',
        boxShadow: isPdf ? 'none' : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        border: '1px solid #D4AF37'
    };

    const InfoField = ({ label, value }: { label: string, value?: string }) => (
        <div>
            <p style={{ fontSize: isPdf ? '5px' : '0.55em', color: '#00522A', margin: 0, fontWeight: 'bold' }}>{label}</p>
            <p style={{ fontSize: isPdf ? '7px' : '0.7em', color: '#002B15', margin: 0, fontWeight: 'normal', minHeight: '1em' }}>{value || 'N/A'}</p>
        </div>
    );
    
    const formattedJoinDate = member.joinDate ? new Date(member.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

    return (
        <div style={cardStyles}>
            {/* Header */}
             <div style={{ padding: '8px', borderBottom: '1px solid #D4AF37', backgroundColor: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Logo isPdf={isPdf} />
                <div>
                    <h1 style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: isPdf ? '12px' : '1.1em', margin: '0', fontWeight: 'bold', textAlign: 'left', lineHeight: 1 }}>
                        <span style={{ color: '#007A3D' }}>HADIYA</span> <span style={{ color: '#D4AF37', fontFamily: '"Noto Serif Bengali", serif' }}>–মানবতার উপহার</span>
                    </h1>
                    <p style={{ fontSize: isPdf ? '5px' : '0.45em', color: '#00522A', margin: '2px 0 0 0', textAlign: 'left', lineHeight: '1.2' }}>
                        {'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ'}
                    </p>
                    <p style={{ fontFamily: '"PT Sans", sans-serif', fontSize: isPdf ? '8px' : '0.7em', color: '#007A3D', margin: '0', textAlign: 'left', fontWeight: 'normal', textTransform: 'uppercase', marginTop: '6px' }}>
                        MEMBERSHIP SMART CARD
                    </p>
                </div>
            </div>


            {/* Body */}
            <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                    <p style={{ fontSize: isPdf ? '13px' : '1.2em', fontWeight: 'bold', margin: '0 0 4px 0', lineHeight: '1.2', color: '#002B15' }}>{member.name}</p>
                    <p style={{ fontFamily: 'monospace', fontSize: isPdf ? '8px' : '0.8em', color: '#007A3D', margin: '0', backgroundColor: 'rgba(0, 122, 61, 0.1)', padding: '2px 4px', borderRadius: '3px', display: 'inline-block', fontWeight: 'bold' }}>
                       ID: {member.memberId}
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isPdf ? '4px' : '6px' }}>
                    <InfoField label={language === 'bn' ? "মোবাইল নম্বর" : "Mobile Number"} value={member.phone} />
                    <InfoField label={language === 'bn' ? "জন্ম তারিখ" : "Date of Birth"} value={member.dob} />
                    <InfoField label={language === 'bn' ? "যোগদানের তারিখ" : "Join Date"} value={formattedJoinDate} />
                    <InfoField label={language === 'bn' ? 'পিতার নাম' : "Father's Name"} value={member.fatherName} />
                    <InfoField label={language === 'bn' ? 'মাতার নাম' : "Mother's Name"} value={member.motherName} />
                    <InfoField label={language === 'bn' ? 'ঠিকানা' : "Address"} value={member.address} />
                </div>
            </div>

            {/* Footer / Barcode area */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px 8px 4px 8px' }}>
                <BarcodeDisplay isPdf={isPdf} />
            </div>
        </div>
    );
}
