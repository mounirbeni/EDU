import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST: Create a new order
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { bundleTier, total, paymentMethod, paymentReference } = body;

        // Validate required fields
        if (!bundleTier || !total) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Map bundle tier to product (in a real app, you'd look this up)
        // For now, we'll create an order without specific product items
        const userId = (session.user as any).id;

        const order = await prisma.order.create({
            data: {
                userId,
                status: 'PENDING',
                total: parseFloat(total),
                paymentMethod,
                paymentReference,
            },
        });

        return NextResponse.json(
            {
                message: 'Order created successfully',
                order: {
                    id: order.id,
                    status: order.status,
                    total: order.total,
                    createdAt: order.createdAt,
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

// GET: Fetch user's orders
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;

        const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                title: true,
                                price: true,
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({ orders });

    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
