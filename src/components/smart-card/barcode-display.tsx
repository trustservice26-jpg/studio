
'use client';

import React from 'react';
import Barcode from 'react-barcode';

interface BarcodeDisplayProps {
  isPdf: boolean;
}

const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({ isPdf }) => {
  // Conditionally render Barcode only on the client-side
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a placeholder or nothing on the server
    return <div style={{ height: isPdf ? '30px' : '40px', width: '100%' }} />;
  }

  return (
    <Barcode
      value="https://hadiya24.vercel.app"
      width={1}
      height={isPdf ? 30 : 40}
      displayValue={false}
      background="transparent"
      lineColor="hsl(var(--brand-gold))"
    />
  );
};

export default BarcodeDisplay;
