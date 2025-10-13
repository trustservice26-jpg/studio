
"use client";

import { SmartCard } from "../smart-card/smart-card";
import type { Member } from "@/lib/types";
import { HeartHandshake } from "lucide-react";

type PdfDocumentProps = {
    member: Partial<Member>;
    language: 'en' | 'bn';
    isRegistration?: boolean;
};

export function PdfDocument({ member, language, isRegistration = false }: PdfDocumentProps) {
    const cardWidth = '323px'; // 85.6mm at 96 DPI
    const cardHeight = '204px'; // 53.98mm at 96 DPI
    
    if (isRegistration) {
        const registrationDate = member.joinDate ? new Date(member.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US') : '';

        const renderField = (label: string, value: string | undefined) => (
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                <p style={{ margin: 0, fontWeight: 'bold', width: '180px', flexShrink: 0 }}>{label}:</p>
                <p style={{ margin: 0, borderBottom: '1px dotted #888', flexGrow: 1 }}>{value || ''}</p>
            </div>
        );

        return (
            <div style={{ width: '800px', padding: '40px', color: '#000', background: '#fff', fontFamily: 'sans-serif' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #ccc', paddingBottom: '15px' }}>
                    <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold' }}>
                      <span style={{ color: 'hsl(var(--brand-green))' }}>HADIYA</span> <span style={{ color: 'hsl(var(--brand-gold))' }}>– মানবতার উপহার</span>
                    </h1>
                    <p style={{ fontSize: '14px', color: '#555', margin: '5px 0 0 0' }}>
                      {language === 'bn'
                        ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ'
                        : 'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}
                    </p>
                    <h2 style={{ fontSize: '20px', marginTop: '20px', color: '#333' }}>{language === 'bn' ? 'সদস্য নিবন্ধন ফর্ম' : 'Membership Registration Form'}</h2>
                </div>
                
                <div style={{ marginBottom: '30px' }}>
                    {renderField(language === 'bn' ? 'সদস্য আইডি' : 'Member ID', member.memberId)}
                    {renderField(language === 'bn' ? 'পূর্ণ নাম' : 'Full Name', member.name)}
                    {renderField(language === 'bn' ? 'পিতার নাম' : "Father's Name", member.fatherName)}
                    {renderField(language === 'bn' ? 'মাতার নাম' : "Mother's Name", member.motherName)}
                    {renderField(language === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth', member.dob)}
                    {renderField(language === 'bn' ? 'ফোন' : 'Phone', member.phone)}
                    {renderField(language === 'bn' ? 'ইমেইল' : 'Email', member.email)}
                    {renderField(language === 'bn' ? 'এনআইডি / জন্ম সনদ' : 'NID / Birth Cert.', member.nid)}
                    {renderField(language === 'bn' ? 'ঠিকানা' : 'Address', member.address)}
                    {renderField(language === 'bn' ? 'নিবন্ধনের তারিখ' : 'Registration Date', registrationDate)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                    <div style={{ width: '45%' }}>
                        <div style={{ borderTop: '1px solid #000', paddingTop: '5px', textAlign: 'center' }}>
                           {language === 'bn' ? 'আবেদনকারীর স্বাক্ষর' : "Applicant's Signature"}
                        </div>
                    </div>
                    <div style={{ width: '45%' }}>
                        <div style={{ borderTop: '1px solid #000', paddingTop: '5px', textAlign: 'center' }}>
                            {language === 'bn' ? 'অনুমোদনকারী কর্তৃপক্ষের স্বাক্ষর' : "Authorized Signature"}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', gap: '10px', padding: '5px', background: 'white' }}>
            <div id="pdf-card-front" style={{ width: cardWidth, height: cardHeight, flexShrink: 0 }}>
                <SmartCard member={member} side="front" isPdf={true} language={language} />
            </div>
             <div id="pdf-card-back" style={{ width: cardWidth, height: cardHeight, flexShrink: 0 }}>
                <SmartCard member={member} side="back" isPdf={true} language={language} />
            </div>
        </div>
    );
}
