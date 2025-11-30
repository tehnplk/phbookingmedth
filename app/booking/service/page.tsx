'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceSelection } from '@/components/ServiceSelection';
import { useBooking } from '@/context/BookingContext';

export default function ServicePage() {
  const router = useRouter();
  const { bookingState, updateBookingState } = useBooking();

  useEffect(() => {
    if (!bookingState.branch) {
      router.replace('/booking/branch');
    }
  }, [bookingState.branch, router]);

  if (!bookingState.branch) return null;

  return (
    <ServiceSelection 
      branchId={bookingState.branch.id}
      onSelect={(service) => {
        updateBookingState('service', service);
        router.push('/booking/date');
      }} 
    />
  );
}
