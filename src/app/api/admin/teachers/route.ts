import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch all teachers (users with role USER)
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const teachers = await prisma.user.findMany({
            where: { role: 'USER' },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                educationLevel: true,
                subject: true,
                phone: true,
                city: true,
                institution: true,
                isActive: true,
                createdAt: true,
                _count: {
                    select: { orders: true }
                }
            }
        });

        return NextResponse.json({ teachers });

    } catch (error) {
        console.error('Fetch teachers error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch teachers' },
            { status: 500 }
        );
    }
}
