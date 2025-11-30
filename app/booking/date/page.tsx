'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DateSelection } from '@/components/DateSelection';
import { useBooking } from '@/context/BookingContext';

export default function DatePage() {
  const router = useRouter();
  const { bookingState, updateBookingState } = useBooking();

  useEffect(() => {
    if (!bookingState.service) {
      router.replace('/booking/service');
    }
  }, [bookingState.service, router]);

  if (!bookingState.service) return null;

  return (
    <DateSelection 
      selectedDate={bookingState.date}
      onSelect={(date) => {
        updateBookingState('date', date);
        router.push('/booking/time');
      }} 
    />
  );
}
