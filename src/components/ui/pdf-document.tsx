
"use client";

import type { Member } from "@/lib/types";

type PdfDocumentProps = {
    member: Partial<Member>;
    language: 'en' | 'bn';
    isRegistration?: boolean;
    qrCodeUrl?: string;
};

export function PdfDocument({ member, language, isRegistration = false, qrCodeUrl }: PdfDocumentProps) {
    const title = isRegistration 
        ? (language === 'bn' ? 'সদস্য নিবন্ধন ফর্ম' : 'Membership Registration Form') 
        : (language === 'bn' ? 'সদস্যের বিবরণ' : 'Member Details');

    const renderField = (label: string, value: string | undefined | null) => (
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <p style={{ margin: 0, fontSize: '12px', width: '150px' }}>{label}</p>
            <p style={{ margin: 0, fontSize: '12px', textAlign: 'right', flex: 1 }}>{value || ''}</p>
        </div>
    );
    
    const conditionsEn = [
        "All members will have to active at any time.",
        "If any member will not active in organization team then he will shown as inactive.",
        "If any members does not give money for orgnisation or making late more then 3 times then he will be inactive also can make resigned from the organization team.",
        "For adding again as a member he will have to registered for member and also have to give late fine 50 taka for adding again as a member.",
        "If any member make improper behavior then he will have to resigned from organization team.",
        "For late paying he will have to pay 20 taka extra,which will add in the organization fund otherwise admin can make inactive.",
        "You as a member cannot collect money from other member team if it is proof then he will have to make resigned from the team.",
        "If member collect from outsource then it will have to give proof otherwise it will not exceptable.",
        "If the member give money to other member for the organization team then this risk will taken by that member who collected the money.",
        "Remember,Never tell a lie, because this organization will growup if all member are as a friend.",
        "Every member will have a chance to talk with organistion team about his idea,so we can growup.",
        "We all are friend and we will support the society and family members also."
    ];
    
    const conditionsBn = [
        "সকল সদস্যকে সর্বদা সক্রিয় থাকতে হবে।",
        "যদি কোনো সদস্য সাংগঠনিক দলে সক্রিয় না থাকেন, তবে তাকে নিষ্ক্রিয় হিসেবে দেখানো হবে।",
        "যদি কোনো সদস্য সংগঠনের জন্য অর্থ প্রদান না করেন বা ৩ বারের বেশি দেরি করেন, তবে তাকে নিষ্ক্রিয় করা হবে এবং সংগঠন থেকে পদত্যাগ করানো হতে পারে।",
        "পুনরায় সদস্য হিসেবে যোগদানের জন্য তাকে সদস্য হিসেবে নিবন্ধন করতে হবে এবং পুনরায় যোগদানের জন্য ৫০ টাকা বিলম্ব ফি দিতে হবে।",
        "যদি কোনো সদস্য অশোভন আচরণ করেন, তবে তাকে সংগঠন থেকে পদত্যাগ করতে হবে।",
        "বিলম্বিত অর্থ প্রদানের জন্য তাকে ২০ টাকা অতিরিক্ত প্রদান করতে হবে, যা সংগঠনের তহবিলে যোগ হবে, অন্যথায় অ্যাডমিন তাকে নিষ্ক্রিয় করতে পারেন।",
        "সদস্য হিসেবে আপনি অন্য কোনো সদস্য দল থেকে অর্থ সংগ্রহ করতে পারবেন না, যদি এর প্রমাণ পাওয়া যায়, তবে তাকে দল থেকে পদত্যাগ করতে হবে।",
        "যদি সদস্য বাইরের উৎস থেকে অর্থ সংগ্রহ করেন, তবে তার প্রমাণ দিতে হবে, অন্যথায় তা গ্রহণযোগ্য হবে না।",
        "যদি কোনো সদস্য সংগঠনের জন্য অন্য সদস্যকে টাকা দেন, তবে সেই ঝুঁকি টাকা সংগ্রহকারী সদস্যকে বহন করতে হবে।",
        "মনে রাখবেন, কখনো মিথ্যা বলবেন না, কারণ এই সংগঠনটি তখনই বড় হবে যখন সব সদস্য বন্ধুর মতো থাকবে।",
        "প্রত্যেক সদস্যের তার ধারণা সম্পর্কে সংগঠন দলের সাথে কথা বলার সুযোগ থাকবে, যাতে আমরা উন্নতি করতে পারি।",
        "আমরা সবাই বন্ধু এবং আমরা সমাজ এবং পরিবারের সদস্যদেরও সমর্থন করব।"
    ];

    const conditions = language === 'bn' ? conditionsBn : conditionsEn;

    const labels = {
        memberDetails: language === 'bn' ? 'সদস্য বিবরণ' : 'Member Details',
        joiningDate: language === 'bn' ? 'যোগদানের তারিখ' : 'Joining Date',
        dateOfBirth: language === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth',
        fatherName: language === 'bn' ? 'পিতার নাম' : 'Father\'s Name',
        motherName: language === 'bn' ? 'মাতার নাম' : 'Mother\'s Name',
        nid: language === 'bn' ? 'এনআইডি / জন্ম সনদ' : 'NID / Birth Cert.',
        phone: language === 'bn' ? 'ফোন' : 'Phone',
        address: language === 'bn' ? 'ঠিকানা' : 'Address',
        conditions: language === 'bn' ? 'শর্তাবলী' : 'Conditions',
        memberSignature: language === 'bn' ? 'সদস্যের স্বাক্ষর' : 'Member Signature',
        authoritySignature: language === 'bn' ? 'কর্তৃপক্ষের স্বাক্ষর' : 'Authority Signature',
        passportPhoto: language === 'bn' ? 'পাসপোর্ট সাইজ ছবি' : 'Passport Size Photo'
    };

    return (
        <div style={{ width: '800px', padding: '20px 40px', color: '#333', background: '#fff', fontFamily: '"PT Sans", sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '15px' }}>
                <div>
                    <h1 style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: '24px', margin: 0, fontWeight: 'bold' }}>
                      <span style={{ color: 'hsl(var(--brand-green))' }}>HADIYA</span> <span style={{ color: 'hsl(var(--brand-gold))' }}>– মানবতার উপহার</span>
                    </h1>
                    <p style={{ fontSize: '12px', color: '#555', margin: '5px 0 0 0' }}>
                      {'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}
                    </p>
                </div>
                 {qrCodeUrl && (
                    <div style={{ flexShrink: 0 }}>
                        <img src={qrCodeUrl} alt="QR Code" style={{ width: '60px', height: '60px' }} />
                    </div>
                )}
            </div>

             {/* Title */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                 <h2 style={{ fontSize: '20px', color: '#333', fontWeight: 'bold', margin: 0 }}>{labels.memberDetails}</h2>
            </div>
            
            {/* Member Info & Photo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                    <h3 style={{fontSize: '14px', fontWeight: 'bold', margin: 0}}>{member.name}</h3>
                    <p style={{fontSize: '12px', margin: '4px 0 0 0'}}>ID: {member.memberId}</p>
                </div>
                <div style={{
                    width: '100px',
                    height: '120px',
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
                    {labels.passportPhoto}
                </div>
            </div>

             <div style={{width: '100%'}}>
                    {renderField(labels.joiningDate, member.joinDate ? new Date(member.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US') : '')}
                    {renderField(labels.dateOfBirth, member.dob)}
                    {renderField(labels.fatherName, member.fatherName)}
                    {renderField(labels.motherName, member.motherName)}
                    {renderField(labels.nid, member.nid)}
                    {renderField(labels.phone, member.phone)}
                    {renderField(labels.address, member.address)}
                </div>

            {/* Conditions */}
            <div style={{ margin: '30px 0' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', paddingBottom: '5px', marginBottom: '10px' }}>{labels.conditions}</h3>
                <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc', fontSize: '11px', color: '#555', lineHeight: '1.6' }}>
                    {conditions.map((condition, index) => (
                      <li key={index} style={{paddingLeft: '5px', marginBottom: '4px'}}>
                        {condition.replace(/•/g, '').trim()}
                      </li>
                    ))}
                </ul>
            </div>
            
            {/* Signature */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '40px' }}>
                <div style={{ width: '45%', borderTop: '1px dotted #888', paddingTop: '8px', textAlign: 'center', fontSize: '12px' }}>
                   {labels.memberSignature}
                </div>
                <div style={{ width: '45%', borderTop: '1px dotted #888', paddingTop: '8px', textAlign: 'center', fontSize: '12px' }}>
                    {labels.authoritySignature}
                </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '15px', fontSize: '10px', color: '#777' }}>
                 <p style={{ margin: 0 }}>© 2025 <span style={{ fontWeight: 'bold', color: 'hsl(var(--brand-green))' }}>HADIYA</span> <span style={{ fontWeight: 'bold', color: 'hsl(var(--brand-gold))' }}>– মানবতার উপহার</span> (community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.) All rights reserved.</p>
                 <p style={{ fontStyle: 'italic', marginTop: '5px', margin: 0 }}>Developed & Supported by AL-SADEEQ Team.</p>
            </div>
        </div>
    );
}

    