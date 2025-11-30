'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StaffSelection } from '@/components/StaffSelection';
import { useBooking } from '@/context/BookingContext';

export default function StaffPage() {
  const router = useRouter();
  const { bookingState, updateBookingState } = useBooking();

  useEffect(() => {
    if (!bookingState.timeSlot) {
      router.replace('/booking/time');
    }
  }, [bookingState.timeSlot, router]);

  if (!bookingState.timeSlot) return null;

  return (
    <StaffSelection 
      serviceId={bookingState.service?.id || ''}
      selectedStaff={bookingState.staff}
      date={bookingState.date || new Date()}
      timeSlot={bookingState.timeSlot}
      onSelect={(staff) => {
        updateBookingState('staff', staff);
        router.push('/booking/confirmation');
      }} 
    />
  );
}
