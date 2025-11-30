'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SuccessScreen } from '@/components/SuccessScreen';
import { useBooking } from '@/context/BookingContext';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId') || '';
  const { resetBooking } = useBooking();

  useEffect(() => {
    // Reset booking state when reaching success page, or maybe after leaving it?
    // If we reset immediately, the user might want to see details if we displayed them from context.
    // But SuccessScreen usually just shows the ID.
    // Let's reset when unmounting or just keep it for now.
    // Actually, usually we reset so if they go back to start, it's clean.
    return () => {
        resetBooking();
    };
  }, [resetBooking]);

  return <SuccessScreen bookingId={bookingId} />;
}
