
'use client';

import { useIsClient } from '@/hooks/use-is-client';
import Barcode from 'react-barcode';

type BarcodeDisplayProps = {
  memberId: string;
  isPdf?: boolean;
};

export function BarcodeDisplay({ memberId, isPdf = false }: BarcodeDisplayProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return <div style={{ height: isPdf ? '25px' : '40px' }} />;
  }

  return (
    <Barcode
      value={memberId}
      format="CODE128"
      width={isPdf ? 1.2 : 1.5}
      height={isPdf ? 25 : 40}
      displayValue={false}
      background="transparent"
      lineColor="#2d3748"
      margin={0}
    />
  );
}
