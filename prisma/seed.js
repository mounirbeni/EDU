const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    try {
        const admin = await prisma.user.upsert({
            where: { email: 'admin@eduplatform.ma' },
            update: {
                role: 'ADMIN', // Ensure role is ADMIN if user exists
                password: hashedPassword,
                isActive: true
            },
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

        console.log('Admin user created/updated:', admin.email);
    } catch (e) {
        console.error('Error creating admin:', e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
