

"use client";

import { SmartCard } from "../smart-card/smart-card";
import type { Member } from "@/lib/types";

type PdfDocumentProps = {
    member: Partial<Member>;
    language: 'en' | 'bn';
};

export function PdfDocument({ member, language }: PdfDocumentProps) {
    return (
        <div>
            <div id="pdf-card-front" style={{ width: '323px', height: '204px' /* 85.6mm x 53.98mm at 96dpi */ }}>
                <SmartCard member={member} side="front" isPdf={true} language={language} />
            </div>
             <div id="pdf-card-back" style={{ width: '323px', height: '204px', marginTop: '20px' }}>
                <SmartCard member={member} side="back" isPdf={true} language={language} />
            </div>
        </div>
    );
}
