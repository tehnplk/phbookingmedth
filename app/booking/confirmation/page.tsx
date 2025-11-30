'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Confirmation } from '@/components/Confirmation';
import { useBooking } from '@/context/BookingContext';
import { BookingState } from '@/types';

export default function ConfirmationPage() {
  const router = useRouter();
  const { bookingState, updateBookingState } = useBooking();
  // We need to pass the bookingId to the success page, but it's generated here.
  // We can pass it via query param or context. Since context is available, we can add bookingId to context or just pass it in URL.
  // The original code had bookingId state.
  
  useEffect(() => {
    if (!bookingState.staff) {
      router.replace('/booking/staff');
    }
  }, [bookingState.staff, router]);

  const handleConfirm = () => {
    // Generate Fake Booking ID: SS-YYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // 251209
    const random = Math.floor(1000 + Math.random() * 9000);
    const newId = `SS-${dateStr}-${random}`;
    
    // In a real app, we would save the booking here.
    
    router.push(`/booking/success?bookingId=${newId}`);
  };

  if (!bookingState.staff) return null;

  return (
    <Confirmation 
      bookingState={bookingState} 
      onChange={(field, val) => updateBookingState(field as keyof BookingState, val)}
      onConfirm={handleConfirm}
    />
  );
}
