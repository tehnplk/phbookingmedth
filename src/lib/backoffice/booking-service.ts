import prisma from "@/lib/prisma";

export type BackofficeBookingListItem = {
  id: string;
  date: Date;
  time: string;
  status: string;
  branchName: string;
  serviceName: string;
  staffName: string;
  customerName: string;
  customerPhone: string;
};

export async function listBookings(): Promise<BackofficeBookingListItem[]> {
  const bookings = await prisma.booking.findMany({
    orderBy: { date: "desc" },
    include: {
      branch: true,
      service: true,
      staff: true,
    },
    take: 100,
  });

  return bookings.map((b) => ({
    id: b.id,
    date: b.date,
    time: b.time,
    status: b.status,
    branchName: b.branch.name,
    serviceName: b.service.name,
    staffName: b.staff.name,
    customerName: b.customerName,
    customerPhone: b.customerPhone,
  }));
}
