'use client';

import { use, useEffect, useState } from 'react';
import { FileText, Download, Lock, Clock } from 'lucide-react';
import Link from 'next/link';

interface Order {
    id: string;
    status: string;
    total: number;
    createdAt: string;
}

export default function ContentPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Dictionary
    const dict = {
        content: {
            title: lang === 'ar' ? 'المحتوى الخاص بي' : lang === 'fr' ? 'Mon contenu' : 'My Content',
            noContent: lang === 'ar' ? 'لا يوجد محتوى متاح بعد' : lang === 'fr' ? 'Aucun contenu disponible' : 'No content available yet',
            purchaseFirst: lang === 'ar' ? 'قم بشراء حزمة للوصول إلى المحتوى' : lang === 'fr' ? 'Achetez un pack pour accéder au contenu' : 'Purchase a package to access content',
            browsePackages: lang === 'ar' ? 'تصفح الحزم' : lang === 'fr' ? 'Voir les packs' : 'Browse Packages',
            pendingPayment: lang === 'ar' ? 'في انتظار تأكيد الدفع' : lang === 'fr' ? 'En attente de confirmation de paiement' : 'Pending payment confirmation',
            download: lang === 'ar' ? 'تحميل' : lang === 'fr' ? 'Télécharger' : 'Download',
            availableContent: lang === 'ar' ? 'المحتوى المتاح' : lang === 'fr' ? 'Contenu disponible' : 'Available Content',
            locked: lang === 'ar' ? 'مقفل - في انتظار تأكيد الدفع' : lang === 'fr' ? 'Verrouillé - En attente de paiement' : 'Locked - Awaiting payment confirmation',
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

    const paidOrders = orders.filter(o => o.status === 'PAID');
    const pendingOrders = orders.filter(o => o.status === 'PENDING');

    // Mock content items (in a real app, these would come from the database)
    const contentItems = [
        {
            id: '1',
            title: lang === 'ar' ? 'دليل التخطيط التربوي' : lang === 'fr' ? 'Guide de planification pédagogique' : 'Pedagogical Planning Guide',
            type: 'PDF',
            size: '2.4 MB'
        },
        {
            id: '2',
            title: lang === 'ar' ? 'تقنيات إدارة الفصل' : lang === 'fr' ? 'Techniques de gestion de classe' : 'Classroom Management Techniques',
            type: 'PDF',
            size: '1.8 MB'
        },
        {
            id: '3',
            title: lang === 'ar' ? 'جلسة صوتية: التعليم الفعال' : lang === 'fr' ? 'Session audio: Enseignement efficace' : 'Audio Session: Effective Teaching',
            type: 'MP3',
            size: '15.2 MB'
        },
    ];

    return (
        <div>
            <div style={{
                backgroundColor: 'white',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={20} />
                    {dict.content.title}
                </h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                        {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <FileText size={48} color="var(--color-text-muted)" style={{ marginBottom: 'var(--spacing-md)', opacity: 0.5 }} />
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                            {dict.content.noContent}
                        </p>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)', fontSize: '14px' }}>
                            {dict.content.purchaseFirst}
                        </p>
                        <Link href={`/${lang}/pricing`} className="btn btn-primary">
                            {dict.content.browsePackages}
                        </Link>
                    </div>
                ) : (
                    <div>
                        {/* Paid Orders - Available Content */}
                        {paidOrders.length > 0 && (
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: 'var(--spacing-md)', color: 'var(--color-secondary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {dict.content.availableContent}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {contentItems.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: 'var(--spacing-md)',
                                                backgroundColor: 'rgba(104, 211, 145, 0.1)',
                                                borderRadius: 'var(--border-radius-md)',
                                                border: '1px solid rgba(104, 211, 145, 0.3)',
                                                flexWrap: 'wrap',
                                                gap: '12px'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '8px',
                                                    backgroundColor: 'var(--color-secondary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <FileText size={20} color="white" />
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '500', marginBottom: '2px' }}>{item.title}</p>
                                                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                                        {item.type} • {item.size}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
                                            >
                                                <Download size={16} />
                                                {dict.content.download}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pending Orders - Locked Content */}
                        {pendingOrders.length > 0 && paidOrders.length === 0 && (
                            <div>
                                <div style={{
                                    padding: 'var(--spacing-md)',
                                    backgroundColor: '#FEF3C7',
                                    borderRadius: 'var(--border-radius-md)',
                                    marginBottom: 'var(--spacing-lg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <Clock size={20} color="#F59E0B" />
                                    <span style={{ fontSize: '14px' }}>{dict.content.pendingPayment}</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {contentItems.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: 'var(--spacing-md)',
                                                backgroundColor: '#F9FAFB',
                                                borderRadius: 'var(--border-radius-md)',
                                                border: '1px solid var(--color-border)',
                                                opacity: 0.6,
                                                flexWrap: 'wrap',
                                                gap: '12px'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '8px',
                                                    backgroundColor: 'var(--color-text-muted)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <Lock size={20} color="white" />
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '500', marginBottom: '2px' }}>{item.title}</p>
                                                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                                        {item.type} • {item.size}
                                                    </p>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                                {dict.content.locked}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
