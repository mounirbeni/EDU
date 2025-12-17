import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST: Create a new ticket
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
        const { subject, message } = body;

        if (!subject || !message) {
            return NextResponse.json(
                { error: 'Subject and message are required' },
                { status: 400 }
            );
        }

        const userId = (session.user as any).id;

        const ticket = await prisma.ticket.create({
            data: {
                userId,
                subject,
                status: 'OPEN',
                priority: 'NORMAL',
                TicketMessage: {
                    create: {
                        sender: 'USER',
                        content: message,
                    }
                }
            },
            include: {
                TicketMessage: true
            }
        });

        return NextResponse.json(
            { message: 'Ticket created successfully', ticket },
            { status: 201 }
        );

    } catch (error) {
        console.error('Ticket creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create ticket' },
            { status: 500 }
        );
    }
}

// GET: Fetch user's tickets
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

        const tickets = await prisma.ticket.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                TicketMessage: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        return NextResponse.json({ tickets });

    } catch (error) {
        console.error('Fetch tickets error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tickets' },
            { status: 500 }
        );
    }
}
