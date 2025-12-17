'use client';

import { use, useEffect, useState } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Send, X } from 'lucide-react';

interface Ticket {
    id: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    TicketMessage: {
        id: string;
        sender: string;
        content: string;
        createdAt: string;
    }[];
}

export default function AdminSupportPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Dictionary
    const dict = {
        support: {
            title: lang === 'ar' ? 'إدارة الدعم' : lang === 'fr' ? 'Gestion du support' : 'Support Management',
            noTickets: lang === 'ar' ? 'لا توجد تذاكر' : lang === 'fr' ? 'Aucun ticket' : 'No tickets',
            customer: lang === 'ar' ? 'العميل' : lang === 'fr' ? 'Client' : 'Customer',
            subject: lang === 'ar' ? 'الموضوع' : lang === 'fr' ? 'Sujet' : 'Subject',
            status: lang === 'ar' ? 'الحالة' : lang === 'fr' ? 'Statut' : 'Status',
            date: lang === 'ar' ? 'التاريخ' : lang === 'fr' ? 'Date' : 'Date',
            replyPlaceholder: lang === 'ar' ? 'اكتب ردك...' : lang === 'fr' ? 'Écrivez votre réponse...' : 'Write your reply...',
            user: lang === 'ar' ? 'المستخدم' : lang === 'fr' ? 'Utilisateur' : 'User',
            admin: lang === 'ar' ? 'أنت' : lang === 'fr' ? 'Vous' : 'You',
            back: lang === 'ar' ? 'رجوع' : lang === 'fr' ? 'Retour' : 'Back',
            closeTicket: lang === 'ar' ? 'إغلاق التذكرة' : lang === 'fr' ? 'Fermer le ticket' : 'Close Ticket',
        },
        status: {
            OPEN: lang === 'ar' ? 'مفتوح' : lang === 'fr' ? 'Ouvert' : 'Open',
            IN_PROGRESS: lang === 'ar' ? 'قيد المعالجة' : lang === 'fr' ? 'En cours' : 'In Progress',
            CLOSED: lang === 'ar' ? 'مغلق' : lang === 'fr' ? 'Fermé' : 'Closed',
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch('/api/admin/tickets');
            const data = await res.json();
            if (data.tickets) {
                setTickets(data.tickets);
            }
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim() || !selectedTicket) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: replyMessage }),
            });

            if (res.ok) {
                setReplyMessage('');
                fetchTickets();
                // Refresh selected ticket
                const ticketRes = await fetch('/api/admin/tickets');
                const data = await ticketRes.json();
                if (data.tickets) {
                    setTickets(data.tickets);
                    const updated = data.tickets.find((t: Ticket) => t.id === selectedTicket.id);
                    if (updated) setSelectedTicket(updated);
                }
            }
        } catch (error) {
            console.error('Failed to send reply:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseTicket = async (ticketId: string) => {
        try {
            await fetch(`/api/admin/tickets/${ticketId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CLOSED' }),
            });
            fetchTickets();
            setSelectedTicket(null);
        } catch (error) {
            console.error('Failed to close ticket:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return '#3B82F6';
            case 'IN_PROGRESS': return '#F59E0B';
            case 'CLOSED': return 'var(--color-secondary)';
            default: return 'var(--color-text-muted)';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'OPEN': return AlertCircle;
            case 'IN_PROGRESS': return Clock;
            case 'CLOSED': return CheckCircle;
            default: return Clock;
        }
    };

    if (selectedTicket) {
        return (
            <div style={{
                backgroundColor: 'white',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden'
            }}>
                {/* Ticket Header */}
                <div style={{
                    padding: 'var(--spacing-lg)',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-md)'
                }}>
                    <div>
                        <button
                            onClick={() => setSelectedTicket(null)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                marginBottom: '8px',
                                padding: 0
                            }}
                        >
                            ← {dict.support.back}
                        </button>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
                            {selectedTicket.subject}
                        </h2>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                            {selectedTicket.user.name} ({selectedTicket.user.email})
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            backgroundColor: `${getStatusColor(selectedTicket.status)}20`,
                            color: getStatusColor(selectedTicket.status),
                            fontSize: '13px',
                            fontWeight: '500'
                        }}>
                            {dict.status[selectedTicket.status as keyof typeof dict.status] || selectedTicket.status}
                        </span>
                        {selectedTicket.status !== 'CLOSED' && (
                            <button
                                onClick={() => handleCloseTicket(selectedTicket.id)}
                                className="btn btn-secondary"
                                style={{ fontSize: '13px', padding: '6px 12px' }}
                            >
                                {dict.support.closeTicket}
                            </button>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div style={{
                    padding: 'var(--spacing-lg)',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-md)'
                }}>
                    {selectedTicket.TicketMessage.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                alignSelf: msg.sender === 'ADMIN' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%'
                            }}
                        >
                            <div style={{
                                padding: 'var(--spacing-md)',
                                borderRadius: 'var(--border-radius-md)',
                                backgroundColor: msg.sender === 'ADMIN' ? 'var(--color-primary)' : '#F3F4F6',
                                color: msg.sender === 'ADMIN' ? 'white' : 'var(--color-text-main)'
                            }}>
                                <p style={{ marginBottom: '8px', lineHeight: '1.5' }}>{msg.content}</p>
                                <p style={{ fontSize: '12px', opacity: 0.7 }}>
                                    {msg.sender === 'ADMIN' ? dict.support.admin : dict.support.user} • {new Date(msg.createdAt).toLocaleString(
                                        lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US'
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply Form */}
                {selectedTicket.status !== 'CLOSED' && (
                    <form onSubmit={handleReply} style={{
                        padding: 'var(--spacing-lg)',
                        borderTop: '1px solid var(--color-border)',
                        display: 'flex',
                        gap: 'var(--spacing-md)'
                    }}>
                        <input
                            type="text"
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder={dict.support.replyPlaceholder}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)',
                                fontSize: '15px',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={submitting || !replyMessage.trim()}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <Send size={16} />
                        </button>
                    </form>
                )}
            </div>
        );
    }

    return (
        <div>
            <div style={{
                backgroundColor: 'white',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={20} />
                    {dict.support.title}
                </h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                        {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
                    </div>
                ) : tickets.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                        {dict.support.noTickets}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.support.customer}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.support.subject}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.support.status}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.support.date}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => {
                                    const StatusIcon = getStatusIcon(ticket.status);
                                    return (
                                        <tr
                                            key={ticket.id}
                                            onClick={() => setSelectedTicket(ticket)}
                                            style={{
                                                borderBottom: '1px solid var(--color-border)',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <td style={{ padding: '16px 12px' }}>
                                                <p style={{ fontWeight: '500', marginBottom: '2px' }}>{ticket.user.name}</p>
                                                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{ticket.user.email}</p>
                                            </td>
                                            <td style={{ padding: '16px 12px' }}>
                                                <p style={{ fontWeight: '500' }}>{ticket.subject}</p>
                                                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                                    {ticket.TicketMessage.length} messages
                                                </p>
                                            </td>
                                            <td style={{ padding: '16px 12px' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    backgroundColor: `${getStatusColor(ticket.status)}20`,
                                                    color: getStatusColor(ticket.status),
                                                    fontSize: '13px',
                                                    fontWeight: '500'
                                                }}>
                                                    <StatusIcon size={14} />
                                                    {dict.status[ticket.status as keyof typeof dict.status] || ticket.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 12px', fontSize: '14px' }}>
                                                {new Date(ticket.createdAt).toLocaleDateString(
                                                    lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US'
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
