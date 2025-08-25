'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export default function AdSlot({
  slotId,
  adSlot,
}: {
  slotId: string;
  adSlot: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Ignore on dev or if blocked
    }
  }, []);

  return (
    <div className="my-6 flex justify-center">
      {/* Replace data-ad-client with your own publisher id, and data-ad-slot with real slot */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        id={slotId}
        ref={ref as any}
      />
    </div>
  );
}
