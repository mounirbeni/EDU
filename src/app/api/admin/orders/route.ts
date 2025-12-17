import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch all orders for admin
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const where = status ? { status } : {};

        const orders = await prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return NextResponse.json({ orders });

    } catch (error) {
        console.error('Admin orders error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
