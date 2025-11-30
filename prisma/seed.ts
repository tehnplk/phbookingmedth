import { PrismaClient } from '@prisma/client';
import { BRANCHES, SERVICES, STAFF_MEMBERS, STAFF_SCHEDULES, SHOP_CONFIG } from '../src/constants';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Seed Branches
  for (const branch of BRANCHES) {
    await prisma.branch.upsert({
      where: { id: branch.id },
      update: {},
      create: {
        id: branch.id,
        name: branch.name,
        location: branch.location,
        image: branch.image,
        availableServices: JSON.stringify(branch.availableServices),
      },
    });
  }
  console.log('Seeded Branches');

  // Seed Services
  for (const service of SERVICES) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: {
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        image: service.image,
      },
    });
  }
  console.log('Seeded Services');

  // Seed Staff
  for (const staff of STAFF_MEMBERS) {
    await prisma.staff.upsert({
      where: { id: staff.id },
      update: {},
      create: {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        image: staff.image,
        specialty: JSON.stringify(staff.specialty),
      },
    });
  }
  console.log('Seeded Staff');

  // Seed StaffSchedule
  for (const key in STAFF_SCHEDULES) {
    const schedule = STAFF_SCHEDULES[key];
    await prisma.staffSchedule.upsert({
      where: { staffId: schedule.staffId },
      update: {},
      create: {
        staffId: schedule.staffId,
        offDays: JSON.stringify(schedule.offDays),
        busySlots: JSON.stringify(schedule.busySlots),
      },
    });
  }
  console.log('Seeded StaffSchedule');

  // Seed ShopConfig
  await prisma.shopConfig.upsert({
    where: { id: 'default-config' },
    update: {},
    create: {
      id: 'default-config',
      openTime: SHOP_CONFIG.openTime,
      closeTime: SHOP_CONFIG.closeTime,
      holidays: JSON.stringify(SHOP_CONFIG.holidays),
      slotInterval: SHOP_CONFIG.slotInterval,
    },
  });
  console.log('Seeded ShopConfig');

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
