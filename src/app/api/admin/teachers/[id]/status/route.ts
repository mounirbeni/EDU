import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT: Update teacher status (activate/suspend)
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

        const { id: teacherId } = await params;
        const body = await req.json();
        const { isActive } = body;

        if (typeof isActive !== 'boolean') {
            return NextResponse.json(
                { error: 'isActive must be a boolean' },
                { status: 400 }
            );
        }

        const adminId = (session.user as any).id;

        const user = await prisma.user.update({
            where: { id: teacherId },
            data: { isActive }
        });

        // Create admin log entry
        await prisma.adminLog.create({
            data: {
                adminId,
                action: isActive ? 'ACTIVATE_USER' : 'SUSPEND_USER',
                targetId: teacherId,
                targetType: 'User',
                details: `${isActive ? 'Activated' : 'Suspended'} user ${user.email}`,
            }
        });

        return NextResponse.json({
            message: isActive ? 'User activated' : 'User suspended',
            user: { id: user.id, isActive: user.isActive }
        });

    } catch (error) {
        console.error('Update teacher status error:', error);
        return NextResponse.json(
            { error: 'Failed to update status' },
            { status: 500 }
        );
    }
}
