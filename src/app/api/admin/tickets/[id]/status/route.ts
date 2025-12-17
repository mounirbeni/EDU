import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT: Update ticket status
export async function PUT(
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

        const { id: ticketId } = await params;
        const body = await req.json();
        const { status } = body;

        if (!['OPEN', 'IN_PROGRESS', 'CLOSED', 'ARCHIVED'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const ticket = await prisma.ticket.update({
            where: { id: ticketId },
            data: { status }
        });

        return NextResponse.json({
            message: 'Ticket status updated',
            ticket
        });

    } catch (error) {
        console.error('Update ticket status error:', error);
        return NextResponse.json(
            { error: 'Failed to update ticket status' },
            { status: 500 }
        );
    }
}
