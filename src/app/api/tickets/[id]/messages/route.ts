import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST: Add a message to a ticket
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id: ticketId } = await params;
        const body = await req.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json(
                { error: 'Message content is required' },
                { status: 400 }
            );
        }

        const userId = (session.user as any).id;
        const userRole = (session.user as any).role;

        // Verify ticket belongs to user (or user is admin)
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId }
        });

        if (!ticket) {
            return NextResponse.json(
                { error: 'Ticket not found' },
                { status: 404 }
            );
        }

        if (ticket.userId !== userId && userRole !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const message = await prisma.ticketMessage.create({
            data: {
                ticketId,
                sender: userRole === 'ADMIN' ? 'ADMIN' : 'USER',
                content,
            }
        });

        // Update ticket status if admin is responding
        if (userRole === 'ADMIN' && ticket.status === 'OPEN') {
            await prisma.ticket.update({
                where: { id: ticketId },
                data: { status: 'IN_PROGRESS' }
            });
        }

        return NextResponse.json(
            { message: 'Message added successfully', ticketMessage: message },
            { status: 201 }
        );

    } catch (error) {
        console.error('Add message error:', error);
        return NextResponse.json(
            { error: 'Failed to add message' },
            { status: 500 }
        );
    }
}
