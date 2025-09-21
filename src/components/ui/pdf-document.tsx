
"use client";

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import type { Member } from "@/lib/types";

type PdfDocumentProps = {
    member: Partial<Member>;
    language: 'en' | 'bn';
    isRegistration: boolean;
};

export function PdfDocument({ member, language, isRegistration }: PdfDocumentProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        const generateQrCode = async () => {
            try {
                const url = await QRCode.toDataURL('https://sevasangathan24.vercel.app', {
                    errorCorrectionLevel: 'H',
                    type: 'image/png',
                    quality: 0.9,
                    margin: 1,
                    color: {
                        dark: '#1976D2', // Smart blue color
                        light: '#FFFFFF'  // White background
                    }
                });
                setQrCodeUrl(url);
            } catch (err) {
                console.error('Failed to generate QR code', err);
            }
        };
        generateQrCode();
    }, []);

    const conditions_en = [
        "ALL members will have to active at any time.",
        "If any member will not active in organization team then he will shown as inactive.",
        "IF any members does not give money for orgnisation or making late more then 3 times then he will be inactive also can make resigned from the organization team.",
        "For adding again as a member he will have to registered for member and also have to give late fine 50 taka for adding again as a member.",
        "If any member make improper behavior then he will have to resigned from organization team.",
        "For late paying he will have to pay 20 taka extra ,which will add in the organization fund otherwise admin can make inactive.",
        "You as a member cannot collect money from other member team if it is proof then he will have to make resigned from the team.",
        "If member collect from outsource then it will have to give proof otherwise it will not exceptable.",
        "If the member give money to other member for the organization team then this risk will taken by that member who collected the money.",
        "Remember ,Never tell a lie , because this organization will growup if all member are as a friend.",
        "Every member will have a chance to talk with organistion team about his idea,so we can growup.",
        "We all are friend and we will support the society and family members also."
      ];
    
      const conditions_bn = [
        "সকল সদস্যকে সর্বদা সক্রিয় থাকতে হবে।",
        "যদি কোনো সদস্য সংগঠনের দলে সক্রিয় না থাকেন তবে তাকে নিষ্ক্রিয় হিসাবে দেখানো হবে।",
        "যদি কোনো সদস্য সংগঠনের জন্য টাকা না দেন বা ৩ বারের বেশি দেরি করেন তবে তাকে নিষ্ক্রিয় করা হবে এবং সংগঠন থেকে পদত্যাগ করানো হতে পারে।",
        "পুনরায় সদস্য হিসাবে যোগদানের জন্য তাকে সদস্য হিসাবে নিবন্ধিত হতে হবে এবং পুনরায় সদস্য হিসাবে যোগদানের জন্য ৫০ টাকা বিলম্ব জরিমানা দিতে হবে।",
        "যদি কোনো সদস্য অশোভন আচরণ করেন তবে তাকে সংগঠন থেকে পদত্যাগ করতে হবে।",
        "বিলম্ব পরিশোধের জন্য তাকে ২০ টাকা অতিরিক্ত দিতে হবে, যা সংগঠনের তহবিলে যোগ হবে, অন্যথায় অ্যাডমিন তাকে নিষ্ক্রিয় করতে পারে।",
        "আপনি সদস্য হিসাবে অন্য কোনো সদস্যের কাছ থেকে টাকা সংগ্রহ করতে পারবেন না, যদি তা প্রমাণিত হয় তবে তাকে দল থেকে পদত্যাগ করতে হবে।",
        "যদি সদস্য বাইরের উৎস থেকে টাকা সংগ্রহ করেন তবে তার প্রমাণ দিতে হবে, অন্যথায় তা গ্রহণযোগ্য হবে না।",
        "যদি কোনো সদস্য সংগঠনের দলের জন্য অন্য সদস্যকে টাকা দেন তবে সেই ঝুঁকি টাকা সংগ্রহকারী সদস্যকে নিতে হবে।",
        "মনে রাখবেন, কখনো মিথ্যা বলবেন না, কারণ এই সংগঠনটি तभी বড় হবে যখন সব সদস্য বন্ধু হিসাবে থাকবে।",
        "প্রত্যেক সদস্যের তার ধারণা সম্পর্কে সংগঠন দলের সাথে কথা বলার সুযোগ থাকবে, যাতে আমরা উন্নতি করতে পারি।",
        "আমরা সবাই বন্ধু এবং আমরা সমাজ ও পরিবারের সদস্যদেরও সমর্থন করব।"
      ];
      
      const conditions = language === 'bn' ? conditions_bn : conditions_en;

    return (
        <div style={{ width: '800px', padding: '40px 0', fontFamily: 'sans-serif', color: '#000', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '2px solid #87CEEB', paddingBottom: '15px' }}>
                <div style={{ textAlign: 'left' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976D2', margin: 0, marginBottom: '8px' }}>{language === 'bn' ? 'সেবা সংগঠন' : 'Seva Sangathan'}</h1>
                    <p style={{ fontSize: '16px', color: '#555', margin: 0, fontWeight: 'bold' }}>{language === 'bn' ? 'শহীদ লিয়াকত স্মৃতি সংঘ-চান্দগাঁও-এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ' : 'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon'}</p>
                </div>
                {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" style={{ width: '90px', height: '90px' }} />}
            </div>
            <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '25px' }}>
                {isRegistration ? (language === 'bn' ? 'সদস্য নিবন্ধন ফর্ম' : 'Member Registration Form') : (language === 'bn' ? 'সদস্যের বিবরণ' : 'Member Details')}
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '25px', justifyContent: 'space-between' }}>
                 <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#333' }}>{member.name}</h3>
                 </div>
                 <div style={{ marginLeft: '25px' }}>
                    <div style={{ width: '130px', height: '160px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
                       <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'center' }}>{language === 'bn' ? 'পাসপোর্ট সাইজের ছবি' : 'Passport Size Photo'}</p>
                    </div>
                 </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', marginBottom: '25px' }}>
                <tbody>
                    {member.joinDate && <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'যোগদানের তারিখ' : 'Joining Date'}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{new Date(member.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}</td></tr>}
                    {member.dob && <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{member.dob}</td></tr>}
                    {member.fatherName && <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'পিতার নাম' : "Father's Name"}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{member.fatherName}</td></tr>}
                    {member.motherName && <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'মাতার নাম' : "Mother's Name"}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{member.motherName}</td></tr>}
                    {member.nid && <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'এনআইডি / জন্ম সনদ' : 'NID / Birth Cert.'}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{member.nid}</td></tr>}
                    {member.phone && <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'ফোন' : 'Phone'}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{member.phone}</td></tr>}
                    {member.email && <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '12px 0', fontWeight: 'bold' }}>{language === 'bn' ? 'ইমেইল' : 'Email'}</td><td style={{ padding: '12px 0', textAlign: 'right' }}>{member.email}</td></tr>}
                    <tr>
                        <td style={{ padding: '12px 0', fontWeight: 'bold', verticalAlign: 'top' }}>{language === 'bn' ? 'ঠিকানা' : 'Address'}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right' }}>
                            {member.address ? <div style={{ minHeight: '50px', whiteSpace: 'pre-wrap' }}>{member.address}</div> : (
                                <>
                                    <div style={{borderBottom: '1px solid #999', height: '25px', marginBottom: '12px'}}></div>
                                    <div style={{borderBottom: '1px solid #999', height: '25px'}}></div>
                                </>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div style={{marginTop: '30px'}}>
                <h3 style={{fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '15px'}}>{language === 'bn' ? 'শর্তাবলী' : 'Conditions'}</h3>
                <ul style={{ listStyleType: 'none', paddingLeft: '0px', fontSize: '13px', color: '#333' }}>
                    {conditions.map((condition, index) => (
                        <li key={index} style={{ marginBottom: '8px', fontWeight: 'bold', textIndent: '-1.2em', paddingLeft: '1.2em' }}>• {condition}</li>
                    ))}
                </ul>
            </div>

            <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '2px dotted #aaa', width: '200px', margin: '30px 0 8px 0' }}></div>
                    <p style={{ fontSize: '14px', color: '#333' }}>{language === 'bn' ? 'সদস্যের স্বাক্ষর' : 'Member Signature'}</p>
                </div>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '2px dotted #aaa', width: '200px', margin: '30px 0 8px 0' }}></div>
                    <p style={{ fontSize: '14px', color: '#333' }}>{language === 'bn' ? 'কর্তৃপক্ষের স্বাক্ষর' : 'Authority Signature'}</p>
                 </div>
            </div>
             <div style={{ marginTop: '30px', fontSize: '12px', color: '#000', textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <p style={{ fontWeight: 'bold' }}>© 2025 Seva Sangathan (community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.) All rights reserved.</p>
                <p style={{ fontWeight: 'bold', fontStyle: 'italic', marginTop: '10px', fontSize: '11px', color: '#000' }}>Developed & Supported by AL-SADEEQ Team.</p>
             </div>
        </div>
    );
}
