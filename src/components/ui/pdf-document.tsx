
"use client";

import { SmartCard } from "../smart-card/smart-card";
import type { Member } from "@/lib/types";
import QRCode from 'qrcode';
import { useEffect, useState } from "react";

type PdfDocumentProps = {
    member: Partial<Member>;
    language: 'en' | 'bn';
    isRegistration?: boolean;
};

export function PdfDocument({ member, language, isRegistration = false }: PdfDocumentProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const cardWidth = '323px'; // 85.6mm at 96 DPI
    const cardHeight = '204px'; // 53.98mm at 96 DPI
    
    useEffect(() => {
        if (!isRegistration || !member) return;

        const generateQrCode = async () => {
            const qrData = `Member ID: ${member.memberId}\nName: ${member.name}\nPhone: ${member.phone}\nJoin Date: ${member.joinDate ? new Date(member.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US') : ''}\nStatus: ${member.status}\nDOB: ${member.dob}\nFather's Name: ${member.fatherName}\nNID/Birth No: ${member.nid}\nAddress: ${member.address}`;
            try {
                const url = await QRCode.toDataURL(qrData, {
                    errorCorrectionLevel: 'H',
                    type: 'image/png',
                    margin: 1,
                    width: 150,
                });
                setQrCodeUrl(url);
            } catch (err) {
                console.error('Failed to generate QR code for registration PDF', err);
            }
        };
        generateQrCode();
    }, [isRegistration, member, language]);

    if (isRegistration) {
        const registrationDate = member.joinDate ? new Date(member.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US') : '';

        const renderField = (label: string, value: string | undefined) => (
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                <p style={{ margin: 0, fontWeight: 'bold', width: '180px', flexShrink: 0, fontSize: '12px' }}>{label}:</p>
                <p style={{ margin: 0, borderBottom: '1px dotted #888', flexGrow: 1, fontSize: '12px', paddingBottom: '2px' }}>{value || ''}</p>
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
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '65%' }}>
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
                    <div style={{ width: '30%', textAlign: 'center' }}>
                        {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" style={{ width: '150px', height: '150px', margin: '0 auto 10px' }} />}
                        <p style={{ fontSize: '10px', color: '#555', margin: 0 }}>Scan for member details</p>
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>{language === 'bn' ? 'শর্তাবলী' : 'Conditions'}</h3>
                    <div style={{ fontSize: '10px', color: '#555' }}>
                        {language === 'bn' ? (
                            <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                                <li>সকল সদস্যকে সর্বদা সক্রিয় থাকতে হবে।</li>
                                <li>যদি কোনো সদস্য সংগঠনে সক্রিয় না থাকেন, তবে তাকে নিষ্ক্রিয় হিসেবে দেখানো হবে।</li>
                                <li>যদি কোনো সদস্য সংগঠনের জন্য অর্থ প্রদান না করেন বা ৩ বারের বেশি দেরি করেন, তবে তাকে নিষ্ক্রিয় করা হবে এবং সংগঠন থেকে পদত্যাগ করানো হতে পারে। পুনরায় সদস্য হওয়ার জন্য তাকে আবার নিবন্ধন করতে হবে এবং পুনরায় যোগদানের জন্য ৫০ টাকা বিলম্ব জরিমানা দিতে হবে।</li>
                                <li>যদি কোনো সদস্য অশোভন আচরণ করেন, তবে তাকে সংগঠন থেকে পদত্যাগ করতে হবে।</li>
                                <li>বিলম্বিত অর্থ প্রদানের জন্য তাকে ২০ টাকা অতিরিক্ত প্রদান করতে হবে, যা সংগঠনের তহবিলে যোগ হবে, অন্যথায় অ্যাডমিন তাকে নিষ্ক্রিয় করতে পারেন।</li>
                                <li>সদস্য হিসেবে আপনি অন্য সদস্য দল থেকে অর্থ সংগ্রহ করতে পারবেন না, যদি তা প্রমাণিত হয় তবে তাকে দল থেকে পদত্যাগ করতে হবে।</li>
                                <li>যদি সদস্য বাইরের উৎস থেকে অর্থ সংগ্রহ করেন, তবে তার প্রমাণ দিতে হবে, অন্যথায় তা গ্রহণযোগ্য হবে না।</li>
                                <li>যদি সদস্য সংগঠনের জন্য অন্য সদস্যকে অর্থ প্রদান করেন, তবে সেই ঝুঁকি অর্থ সংগ্রহকারী সদস্যকে বহন করতে হবে।</li>
                                <li>মনে রাখবেন, কখনো মিথ্যা বলবেন না, কারণ সকল সদস্য বন্ধু হিসেবে থাকলে এই সংগঠনটি বড় হবে।</li>
                                <li>প্রত্যেক সদস্যের তার ধারণা সম্পর্কে সংগঠন দলের সাথে কথা বলার সুযোগ থাকবে, যাতে আমরা উন্নতি করতে পারি।</li>
                                <li>আমরা সবাই বন্ধু এবং আমরা সমাজ এবং পরিবারের সদস্যদেরও সমর্থন করব।</li>
                            </ul>
                        ) : (
                            <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc', lineHeight: '1.4' }}>
                                <li>All members will have to be active at any time. If any member will not be active in the organization team then he will be shown as inactive.</li>
                                <li>If any member does not give money for the organization or is late more than 3 times then he will be inactive and can also be made to resign from the organization team. For adding again as a member he will have to register for member and also have to give a late fine of 50 taka for adding again as a member.</li>
                                <li>If any member make improper behavior then he will have to resign from the organization team.</li>
                                <li>For late paying he will have to pay 20 taka extra, which will be added to the organization fund, otherwise admin can make him inactive.</li>
                                <li>You as a member cannot collect money from other member team if it is proven then he will have to be made to resign from the team.</li>
                                <li>If a member collects from an outsource then it will have to be given proof otherwise it will not be acceptable.</li>
                                <li>If the member gives money to another member for the organization team then this risk will be taken by that member who collected the money.</li>
                                <li>Remember, Never tell a lie, because this organization will grow up if all members are as friends.</li>
                                <li>Every member will have a chance to talk with the organization team about his idea, so we can grow up.</li>
                                <li>We all are friends and we will support the society and family members also.</li>
                            </ul>
                        )}
                    </div>
                </div>


                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                    <div style={{ width: '45%' }}>
                        <div style={{ borderTop: '1px solid #000', paddingTop: '5px', textAlign: 'center', fontSize: '12px' }}>
                           {language === 'bn' ? 'আবেদনকারীর স্বাক্ষর' : "Applicant's Signature"}
                        </div>
                    </div>
                    <div style={{ width: '45%' }}>
                        <div style={{ borderTop: '1px solid #000', paddingTop: '5px', textAlign: 'center', fontSize: '12px' }}>
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
