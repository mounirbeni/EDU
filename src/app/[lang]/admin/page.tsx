'use client';

import { use, useEffect, useState } from 'react';
import { ShoppingBag, Users, Clock, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    totalOrders: number;
    pendingOrders: number;
    paidOrders: number;
    totalTeachers: number;
    totalRevenue: number;
    recentOrders: Array<{
        id: string;
        total: number;
        status: string;
        createdAt: string;
        user: { name: string; email: string };
    }>;
}

export default function AdminOverviewPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    // Dictionary
    const dict = {
        overview: {
            title: lang === 'ar' ? 'نظرة عامة' : lang === 'fr' ? 'Aperçu' : 'Overview',
            totalOrders: lang === 'ar' ? 'إجمالي الطلبات' : lang === 'fr' ? 'Total commandes' : 'Total Orders',
            pendingOrders: lang === 'ar' ? 'طلبات معلقة' : lang === 'fr' ? 'En attente' : 'Pending Orders',
            paidOrders: lang === 'ar' ? 'طلبات مدفوعة' : lang === 'fr' ? 'Payées' : 'Paid Orders',
            totalTeachers: lang === 'ar' ? 'المعلمون المسجلون' : lang === 'fr' ? 'Enseignants inscrits' : 'Registered Teachers',
            totalRevenue: lang === 'ar' ? 'إجمالي الإيرادات' : lang === 'fr' ? 'Revenus totaux' : 'Total Revenue',
            recentOrders: lang === 'ar' ? 'الطلبات الأخيرة' : lang === 'fr' ? 'Commandes récentes' : 'Recent Orders',
            viewAll: lang === 'ar' ? 'عرض الكل' : lang === 'fr' ? 'Voir tout' : 'View All',
            noOrders: lang === 'ar' ? 'لا توجد طلبات' : lang === 'fr' ? 'Aucune commande' : 'No orders yet',
        },
        status: {
            PENDING: lang === 'ar' ? 'معلق' : lang === 'fr' ? 'En attente' : 'Pending',
            PAID: lang === 'ar' ? 'مدفوع' : lang === 'fr' ? 'Payé' : 'Paid',
            CANCELLED: lang === 'ar' ? 'ملغي' : lang === 'fr' ? 'Annulé' : 'Cancelled',
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'var(--color-secondary)';
            case 'PENDING': return '#F59E0B';
            case 'CANCELLED': return '#EF4444';
            default: return 'var(--color-text-muted)';
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
            </div>
        );
    }

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
                    borderLeft: '4px solid var(--color-primary)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <ShoppingBag size={20} color="var(--color-primary)" />
                        <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                            {dict.overview.totalOrders}
                        </span>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                        {stats?.totalOrders || 0}
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                    borderLeft: '4px solid #F59E0B'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Clock size={20} color="#F59E0B" />
                        <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                            {dict.overview.pendingOrders}
                        </span>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                        {stats?.pendingOrders || 0}
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                    borderLeft: '4px solid var(--color-secondary)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <TrendingUp size={20} color="var(--color-secondary)" />
                        <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                            {dict.overview.paidOrders}
                        </span>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                        {stats?.paidOrders || 0}
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                    borderLeft: '4px solid #8B5CF6'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Users size={20} color="#8B5CF6" />
                        <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                            {dict.overview.totalTeachers}
                        </span>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                        {stats?.totalTeachers || 0}
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                    borderLeft: '4px solid #10B981',
                    gridColumn: 'span 1'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <DollarSign size={20} color="#10B981" />
                        <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                            {dict.overview.totalRevenue}
                        </span>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                        {stats?.totalRevenue || 0} <span style={{ fontSize: '16px', fontWeight: '400' }}>MAD</span>
                    </p>
                </div>
            </div>

            {/* Pending Orders Alert */}
            {(stats?.pendingOrders || 0) > 0 && (
                <div style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: '#FEF3C7',
                    borderRadius: 'var(--border-radius-md)',
                    marginBottom: 'var(--spacing-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '1px solid #F59E0B'
                }}>
                    <AlertCircle size={20} color="#D97706" />
                    <span style={{ flex: 1 }}>
                        {lang === 'ar' ? `لديك ${stats?.pendingOrders} طلب في انتظار تأكيد الدفع` :
                            lang === 'fr' ? `Vous avez ${stats?.pendingOrders} commande(s) en attente de confirmation` :
                                `You have ${stats?.pendingOrders} order(s) pending payment confirmation`}
                    </span>
                    <Link
                        href={`/${lang}/admin/orders?status=PENDING`}
                        style={{
                            color: '#D97706',
                            fontWeight: '600',
                            fontSize: '14px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {dict.overview.viewAll} →
                    </Link>
                </div>
            )}

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
                    <Link
                        href={`/${lang}/admin/orders`}
                        style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: '500' }}
                    >
                        {dict.overview.viewAll} →
                    </Link>
                </div>

                {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--spacing-lg)' }}>
                        {dict.overview.noOrders}
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {lang === 'ar' ? 'المعلم' : lang === 'fr' ? 'Enseignant' : 'Teacher'}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {lang === 'ar' ? 'المبلغ' : lang === 'fr' ? 'Montant' : 'Amount'}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {lang === 'ar' ? 'الحالة' : lang === 'fr' ? 'Statut' : 'Status'}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {lang === 'ar' ? 'التاريخ' : lang === 'fr' ? 'Date' : 'Date'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.slice(0, 5).map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '16px 12px' }}>
                                            <p style={{ fontWeight: '500', marginBottom: '2px' }}>{order.user.name}</p>
                                            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{order.user.email}</p>
                                        </td>
                                        <td style={{ padding: '16px 12px', fontWeight: '600' }}>
                                            {order.total} MAD
                                        </td>
                                        <td style={{ padding: '16px 12px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                backgroundColor: `${getStatusColor(order.status)}20`,
                                                color: getStatusColor(order.status),
                                                fontSize: '13px',
                                                fontWeight: '500'
                                            }}>
                                                {dict.status[order.status as keyof typeof dict.status] || order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 12px', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                                            {new Date(order.createdAt).toLocaleDateString(
                                                lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
