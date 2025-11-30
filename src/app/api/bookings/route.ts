import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema for input validation
const bookingSchema = z.object({
  branchId: z.string().min(1, 'Branch ID is required'),
  serviceId: z.string().min(1, 'Service ID is required'),
  staffId: z.string().min(1, 'Staff ID is required'),
  date: z.string().datetime(), // Expecting ISO string
  time: z.string().min(1, 'Time is required'),
  customerName: z.string().min(1, 'Customer Name is required'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = bookingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { branchId, serviceId, staffId, date, time, customerName, customerPhone } = validation.data;

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        branchId,
        serviceId,
        staffId,
        date: new Date(date), // Convert ISO string to Date object
        time,
        customerName,
        customerPhone,
        status: 'confirmed',
      },
    });

    return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
