'use client';

import { use, useEffect, useState } from 'react';
import { MessageSquare, Plus, Send, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';

interface Ticket {
    id: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    TicketMessage: {
        id: string;
        sender: string;
        content: string;
        createdAt: string;
    }[];
}

export default function SupportPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [newSubject, setNewSubject] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Dictionary
    const dict = {
        support: {
            title: lang === 'ar' ? 'مركز الدعم' : lang === 'fr' ? 'Centre de support' : 'Support Center',
            newTicket: lang === 'ar' ? 'تذكرة جديدة' : lang === 'fr' ? 'Nouveau ticket' : 'New Ticket',
            noTickets: lang === 'ar' ? 'لا توجد تذاكر دعم' : lang === 'fr' ? 'Aucun ticket' : 'No support tickets',
            createFirst: lang === 'ar' ? 'قم بإنشاء تذكرة إذا كنت بحاجة للمساعدة' : lang === 'fr' ? 'Créez un ticket si vous avez besoin d\'aide' : 'Create a ticket if you need help',
            subject: lang === 'ar' ? 'الموضوع' : lang === 'fr' ? 'Sujet' : 'Subject',
            subjectPlaceholder: lang === 'ar' ? 'أدخل موضوع التذكرة' : lang === 'fr' ? 'Entrez le sujet du ticket' : 'Enter ticket subject',
            message: lang === 'ar' ? 'الرسالة' : lang === 'fr' ? 'Message' : 'Message',
            messagePlaceholder: lang === 'ar' ? 'اشرح مشكلتك بالتفصيل...' : lang === 'fr' ? 'Décrivez votre problème en détail...' : 'Describe your issue in detail...',
            submit: lang === 'ar' ? 'إرسال' : lang === 'fr' ? 'Envoyer' : 'Submit',
            cancel: lang === 'ar' ? 'إلغاء' : lang === 'fr' ? 'Annuler' : 'Cancel',
            replyPlaceholder: lang === 'ar' ? 'اكتب ردك...' : lang === 'fr' ? 'Écrivez votre réponse...' : 'Write your reply...',
            you: lang === 'ar' ? 'أنت' : lang === 'fr' ? 'Vous' : 'You',
            admin: lang === 'ar' ? 'الدعم' : lang === 'fr' ? 'Support' : 'Support',
            back: lang === 'ar' ? 'رجوع' : lang === 'fr' ? 'Retour' : 'Back',
        },
        status: {
            OPEN: lang === 'ar' ? 'مفتوح' : lang === 'fr' ? 'Ouvert' : 'Open',
            IN_PROGRESS: lang === 'ar' ? 'قيد المعالجة' : lang === 'fr' ? 'En cours' : 'In Progress',
            CLOSED: lang === 'ar' ? 'مغلق' : lang === 'fr' ? 'Fermé' : 'Closed',
            ARCHIVED: lang === 'ar' ? 'مؤرشف' : lang === 'fr' ? 'Archivé' : 'Archived',
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch('/api/tickets');
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

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubject.trim() || !newMessage.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject: newSubject, message: newMessage }),
            });

            if (res.ok) {
                setNewSubject('');
                setNewMessage('');
                setShowNewTicket(false);
                fetchTickets();
            }
        } catch (error) {
            console.error('Failed to create ticket:', error);
        } finally {
            setSubmitting(false);
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
                // Refresh ticket data
                const ticketRes = await fetch('/api/tickets');
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return '#3B82F6';
            case 'IN_PROGRESS': return '#F59E0B';
            case 'CLOSED': return 'var(--color-secondary)';
            case 'ARCHIVED': return 'var(--color-text-muted)';
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
                    alignItems: 'center',
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
                        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
                            {selectedTicket.subject}
                        </h2>
                    </div>
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
                                alignSelf: msg.sender === 'USER' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%'
                            }}
                        >
                            <div style={{
                                padding: 'var(--spacing-md)',
                                borderRadius: 'var(--border-radius-md)',
                                backgroundColor: msg.sender === 'USER' ? 'var(--color-primary)' : '#F3F4F6',
                                color: msg.sender === 'USER' ? 'white' : 'var(--color-text-main)'
                            }}>
                                <p style={{ marginBottom: '8px', lineHeight: '1.5' }}>{msg.content}</p>
                                <p style={{ fontSize: '12px', opacity: 0.7 }}>
                                    {msg.sender === 'USER' ? dict.support.you : dict.support.admin} • {new Date(msg.createdAt).toLocaleString(
                                        lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US'
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply Form */}
                {selectedTicket.status !== 'CLOSED' && selectedTicket.status !== 'ARCHIVED' && (
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageSquare size={20} />
                        {dict.support.title}
                    </h2>
                    <button
                        onClick={() => setShowNewTicket(true)}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Plus size={16} />
                        {dict.support.newTicket}
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                        {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
                    </div>
                ) : tickets.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <MessageSquare size={48} color="var(--color-text-muted)" style={{ marginBottom: 'var(--spacing-md)', opacity: 0.5 }} />
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                            {dict.support.noTickets}
                        </p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                            {dict.support.createFirst}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                        {tickets.map((ticket) => {
                            const StatusIcon = getStatusIcon(ticket.status);
                            return (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    style={{
                                        padding: 'var(--spacing-md)',
                                        backgroundColor: '#F9FAFB',
                                        borderRadius: 'var(--border-radius-md)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: 'var(--spacing-sm)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                                >
                                    <div>
                                        <p style={{ fontWeight: '500', marginBottom: '4px' }}>{ticket.subject}</p>
                                        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                            {new Date(ticket.createdAt).toLocaleDateString(
                                                lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US'
                                            )} • {ticket.TicketMessage.length} {lang === 'ar' ? 'رسالة' : lang === 'fr' ? 'messages' : 'messages'}
                                        </p>
                                    </div>
                                    <span style={{
                                        display: 'flex',
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
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* New Ticket Modal */}
            {showNewTicket && (
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
                    onClick={() => setShowNewTicket(false)}
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
                                {dict.support.newTicket}
                            </h3>
                            <button
                                onClick={() => setShowNewTicket(false)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={20} color="var(--color-text-muted)" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTicket}>
                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                                    {dict.support.subject}
                                </label>
                                <input
                                    type="text"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    placeholder={dict.support.subjectPlaceholder}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--border-radius-md)',
                                        fontSize: '15px',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                                    {dict.support.message}
                                </label>
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={dict.support.messagePlaceholder}
                                    required
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--border-radius-md)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowNewTicket(false)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    {dict.support.cancel}
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    {submitting ? '...' : dict.support.submit}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
