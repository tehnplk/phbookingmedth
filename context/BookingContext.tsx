'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BookingState, Branch, Service, Staff, TimeSlot } from '@/types';

interface BookingContextType {
  bookingState: BookingState;
  setBookingState: React.Dispatch<React.SetStateAction<BookingState>>;
  updateBookingState: (field: keyof BookingState, value: any) => void;
  resetBooking: () => void;
}

const initialBookingState: BookingState = {
  branch: null,
  service: null,
  date: null,
  timeSlot: null,
  staff: null,
  customerName: '',
  customerPhone: ''
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingState, setBookingState] = useState<BookingState>(initialBookingState);

  const updateBookingState = (field: keyof BookingState, value: any) => {
    setBookingState(prev => ({ ...prev, [field]: value }));
  };

  const resetBooking = () => {
    setBookingState(initialBookingState);
  };

  return (
    <BookingContext.Provider value={{ bookingState, setBookingState, updateBookingState, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
