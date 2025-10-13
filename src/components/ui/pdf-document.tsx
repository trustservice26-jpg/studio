
"use client";

import type { Member } from "@/lib/types";
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

type PdfDocumentProps = {
    member: Partial<Member>;
    language: 'en' | 'bn';
    isRegistration?: boolean;
    qrCodeUrl?: string;
};

export function PdfDocument({ member, language, isRegistration = false, qrCodeUrl }: PdfDocumentProps) {
    const title = isRegistration ? (language === 'bn' ? 'সদস্য নিবন্ধন ফর্ম' : 'Membership Registration Form') : (language === 'bn' ? 'সদস্য তথ্য' : 'Member Details');

    const renderField = (label: string, value: string | undefined | null) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '12px' }}>{label}</p>
            <p style={{ margin: 0, fontSize: '12px', textAlign: 'right' }}>{value || ''}</p>
        </div>
    );

    return (
        <div style={{ width: '800px', padding: '40px', color: '#333', background: '#fff', fontFamily: '"PT Sans", sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
                <div>
                    <h1 style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: '24px', margin: 0, fontWeight: 'bold' }}>
                      <span style={{ color: 'hsl(var(--brand-green))' }}>HADIYA</span> <span style={{ color: 'hsl(var(--brand-gold))' }}>– মানবতার উপহার</span>
                    </h1>
                    <p style={{ fontSize: '12px', color: '#555', margin: '5px 0 0 0' }}>
                      {'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}
                    </p>
                </div>
                {qrCodeUrl && (
                    <img src={qrCodeUrl} alt="QR Code" style={{ width: '60px', height: '60px' }} />
                )}
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', margin: '25px 0' }}>
                 <h2 style={{ fontSize: '20px', color: '#333', fontWeight: 'bold' }}>{title}</h2>
            </div>
            
            {/* Member Info & Photo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{member.name || 'Member Name'}</p>
                    <p style={{ fontSize: '14px', color: '#555', margin: '5px 0 0 0' }}>ID: {member.memberId || 'N/A'}</p>
                </div>
                <div style={{
                    width: '120px',
                    height: '140px',
                    border: '2px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#888',
                    padding: '10px'
                }}>
                    Passport Size Photo
                </div>
            </div>

            {/* Details Table */}
            <div style={{ marginBottom: '30px' }}>
                {renderField(language === 'bn' ? 'যোগদানের তারিখ' : 'Joining Date', member.joinDate ? new Date(member.joinDate).toLocaleDateString('en-US') : '')}
                {renderField(language === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth', member.dob)}
                {renderField(language === 'bn' ? 'পিতার নাম' : "Father's Name", member.fatherName)}
                {renderField(language === 'bn' ? 'মাতার নাম' : "Mother's Name", member.motherName)}
                {renderField(language === 'bn' ? 'এনআইডি / জন্ম সনদ' : 'NID / Birth Cert.', member.nid)}
                {renderField(language === 'bn' ? 'ফোন' : 'Phone', member.phone)}
                {renderField(language === 'bn' ? 'ঠিকানা' : 'Address', member.address)}
            </div>

            {/* Conditions */}
            <div style={{ marginBottom: '50px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>{language === 'bn' ? 'শর্তাবলী' : 'Conditions'}</h3>
                <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: "'• '", fontSize: '11px', color: '#555', lineHeight: '1.6' }}>
                    <li>ALL members will have to to be active at any time.</li>
                    <li>If any member will not active in organization team then he will shown as inactive.</li>
                    <li>IF any members does not give money for orgnisation or making late more then 3 times then he will be inactive also can make resigned from the organization team.</li>
                    <li>For adding again as a member he will have to registered for member and also have to give late fine 50 taka for adding again as a member.</li>
                    <li>If any member make improper behavior then he will have to resigned from organization team.</li>
                    <li>For late paying he will have to pay 20 taka extra,which will add in the organization fund otherwise admin can make inactive.</li>
                    <li>You as a member cannot collect money from other member team if it is proof then he will have to make resigned from the team.</li>
                    <li>If member collect from outsource then it will have to give proof otherwise it will not exceptable.</li>
                    <li>If the member give money to other member for the organization team then this risk will taken by that member who collected the money.</li>
                    <li>Remember,Never tell a lie, because this organization will growup if all member are as a friend.</li>
                    <li>Every member will have a chance to talk with organistion team about his idea,so we can growup.</li>
                    <li>We all are friend and we will support the society and family members also.</li>
                </ul>
            </div>
            
            {/* Signature */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <div style={{ width: '45%', borderTop: '1px dotted #888', paddingTop: '8px', textAlign: 'center', fontSize: '12px' }}>
                   {language === 'bn' ? 'সদস্যের স্বাক্ষর' : 'Member Signature'}
                </div>
                <div style={{ width: '45%', borderTop: '1px dotted #888', paddingTop: '8px', textAlign: 'center', fontSize: '12px' }}>
                    {language === 'bn' ? 'কর্তৃপক্ষের স্বাক্ষর' : 'Authority Signature'}
                </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '15px', borderTop: '1px solid #eee', fontSize: '10px', color: '#777' }}>
                 <p>© 2025 <span style={{ fontWeight: 'bold', color: 'hsl(var(--brand-green))' }}>HADIYA</span> <span style={{ fontWeight: 'bold', color: 'hsl(var(--brand-gold))' }}>– মানবতার উপহার</span> (community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.) All rights reserved.</p>
                 <p style={{ fontStyle: 'italic', marginTop: '5px' }}>Developed & Supported by AL-SADEEQ Team.</p>
            </div>
        </div>
    );
}
