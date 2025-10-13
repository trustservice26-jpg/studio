
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

    const labels = {
        memberDetails: language === 'bn' ? 'সদস্য বিবরণ' : 'Member Details',
        joiningDate: language === 'bn' ? 'যোগদানের তারিখ' : 'Joining Date',
        dateOfBirth: language === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth',
        fatherName: language === 'bn' ? 'পিতার নাম' : "Father's Name",
        motherName: language === 'bn' ? 'মাতার নাম' : "Mother's Name",
        nid: language === 'bn' ? 'এনআইডি / জন্ম সনদ' : 'NID / Birth Cert.',
        phone: language === 'bn' ? 'ফোন' : 'Phone',
        address: language === 'bn' ? 'ঠিকানা' : 'Address',
        conditions: language === 'bn' ? 'শর্তাবলী' : 'Conditions',
        memberSignature: language === 'bn' ? 'সদস্যের স্বাক্ষর' : 'Member Signature',
        authoritySignature: language === 'bn' ? 'কর্তৃপক্ষের স্বাক্ষর' : 'Authority Signature',
        passportPhoto: language === 'bn' ? 'পাসপোর্ট সাইজ ছবি' : 'Passport Size Photo'
    };

    const conditionsEn = [
        "All members will have to be active at any time.",
        "If any member is not active in the organization team, they will be shown as inactive.",
        "If any member does not give money for the organization or is late more than 3 times, they will be made inactive and can also be resigned from the organization team.",
        "To be added again as a member, they will have to register for membership and also have to pay a late fine of 50 taka.",
        "If any member exhibits improper behavior, they will have to resign from the organization team.",
        "For late payment, they will have to pay 20 taka extra, which will be added to the organization fund, otherwise the admin can make them inactive.",
        "As a member, you cannot collect money from other member teams. If this is proven, they will have to be resigned from the team.",
        "If a member collects from an outsource, they will have to provide proof, otherwise it will not be acceptable.",
        "If a member gives money to another member for the organization team, then this risk will be taken by the member who collected the money.",
        "Remember, never tell a lie, because this organization will grow if all members are like friends.",
        "Every member will have a chance to talk with the organization team about their ideas, so we can grow.",
        "We are all friends and we will support the society and family members also."
    ];
    
    const conditionsBn = [
        "• সকল সদস্যকে সর্বদা সক্রিয় থাকতে হবে।",
        "• যদি কোনো সদস্য সাংগঠনিক দলে সক্রিয় না থাকেন, তবে তাকে নিষ্ক্রিয় হিসেবে দেখানো হবে।",
        "• যদি কোনো সদস্য সংগঠনের জন্য অর্থ প্রদান না করেন বা ৩ বারের বেশি দেরি করেন, তবে তাকে নিষ্ক্রিয় করা হবে এবং সংগঠন থেকে পদত্যাগ করানো হতে পারে।",
        "• পুনরায় সদস্য হিসেবে যোগদানের জন্য তাকে সদস্য হিসেবে নিবন্ধন করতে হবে এবং পুনরায় যোগদানের জন্য ৫০ টাকা বিলম্ব ফি দিতে হবে।",
        "• যদি কোনো সদস্য অশোভন আচরণ করেন, তবে তাকে সংগঠন থেকে পদত্যাগ করতে হবে।",
        "• বিলম্বিত অর্থ প্রদানের জন্য তাকে ২০ টাকা অতিরিক্ত প্রদান করতে হবে, যা সংগঠনের তহবিলে যোগ হবে, অন্যথায় অ্যাডমিন তাকে নিষ্ক্রিয় করতে পারেন।",
        "• সদস্য হিসেবে আপনি অন্য কোনো সদস্য দল থেকে অর্থ সংগ্রহ করতে পারবেন না, যদি এর প্রমাণ পাওয়া যায়, তবে তাকে দল থেকে পদত্যাগ করতে হবে।",
        "• যদি সদস্য বাইরের উৎস থেকে অর্থ সংগ্রহ করেন, তবে তার প্রমাণ দিতে হবে, অন্যথায় তা গ্রহণযোগ্য হবে না।",
        "• যদি কোনো সদস্য সংগঠনের জন্য অন্য সদস্যকে টাকা দেন, তবে সেই ঝুঁকি টাকা সংগ্রহকারী সদস্যকে বহন করতে হবে।",
        "• মনে রাখবেন, কখনো মিথ্যা বলবেন না, কারণ এই সংগঠনটি তখনই বড় হবে যখন সব সদস্য বন্ধুর মতো থাকবে।",
        "• প্রত্যেক সদস্যের তার ধারণা সম্পর্কে সংগঠন দলের সাথে কথা বলার সুযোগ থাকবে, যাতে আমরা উন্নতি করতে পারি।",
        "• আমরা সবাই বন্ধু এবং আমরা সমাজ এবং পরিবারের সদস্যদেরও সমর্থন করব।"
    ];

    const conditions = language === 'bn' ? conditionsBn : conditionsEn.map(c => `• ${c}`);
    
    const renderField = (label: string, value: string | undefined | null) => (
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee', width: '100%' }}>
            <p style={{ margin: 0, fontSize: '12px', width: '150px', fontWeight: 600, textAlign: 'left', flexShrink: 0 }}>{label}:</p>
            <p style={{ margin: 0, fontSize: '12px', textAlign: 'left', flex: 1, fontWeight: 600 }}>{value || ''}</p>
        </div>
    );

    return (
        <div style={{ width: '800px', padding: '20px 40px', color: '#333', background: '#fff', fontFamily: '"PT Sans", sans-serif', fontWeight: 600 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '15px', borderBottom: '2px solid hsl(var(--brand-gold))' }}>
                <div>
                    <h1 style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: '32px', margin: 0, fontWeight: 'bold' }}>
                      <span style={{ color: 'hsl(var(--brand-green))' }}>HADIYA</span> <span style={{ color: 'hsl(var(--brand-gold))' }}>– মানবতার উপহার</span>
                    </h1>
                    <p style={{ fontSize: '16px', color: '#555', margin: '5px 0 0 0', fontWeight: 500 }}>
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
                 <h2 style={{ fontSize: '20px', color: '#333', fontWeight: 'bold', margin: 0, textDecoration: 'underline' }}>{title}</h2>
            </div>
            
            {/* Member Info & Photo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', marginTop: '30px' }}>
                <div style={{width: '70%'}}>
                    <h3 style={{fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{member.name}</h3>
                    <p style={{fontSize: '18px', margin: '4px 0 0 0' }}>ID: {member.memberId}</p>
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
                    fontSize: '10px',
                    color: '#888',
                    padding: '10px'
                }}>
                    {labels.passportPhoto}
                </div>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ width: '48%' }}>
                    {renderField(labels.joiningDate, member.joinDate ? new Date(member.joinDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US') : '')}
                    {renderField(labels.fatherName, member.fatherName)}
                    {renderField(labels.nid, member.nid)}
                    {renderField(labels.phone, member.phone)}
                </div>
                <div style={{ width: '48%' }}>
                    {renderField(labels.dateOfBirth, member.dob)}
                    {renderField(labels.motherName, member.motherName)}
                    {renderField(labels.address, member.address)}
                </div>
            </div>


            {/* Conditions */}
            <div style={{ margin: '50px 0 30px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', paddingBottom: '5px', marginBottom: '10px', borderBottom: '1px solid #ccc' }}>{labels.conditions}</h3>
                <ul style={{ paddingLeft: '0px', margin: 0, listStyleType: 'none', fontSize: '11px', color: '#555', lineHeight: '1.6', fontWeight: 600 }}>
                    {conditions.map((condition, index) => (
                      <li key={index} style={{paddingLeft: '5px', marginBottom: '4px'}}>
                        {condition}
                      </li>
                    ))}
                </ul>
            </div>
            
            {/* Signature */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '100px', marginTop: 'auto' }}>
                <div style={{ width: '45%', borderTop: '1px dotted #888', paddingTop: '8px', textAlign: 'center', fontSize: '12px' }}>
                   {labels.memberSignature}
                </div>
                <div style={{ width: '45%', borderTop: '1px dotted #888', paddingTop: '8px', textAlign: 'center', fontSize: '12px' }}>
                    {labels.authoritySignature}
                </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '60px', paddingTop: '15px', borderTop: '1px solid #eee', fontSize: '10px', color: '#777' }}>
                 <p style={{ margin: 0 }}>© 2025 <span style={{ fontWeight: 'bold', color: 'hsl(var(--brand-green))' }}>HADIYA</span> <span style={{ fontWeight: 'bold', color: 'hsl(var(--brand-gold))' }}>– মানবতার উপহার</span> (community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.) All rights reserved.</p>
                 <p style={{ fontStyle: 'italic', marginTop: '5px', margin: 0 }}>Developed & Supported by AL-SADEEQ Team.</p>
            </div>
        </div>
    );
}
