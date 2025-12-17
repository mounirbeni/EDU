import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@eduplatform.ma' },
        update: {},
        create: {
            email: 'admin@eduplatform.ma',
            password: hashedPassword,
            name: 'Platform Admin',
            role: 'ADMIN',
            educationLevel: 'HIGH_SCHOOL',
            subject: 'Administration',
            isActive: true,
        },
    });

    console.log('Admin user created:', admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
