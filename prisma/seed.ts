import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Check if Alphonso Mango University already exists
  const existingUniversity = await prisma.university.findFirst({
    where: {
      name: 'Alphonso Mango University'
    }
  });

  let alphonsoUniversity;

  if (existingUniversity) {
    // Update if it exists
    alphonsoUniversity = await prisma.university.update({
      where: { id: existingUniversity.id },
      data: {
        location: 'Ratnagiri, Maharashtra, India',
        website: 'https://www.alphonsomangouniversity.edu',
        logoUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1974&auto=format&fit=crop', // Mango image
        description: 'Alphonso Mango University is a premier institution specializing in agricultural sciences with a focus on mango cultivation and research. Established in 1985, our university has been at the forefront of developing sustainable farming practices and innovative techniques for mango production.',
        partnershipBenefits: 'Students from Alphonso Mango University receive exclusive access to internships in agricultural technology companies, research opportunities in our state-of-the-art laboratories, and global exchange programs with leading agricultural institutions worldwide.',
        isPartner: true,
        isVisible: true,
        displayOrder: 1,
      },
    });
  } else {
    // Create if it doesn't exist
    alphonsoUniversity = await prisma.university.create({
      data: {
        name: 'Alphonso Mango University',
        location: 'Ratnagiri, Maharashtra, India',
        website: 'https://www.alphonsomangouniversity.edu',
        logoUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1974&auto=format&fit=crop', // Mango image
        description: 'Alphonso Mango University is a premier institution specializing in agricultural sciences with a focus on mango cultivation and research. Established in 1985, our university has been at the forefront of developing sustainable farming practices and innovative techniques for mango production.',
        partnershipBenefits: 'Students from Alphonso Mango University receive exclusive access to internships in agricultural technology companies, research opportunities in our state-of-the-art laboratories, and global exchange programs with leading agricultural institutions worldwide.',
        isPartner: true,
        isVisible: true,
        displayOrder: 1,
      },
    });
  }

  console.log('Added Alphonso Mango University:', alphonsoUniversity);

  // Add a super admin if none exists
  const adminExists = await prisma.admin.findFirst({
    where: {
      role: 'SUPER_ADMIN',
    },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    });
    console.log('Created super admin:', admin);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
