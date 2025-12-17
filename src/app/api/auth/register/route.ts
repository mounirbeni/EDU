import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, educationLevel, subject, phone, city, institution } = body;

        // Validate required fields
        if (!name || !email || !password || !educationLevel || !subject || !phone || !city || !institution) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate password strength (min 8 characters)
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Validate education level
        const validLevels = ['PRIMARY', 'SECONDARY', 'HIGH_SCHOOL'];
        if (!validLevels.includes(educationLevel)) {
            return NextResponse.json(
                { error: 'Invalid education level' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                educationLevel,
                subject,
                phone,
                city,
                institution,
                role: 'USER',
            },
            select: {
                id: true,
                name: true,
                email: true,
                educationLevel: true,
                subject: true,
                phone: true,
                city: true,
                institution: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            {
                message: 'Registration successful',
                user
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed. Please try again.', details: error.message },
            { status: 500 }
        );
    }
}
