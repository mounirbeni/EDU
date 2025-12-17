'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShoppingBag, Eye, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';

interface Order {
    id: string;
    status: string;
    total: number;
    paymentMethod: string | null;
    paymentReference: string | null;
    createdAt: string;
    confirmedAt: string | null;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export default function AdminOrdersPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const searchParams = useSearchParams();
    const statusFilter = searchParams.get('status');

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [confirming, setConfirming] = useState(false);

    // Dictionary
    const dict = {
        orders: {
            title: lang === 'ar' ? 'إدارة الطلبات' : lang === 'fr' ? 'Gestion des commandes' : 'Order Management',
            noOrders: lang === 'ar' ? 'لا توجد طلبات' : lang === 'fr' ? 'Aucune commande' : 'No orders',
            orderId: lang === 'ar' ? 'رقم الطلب' : lang === 'fr' ? 'N° de commande' : 'Order ID',
            customer: lang === 'ar' ? 'العميل' : lang === 'fr' ? 'Client' : 'Customer',
            amount: lang === 'ar' ? 'المبلغ' : lang === 'fr' ? 'Montant' : 'Amount',
            status: lang === 'ar' ? 'الحالة' : lang === 'fr' ? 'Statut' : 'Status',
            date: lang === 'ar' ? 'التاريخ' : lang === 'fr' ? 'Date' : 'Date',
            actions: lang === 'ar' ? 'الإجراءات' : lang === 'fr' ? 'Actions' : 'Actions',
            paymentMethod: lang === 'ar' ? 'طريقة الدفع' : lang === 'fr' ? 'Mode de paiement' : 'Payment Method',
            reference: lang === 'ar' ? 'المرجع' : lang === 'fr' ? 'Référence' : 'Reference',
            confirmPayment: lang === 'ar' ? 'تأكيد الدفع وتسليم المحتوى' : lang === 'fr' ? 'Confirmer le paiement et livrer' : 'Confirm Payment & Deliver',
            close: lang === 'ar' ? 'إغلاق' : lang === 'fr' ? 'Fermer' : 'Close',
            viewDetails: lang === 'ar' ? 'عرض' : lang === 'fr' ? 'Voir' : 'View',
            all: lang === 'ar' ? 'الكل' : lang === 'fr' ? 'Tous' : 'All',
            confirmedAt: lang === 'ar' ? 'تم التأكيد في' : lang === 'fr' ? 'Confirmé le' : 'Confirmed At',
        },
        status: {
            PENDING: lang === 'ar' ? 'معلق' : lang === 'fr' ? 'En attente' : 'Pending',
            PAID: lang === 'ar' ? 'مدفوع' : lang === 'fr' ? 'Payé' : 'Paid',
            CANCELLED: lang === 'ar' ? 'ملغي' : lang === 'fr' ? 'Annulé' : 'Cancelled',
        },
        paymentMethods: {
            BANK_TRANSFER: lang === 'ar' ? 'تحويل بنكي' : lang === 'fr' ? 'Virement bancaire' : 'Bank Transfer',
            CASHPLUS: lang === 'ar' ? 'كاش بلس' : lang === 'fr' ? 'CashPlus' : 'CashPlus',
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            const url = statusFilter ? `/api/admin/orders?status=${statusFilter}` : '/api/admin/orders';
            const res = await fetch(url);
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

    const handleConfirmPayment = async (orderId: string) => {
        setConfirming(true);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/confirm`, {
                method: 'POST',
            });

            if (res.ok) {
                fetchOrders();
                setSelectedOrder(null);
            }
        } catch (error) {
            console.error('Failed to confirm payment:', error);
        } finally {
            setConfirming(false);
        }
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

    const filteredOrders = statusFilter
        ? orders.filter(o => o.status === statusFilter)
        : orders;

    return (
        <div>
            <div style={{
                backgroundColor: 'white',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShoppingBag size={20} />
                        {dict.orders.title}
                    </h2>

                    {/* Status Filter */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['ALL', 'PENDING', 'PAID', 'CANCELLED'].map((status) => (
                            <a
                                key={status}
                                href={status === 'ALL' ? `/${lang}/admin/orders` : `/${lang}/admin/orders?status=${status}`}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    textDecoration: 'none',
                                    backgroundColor: (status === 'ALL' && !statusFilter) || statusFilter === status
                                        ? 'var(--color-primary)'
                                        : '#F3F4F6',
                                    color: (status === 'ALL' && !statusFilter) || statusFilter === status
                                        ? 'white'
                                        : 'var(--color-text-main)',
                                }}
                            >
                                {status === 'ALL' ? dict.orders.all : dict.status[status as keyof typeof dict.status]}
                            </a>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                        {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                        {dict.orders.noOrders}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.orders.orderId}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.orders.customer}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.orders.amount}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.orders.status}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.orders.date}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.orders.actions}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => {
                                    const StatusIcon = getStatusIcon(order.status);
                                    return (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '16px 12px', fontSize: '14px', fontFamily: 'monospace' }}>
                                                #{order.id.slice(0, 8)}
                                            </td>
                                            <td style={{ padding: '16px 12px' }}>
                                                <p style={{ fontWeight: '500', marginBottom: '2px' }}>{order.user.name}</p>
                                                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{order.user.email}</p>
                                            </td>
                                            <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: '600' }}>
                                                {order.total} MAD
                                            </td>
                                            <td style={{ padding: '16px 12px' }}>
                                                <span style={{
                                                    display: 'inline-flex',
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
                                            </td>
                                            <td style={{ padding: '16px 12px', fontSize: '14px' }}>
                                                {new Date(order.createdAt).toLocaleDateString(
                                                    lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US'
                                                )}
                                            </td>
                                            <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: '1px solid var(--color-border)',
                                                        borderRadius: 'var(--border-radius-md)',
                                                        padding: '6px 12px',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        fontSize: '13px',
                                                        color: 'var(--color-text-main)',
                                                    }}
                                                >
                                                    <Eye size={14} />
                                                    {dict.orders.viewDetails}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: 'var(--spacing-md)'
                    }}
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 'var(--border-radius-lg)',
                            padding: 'var(--spacing-lg)',
                            maxWidth: '500px',
                            width: '100%',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                            <h3 style={{ fontSize: '18px', color: 'var(--color-primary-dark)' }}>
                                Order #{selectedOrder.id.slice(0, 8)}
                            </h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={20} color="var(--color-text-muted)" />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.orders.customer}</span>
                                <div style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
                                    <p style={{ fontWeight: '500' }}>{selectedOrder.user.name}</p>
                                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{selectedOrder.user.email}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.orders.amount}</span>
                                <span style={{ fontWeight: '600' }}>{selectedOrder.total} MAD</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.orders.status}</span>
                                <span style={{ color: getStatusColor(selectedOrder.status), fontWeight: '500' }}>
                                    {dict.status[selectedOrder.status as keyof typeof dict.status] || selectedOrder.status}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.orders.date}</span>
                                <span style={{ fontWeight: '500' }}>
                                    {new Date(selectedOrder.createdAt).toLocaleDateString(
                                        lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US'
                                    )}
                                </span>
                            </div>
                            {selectedOrder.paymentMethod && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>{dict.orders.paymentMethod}</span>
                                    <span style={{ fontWeight: '500' }}>
                                        {dict.paymentMethods[selectedOrder.paymentMethod as keyof typeof dict.paymentMethods] || selectedOrder.paymentMethod}
                                    </span>
                                </div>
                            )}
                            {selectedOrder.paymentReference && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>{dict.orders.reference}</span>
                                    <span style={{ fontWeight: '500', fontFamily: 'monospace' }}>{selectedOrder.paymentReference}</span>
                                </div>
                            )}
                            {selectedOrder.confirmedAt && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>{dict.orders.confirmedAt}</span>
                                    <span style={{ fontWeight: '500' }}>
                                        {new Date(selectedOrder.confirmedAt).toLocaleDateString(
                                            lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US'
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                            >
                                {dict.orders.close}
                            </button>
                            {selectedOrder.status === 'PENDING' && (
                                <button
                                    onClick={() => handleConfirmPayment(selectedOrder.id)}
                                    disabled={confirming}
                                    className="btn btn-primary"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                >
                                    <CheckCircle size={16} />
                                    {confirming ? '...' : dict.orders.confirmPayment}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
