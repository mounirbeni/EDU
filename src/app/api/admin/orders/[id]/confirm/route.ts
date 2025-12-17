import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST: Confirm payment and deliver content
export const dynamic = 'force-dynamic';
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { id: orderId } = await params;
        const adminId = (session.user as any).id;

        // Update order status to PAID
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'PAID',
                confirmedAt: new Date(),
                confirmedBy: adminId,
                deliveredAt: new Date(),
            }
        });

        // Create admin log entry
        await prisma.adminLog.create({
            data: {
                adminId,
                action: 'CONFIRM_PAYMENT',
                targetId: orderId,
                targetType: 'Order',
                details: `Confirmed payment for order ${orderId}`,
            }
        });

        return NextResponse.json({
            message: 'Payment confirmed and content delivered',
            order,
        });

    } catch (error) {
        console.error('Confirm payment error:', error);
        return NextResponse.json(
            { error: 'Failed to confirm payment' },
            { status: 500 }
        );
    }
}
