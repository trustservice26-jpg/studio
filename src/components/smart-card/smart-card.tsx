
'use client';

import type { Member } from "@/lib/types";
import { useAppContext } from '@/context/app-context';
import { HeartHandshake } from 'lucide-react';
import dynamic from "next/dynamic";

const BarcodeDisplay = dynamic(() => import('./barcode-display'), {
    ssr: false,
});


type SmartCardProps = {
    member: Partial<Member>;
    isPdf?: boolean;
};

const Logo = ({ isPdf = false }: { isPdf?: boolean }) => (
    <HeartHandshake 
        color="hsl(var(--brand-green))" 
        size={isPdf ? 32 : 32}
    />
);

export function SmartCard({ member, isPdf = false }: SmartCardProps) {
    const { language } = useAppContext();
    
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
    
    const formattedJoinDate = member.joinDate ? new Date(member.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

    return (
        <div style={cardStyles}>
            {/* Header */}
             <div style={{ padding: '8px', borderBottom: '1px solid hsl(var(--brand-gold))', backgroundColor: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Logo isPdf={isPdf} />
                <div>
                    <h1 style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: isPdf ? '14px' : '1.2em', margin: '0 0 8px 0', fontWeight: 'bold', textAlign: 'left' }}>
                        <span style={{ color: 'hsl(var(--brand-green))' }}>HADIYA</span> <span style={{ color: 'hsl(var(--brand-gold))' }}>–মানবতার উপহার</span>
                    </h1>
                    <p style={{ fontSize: isPdf ? '6px' : '0.5em', color: '#555', margin: '2px 0 0 0', textAlign: 'left', lineHeight: '1.2' }}>
                        {'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ'}
                    </p>
                    <p style={{ fontFamily: '"PT Sans", sans-serif', fontSize: isPdf ? '10px' : '0.8em', color: 'hsl(var(--brand-gold))', margin: '0', textAlign: 'left', fontWeight: 'normal', textTransform: 'uppercase', marginTop: '6px' }}>
                        MEMBERSHIP SMART CARD
                    </p>
                </div>
            </div>


            {/* Body */}
            <div style={{ padding: '8px', display: 'flex', flex: 1, gap: '8px' }}>
                 {/* Barcode */}
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '8px' }}>
                    <BarcodeDisplay isPdf={isPdf} />
                </div>


                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10px' }}>
                    <div>
                        <p style={{ fontSize: isPdf ? '16px' : '1.5em', fontWeight: 'bold', margin: '0 0 4px 0', lineHeight: '1.2' }}>{member.name}</p>
                        <p style={{ fontFamily: 'monospace', fontSize: isPdf ? '10px' : '0.9em', color: 'hsl(var(--brand-green))', margin: '0 0 10px 0', backgroundColor: 'hsla(var(--primary), 0.1)', padding: '2px 4px', borderRadius: '3px', display: 'inline-block', fontWeight: 'bold' }}>
                           ID: {member.memberId}
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isPdf ? '2px' : '4px' }}>
                        <InfoField label={language === 'bn' ? "মোবাইল নম্বর" : "Mobile Number"} value={member.phone} />
                        <InfoField label={language === 'bn' ? "জন্ম তারিখ" : "Date of Birth"} value={member.dob} />
                        <InfoField label={language === 'bn' ? "যোগদানের তারিখ" : "Join Date"} value={formattedJoinDate} />
                        <InfoField label={language === 'bn' ? 'পিতার নাম' : "Father's Name"} value={member.fatherName} />
                        <InfoField label={language === 'bn' ? 'মাতার নাম' : "Mother's Name"} value={member.motherName} />
                    </div>
                </div>
            </div>
        </div>
    );
}
