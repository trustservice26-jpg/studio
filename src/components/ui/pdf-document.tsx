
"use client";

import { SmartCard } from "../smart-card/smart-card";
import type { Member } from "@/lib/types";

type PdfDocumentProps = {
    member: Partial<Member>;
    language: 'en' | 'bn';
};

export function PdfDocument({ member, language }: PdfDocumentProps) {
    // These dimensions are for rendering off-screen for html2canvas.
    // The actual PDF size is set in the jsPDF constructor.
    const cardWidth = '323px'; // 85.6mm at 96 DPI
    const cardHeight = '204px'; // 53.98mm at 96 DPI

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
