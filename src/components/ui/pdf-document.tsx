
"use client";

import { SmartCard } from "../smart-card/smart-card";
import type { Member } from "@/lib/types";

type PdfDocumentProps = {
    member: Partial<Member>;
    language: 'en' | 'bn';
    isRegistration?: boolean;
};

export function PdfDocument({ member, language, isRegistration = false }: PdfDocumentProps) {
    const cardWidth = '323px'; // 85.6mm at 96 DPI
    const cardHeight = '204px'; // 53.98mm at 96 DPI
    
    if (isRegistration) {
      // You can create a registration-specific PDF layout here if needed.
      // For now, we'll return a simple placeholder or the member card.
      return (
         <div style={{ width: '800px', padding: '20px', color: '#000', background: '#fff' }}>
            <h1 style={{ textAlign: 'center' }}>Membership Registration</h1>
            <p><strong>Name:</strong> {member.name}</p>
            <p><strong>Member ID:</strong> {member.memberId}</p>
            {/* Add other details as needed */}
        </div>
      );
    }

    return (
        <div>
            <div id="pdf-card-front" style={{ width: cardWidth, height: cardHeight }}>
                <SmartCard member={member} side="front" isPdf={true} language={language} />
            </div>
             <div id="pdf-card-back" style={{ width: cardWidth, height: cardHeight }}>
                <SmartCard member={member} side="back" isPdf={true} language={language} />
            </div>
        </div>
    );
}
