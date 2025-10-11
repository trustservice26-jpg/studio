'use client';

import Barcode from 'react-barcode';

interface BarcodeDisplayProps {
  isPdf: boolean;
}

const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({ isPdf }) => {
  return (
    <Barcode
      value="https://hadiya24.vercel.app"
      width={1}
      height={isPdf ? 40 : 50}
      displayValue={false}
      background="transparent"
      lineColor="hsl(var(--brand-gold))"
    />
  );
};

export default BarcodeDisplay;
