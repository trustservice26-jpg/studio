

"use client";

import type { Member } from "@/lib/types";

type PdfDocumentProps = {
    member: Partial<Member>;
    language: 'en' | 'bn';
    isRegistration?: boolean;
    qrCodeUrl?: string;
};

export function PdfDocument({ member, language, isRegistration = false, qrCodeUrl }: PdfDocumentProps) {
    const isBangla = language === 'bn';

    const title = isRegistration
        ? (isBangla ? 'সদস্য নিবন্ধন ফর্ম' : 'Membership Registration Form')
        : (isBangla ? 'সদস্যের বিবরণ' : 'Member Details');

    const labels = {
        memberDetails: isBangla ? 'সদস্য বিবরণ' : 'Member Details',
        joiningDate: isBangla ? 'যোগদানের তারিখ' : 'Joining Date',
        dateOfBirth: isBangla ? 'জন্ম তারিখ' : 'Date of Birth',
        fatherName: isBangla ? 'পিতার নাম' : "Father's Name",
        motherName: isBangla ? 'মাতার নাম' : "Mother's Name",
        nid: isBangla ? 'এনআইডি / জন্ম সনদ' : 'NID / Birth Cert.',
        phone: isBangla ? 'ফোন' : 'Phone',
        address: isBangla ? 'ঠিকানা' : 'Address',
        conditions: isBangla ? 'শর্তাবলী' : 'Conditions',
        memberSignature: isBangla ? 'সদস্যের স্বাক্ষর' : 'Member Signature',
        authoritySignature: isBangla ? 'কর্তৃপক্ষের স্বাক্ষর' : 'Authority Signature',
        passportPhoto: isBangla ? 'পাসপোর্ট সাইজ ছবি' : 'Passport Size Photo',
        memberId: isBangla ? 'সদস্য আইডি' : 'Member ID',
        name: isBangla ? 'নাম' : 'Name',
        email: isBangla ? 'ইমেইল' : 'Email',
        quote: isBangla ? 'দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়। — শেখ সাদী' : 'Do not be ashamed of giving a little, for refusing is a greater shame. - Sheikh Saadi'
    };

    const conditionsEn = [
        "All members will have to be active at any time.",
        "If any member is not active in the organization team, they will be shown as inactive.",
        "If any member does not give money for the organization or is late more than 3 times, they will be shown as inactive and can also be resigned from the organization team.",
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

    const conditions = isBangla ? conditionsBn : conditionsEn.map(c => `• ${c}`);
    
    const renderField = (label: string, value: string | undefined | null) => (
        <div style={{ display: 'flex', alignItems: 'center', padding: isBangla ? '6px 0' : '8px 0', borderBottom: '1px solid #eee', width: '100%' }}>
            <p style={{ margin: 0, fontSize: isBangla ? '10px' : '11px', width: isBangla ? '120px' : '140px', fontWeight: 600, textAlign: 'left', flexShrink: 0 }}>{label}:</p>
            <p style={{ margin: 0, fontSize: isBangla ? '10px' : '11px', textAlign: 'left', flex: 1, fontWeight: 600 }}>{value || ''}</p>
        </div>
    );

    return (
        <div style={{ width: '800px', padding: '20px 40px', color: '#333', background: '#fff', fontFamily: isBangla ? '"AdorshoLipi", "SolaimanLipi", sans-serif' : '"PT Sans", sans-serif', fontWeight: 600, display: 'flex', flexDirection: 'column', minHeight: '1123px' }}>
            {/* Header */}
            <div style={{ paddingBottom: '10px', borderBottom: '1px solid hsl(var(--brand-gold))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: isBangla ? '22px' : '26px', margin: 0, fontWeight: 'bold' }}>
                          <span style={{ color: 'hsl(var(--brand-green))' }}>HADIYA</span> <span style={{ color: 'hsl(var(--brand-gold))' }}>- মানবতার উপহার</span>
                        </h1>
                        <p style={{ fontSize: isBangla ? '12px' : '14px', color: '#555', margin: '5px 0 0 0', fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {isBangla
                            ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ'
                            : 'A community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}
                        </p>
                    </div>
                     {qrCodeUrl && (
                        <div style={{ flexShrink: 0 }}>
                            <img src={qrCodeUrl} alt="QR Code" style={{ width: '60px', height: '60px' }} />
                        </div>
                    )}
                </div>
            </div>

             {/* Title */}
            <div style={{ textAlign: 'center', margin: '15px 0' }}>
                 <h2 style={{ fontSize: isBangla ? '16px' : '18px', color: '#333', fontWeight: 'bold', margin: 0, textDecoration: 'underline' }}>{title}</h2>
            </div>
            
            {/* Member Info & Photo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', marginTop: '20px' }}>
                <div style={{width: '70%'}}>
                    <h3 style={{fontSize: isBangla ? '22px' : '26px', fontWeight: 'bold', margin: 0 }}>{member.name}</h3>
                    <p style={{fontSize: isBangla ? '16px' : '20px', margin: '4px 0 0 0' }}>{labels.memberId}: {member.memberId}</p>
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
                    fontSize: isBangla ? '9px' : '10px',
                    color: '#888',
                    padding: '10px'
                }}>
                    {labels.passportPhoto}
                </div>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ width: '48%' }}>
                    {renderField(labels.name, member.name)}
                    {renderField(labels.fatherName, member.fatherName)}
                    {renderField(labels.motherName, member.motherName)}
                    {renderField(labels.joiningDate, member.joinDate ? new Date(member.joinDate).toLocaleDateString(isBangla ? 'bn-BD' : 'en-US') : '')}
                </div>
                <div style={{ width: '48%' }}>
                    {renderField(labels.phone, member.phone)}
                    {renderField(labels.email, member.email)}
                    {renderField(labels.dateOfBirth, member.dob)}
                    {renderField(labels.nid, member.nid)}
                </div>
                 <div style={{ width: '100%', marginTop: isBangla ? '6px' : '8px' }}>
                    {renderField(labels.address, member.address)}
                 </div>
            </div>


            {/* Conditions */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: isBangla ? '12px' : '13px', fontWeight: 'bold', paddingBottom: '5px', marginBottom: '10px', borderBottom: '1px solid #ccc' }}>{labels.conditions}</h3>
                <ul style={{ paddingLeft: '0px', margin: 0, listStyleType: 'none', fontSize: isBangla ? '9px' : '10px', color: '#555', lineHeight: '1.6', fontWeight: 600 }}>
                    {conditions.map((condition, index) => (
                      <li key={index} style={{paddingLeft: '5px', marginBottom: '4px'}}>
                        {condition}
                      </li>
                    ))}
                </ul>
            </div>
            
            {/* Signature */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '60px', marginTop: 'auto' }}>
                <div style={{ width: '45%', borderTop: '1px dotted #888', paddingTop: '8px', textAlign: 'center', fontSize: isBangla ? '10px' : '11px' }}>
                   {labels.memberSignature}
                </div>
                <div style={{ width: '45%', borderTop: '1px dotted #888', paddingTop: '8px', textAlign: 'center', fontSize: isBangla ? '10px' : '11px' }}>
                    {labels.authoritySignature}
                </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '50px', paddingTop: '10px', borderTop: '1px solid #eee', fontSize: isBangla ? '8px' : '9px', color: '#777' }}>
                <p style={{ fontStyle: 'italic', margin: 0, marginBottom: '8px', whiteSpace: 'nowrap' }}>
                  {isBangla
                    ? "দান অল্প হলে লজ্জিত হবেন না, কারণ অভাবীকে ফিরিয়ে দেওয়াই বড় লজ্জার বিষয়। — শেখ সাদী"
                    : "Do not be ashamed of giving a little, for refusing is a greater shame. - Sheikh Saadi"
                  }
                </p>
                 <p style={{ margin: 0 }}>© 2025 <span style={{ fontWeight: 'bold', color: 'hsl(var(--brand-green))' }}>HADIYA</span> <span style={{ fontWeight: 'bold', color: 'hsl(var(--brand-gold))' }}>- মানবতার উপহার</span> (<span style={{whiteSpace: 'nowrap'}}>{isBangla ? 'শহীদ লিয়াকত স্মৃতি সংঘ ( চান্দগাঁও ) -এর অধীনে একটি সম্প্রদায়-চালিত উদ্যোগ' : 'a community-driven initiative under Shahid Liyakot Shriti Songo, Chandgaon.'}</span>) All rights reserved.</p>
                 <p style={{ fontStyle: 'italic', marginTop: '4px', margin: 0 }}>Developed & Supported by AL-SADEEQ Team.</p>
            </div>
        </div>
    );
}
