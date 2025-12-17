import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch admin dashboard stats
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Get order counts
        const [totalOrders, pendingOrders, paidOrders] = await Promise.all([
            prisma.order.count(),
            prisma.order.count({ where: { status: 'PENDING' } }),
            prisma.order.count({ where: { status: 'PAID' } }),
        ]);

        // Get teacher count (users with role USER)
        const totalTeachers = await prisma.user.count({
            where: { role: 'USER' }
        });

        // Calculate total revenue from paid orders
        const revenueResult = await prisma.order.aggregate({
            where: { status: 'PAID' },
            _sum: { total: true }
        });
        const totalRevenue = revenueResult._sum.total || 0;

        // Get recent orders
        const recentOrders = await prisma.order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return NextResponse.json({
            totalOrders,
            pendingOrders,
            paidOrders,
            totalTeachers,
            totalRevenue,
            recentOrders,
        });

    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
