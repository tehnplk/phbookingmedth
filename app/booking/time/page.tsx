'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TimeSelection } from '@/components/TimeSelection';
import { useBooking } from '@/context/BookingContext';

export default function TimePage() {
  const router = useRouter();
  const { bookingState, updateBookingState } = useBooking();

  useEffect(() => {
    if (!bookingState.date) {
      router.replace('/booking/date');
    }
  }, [bookingState.date, router]);

  if (!bookingState.date) return null;

  return (
    <TimeSelection 
      selectedTime={bookingState.timeSlot}
      onSelect={(timeSlot) => {
        updateBookingState('timeSlot', timeSlot);
        router.push('/booking/staff');
      }} 
    />
  );
}
