'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BranchSelection } from '@/components/BranchSelection';
import { useBooking } from '@/context/BookingContext';
import { BookingStep } from '@/types';

export default function BranchPage() {
  const router = useRouter();
  const { updateBookingState } = useBooking();

  return (
    <BranchSelection 
      onSelect={(branch) => {
        updateBookingState('branch', branch);
        router.push('/booking/service');
      }}
      onCheckHistory={() => router.push('/my-bookings')}
    />
  );
}
