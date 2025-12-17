'use client';

import { use, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ShoppingBag, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import Link from 'next/link';

interface Order {
    id: string;
    status: string;
    total: number;
    createdAt: string;
}

export default function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Dictionary
    const dict = {
        overview: {
            title: lang === 'ar' ? 'نظرة عامة' : lang === 'fr' ? 'Aperçu' : 'Overview',
            recentOrders: lang === 'ar' ? 'الطلبات الأخيرة' : lang === 'fr' ? 'Commandes récentes' : 'Recent Orders',
            noOrders: lang === 'ar' ? 'لا توجد طلبات بعد' : lang === 'fr' ? 'Pas encore de commandes' : 'No orders yet',
            browsePackages: lang === 'ar' ? 'تصفح الحزم' : lang === 'fr' ? 'Voir les packs' : 'Browse Packages',
            viewAll: lang === 'ar' ? 'عرض الكل' : lang === 'fr' ? 'Voir tout' : 'View All',
            quickActions: lang === 'ar' ? 'إجراءات سريعة' : lang === 'fr' ? 'Actions rapides' : 'Quick Actions',
            stats: {
                totalOrders: lang === 'ar' ? 'إجمالي الطلبات' : lang === 'fr' ? 'Total des commandes' : 'Total Orders',
                pendingOrders: lang === 'ar' ? 'طلبات معلقة' : lang === 'fr' ? 'Commandes en attente' : 'Pending Orders',
                completedOrders: lang === 'ar' ? 'طلبات مكتملة' : lang === 'fr' ? 'Commandes terminées' : 'Completed Orders',
            }
        },
        status: {
            PENDING: lang === 'ar' ? 'معلق' : lang === 'fr' ? 'En attente' : 'Pending',
            PAID: lang === 'ar' ? 'مدفوع' : lang === 'fr' ? 'Payé' : 'Paid',
            CANCELLED: lang === 'ar' ? 'ملغي' : lang === 'fr' ? 'Annulé' : 'Cancelled',
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                const data = await res.json();
                if (data.orders) {
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        completed: orders.filter(o => o.status === 'PAID').length,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'var(--color-secondary)';
            case 'PENDING': return '#F59E0B';
            case 'CANCELLED': return '#EF4444';
            default: return 'var(--color-text-muted)';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PAID': return CheckCircle;
            case 'PENDING': return Clock;
            case 'CANCELLED': return AlertCircle;
            default: return Clock;
        }
    };

    return (
        <div>
            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <ShoppingBag size={20} color="var(--color-primary)" />
                        <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                            {dict.overview.stats.totalOrders}
                        </span>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                        {stats.total}
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Clock size={20} color="#F59E0B" />
                        <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                            {dict.overview.stats.pendingOrders}
                        </span>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                        {stats.pending}
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <CheckCircle size={20} color="var(--color-secondary)" />
                        <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                            {dict.overview.stats.completedOrders}
                        </span>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                        {stats.completed}
                    </p>
                </div>
            </div>

            {/* Recent Orders */}
            <div style={{
                backgroundColor: 'white',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
                        {dict.overview.recentOrders}
                    </h2>
                    {orders.length > 0 && (
                        <Link
                            href={`/${lang}/dashboard/orders`}
                            style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: '500' }}
                        >
                            {dict.overview.viewAll} →
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                        {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <FileText size={48} color="var(--color-text-muted)" style={{ marginBottom: 'var(--spacing-md)', opacity: 0.5 }} />
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>
                            {dict.overview.noOrders}
                        </p>
                        <Link href={`/${lang}/pricing`} className="btn btn-primary">
                            {dict.overview.browsePackages}
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {orders.slice(0, 5).map((order) => {
                            const StatusIcon = getStatusIcon(order.status);
                            return (
                                <div
                                    key={order.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 'var(--spacing-md)',
                                        backgroundColor: '#F9FAFB',
                                        borderRadius: 'var(--border-radius-md)',
                                        flexWrap: 'wrap',
                                        gap: '12px'
                                    }}
                                >
                                    <div>
                                        <p style={{ fontWeight: '500', fontSize: '15px', marginBottom: '4px' }}>
                                            #{order.id.slice(0, 8)}...
                                        </p>
                                        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                            {new Date(order.createdAt).toLocaleDateString(
                                                lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US'
                                            )}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--color-primary-dark)' }}>
                                            {order.total} MAD
                                        </span>
                                        <span style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            backgroundColor: `${getStatusColor(order.status)}20`,
                                            color: getStatusColor(order.status),
                                            fontSize: '13px',
                                            fontWeight: '500'
                                        }}>
                                            <StatusIcon size={14} />
                                            {dict.status[order.status as keyof typeof dict.status] || order.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
