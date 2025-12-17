'use client';

import { use, useState } from 'react';
import { Settings, Globe, CreditCard, Mail, Save, Check } from 'lucide-react';

export default function AdminSettingsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Dictionary
    const dict = {
        settings: {
            title: lang === 'ar' ? 'إعدادات المنصة' : lang === 'fr' ? 'Paramètres de la plateforme' : 'Platform Settings',
            payment: {
                title: lang === 'ar' ? 'إعدادات الدفع' : lang === 'fr' ? 'Paramètres de paiement' : 'Payment Settings',
                bankName: lang === 'ar' ? 'اسم البنك' : lang === 'fr' ? 'Nom de la banque' : 'Bank Name',
                accountNumber: lang === 'ar' ? 'رقم الحساب (RIB)' : lang === 'fr' ? 'Numéro de compte (RIB)' : 'Account Number (RIB)',
                accountHolder: lang === 'ar' ? 'اسم صاحب الحساب' : lang === 'fr' ? 'Titulaire du compte' : 'Account Holder',
                cashPlusNumber: lang === 'ar' ? 'رقم كاش بلس' : lang === 'fr' ? 'Numéro CashPlus' : 'CashPlus Number',
            },
            email: {
                title: lang === 'ar' ? 'إعدادات البريد' : lang === 'fr' ? 'Paramètres email' : 'Email Settings',
                senderEmail: lang === 'ar' ? 'بريد المرسل' : lang === 'fr' ? 'Email expéditeur' : 'Sender Email',
                senderName: lang === 'ar' ? 'اسم المرسل' : lang === 'fr' ? 'Nom expéditeur' : 'Sender Name',
            },
            general: {
                title: lang === 'ar' ? 'الإعدادات العامة' : lang === 'fr' ? 'Paramètres généraux' : 'General Settings',
                defaultLanguage: lang === 'ar' ? 'اللغة الافتراضية' : lang === 'fr' ? 'Langue par défaut' : 'Default Language',
                currency: lang === 'ar' ? 'العملة' : lang === 'fr' ? 'Devise' : 'Currency',
            },
            save: lang === 'ar' ? 'حفظ التغييرات' : lang === 'fr' ? 'Enregistrer' : 'Save Changes',
            saved: lang === 'ar' ? 'تم الحفظ بنجاح' : lang === 'fr' ? 'Enregistré avec succès' : 'Saved successfully',
            comingSoon: lang === 'ar' ? 'هذه الإعدادات للعرض فقط حالياً' : lang === 'fr' ? 'Ces paramètres sont en lecture seule pour le moment' : 'These settings are read-only for now',
        }
    };

    // Current settings (hardcoded for display)
    const paymentSettings = {
        bankName: 'Attijariwafa Bank',
        accountNumber: '007 780 0001 234 567 890 123 45',
        accountHolder: 'EDU Platform SARL',
        cashPlusNumber: '0600-000-000',
    };

    const emailSettings = {
        senderEmail: 'noreply@eduplatform.ma',
        senderName: 'EDU Platform',
    };

    const generalSettings = {
        defaultLanguage: 'en',
        currency: 'MAD',
    };

    const handleSave = () => {
        setMessage({ type: 'success', text: dict.settings.saved });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {/* Message */}
            {message && (
                <div style={{
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--border-radius-md)',
                    backgroundColor: message.type === 'success' ? 'rgba(104, 211, 145, 0.1)' : 'rgba(229, 62, 62, 0.1)',
                    border: `1px solid ${message.type === 'success' ? 'var(--color-secondary)' : '#E53E3E'}`,
                    color: message.type === 'success' ? 'var(--color-secondary-dark)' : '#E53E3E',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    {message.type === 'success' ? <Check size={18} /> : null}
                    {message.text}
                </div>
            )}

            {/* Read-only Notice */}
            <div style={{
                padding: 'var(--spacing-md)',
                backgroundColor: '#FEF3C7',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center',
                fontSize: '14px'
            }}>
                🚧 {dict.settings.comingSoon}
            </div>

            {/* Payment Settings */}
            <div style={{
                backgroundColor: 'white',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={20} />
                    {dict.settings.payment.title}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 'var(--spacing-lg)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                            {dict.settings.payment.bankName}
                        </label>
                        <input
                            type="text"
                            value={paymentSettings.bankName}
                            disabled
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)',
                                fontSize: '14px',
                                backgroundColor: '#F9FAFB'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                            {dict.settings.payment.accountNumber}
                        </label>
                        <input
                            type="text"
                            value={paymentSettings.accountNumber}
                            disabled
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)',
                                fontSize: '14px',
                                backgroundColor: '#F9FAFB',
                                fontFamily: 'monospace'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                            {dict.settings.payment.accountHolder}
                        </label>
                        <input
                            type="text"
                            value={paymentSettings.accountHolder}
                            disabled
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)',
                                fontSize: '14px',
                                backgroundColor: '#F9FAFB'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                            {dict.settings.payment.cashPlusNumber}
                        </label>
                        <input
                            type="text"
                            value={paymentSettings.cashPlusNumber}
                            disabled
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)',
                                fontSize: '14px',
                                backgroundColor: '#F9FAFB'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* General Settings */}
            <div style={{
                backgroundColor: 'white',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={20} />
                    {dict.settings.general.title}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 'var(--spacing-lg)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                            {dict.settings.general.defaultLanguage}
                        </label>
                        <select
                            value={generalSettings.defaultLanguage}
                            disabled
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)',
                                fontSize: '14px',
                                backgroundColor: '#F9FAFB'
                            }}
                        >
                            <option value="en">English</option>
                            <option value="ar">العربية</option>
                            <option value="fr">Français</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                            {dict.settings.general.currency}
                        </label>
                        <input
                            type="text"
                            value={generalSettings.currency}
                            disabled
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)',
                                fontSize: '14px',
                                backgroundColor: '#F9FAFB'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Email Settings */}
            <div style={{
                backgroundColor: 'white',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={20} />
                    {dict.settings.email.title}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 'var(--spacing-lg)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                            {dict.settings.email.senderEmail}
                        </label>
                        <input
                            type="email"
                            value={emailSettings.senderEmail}
                            disabled
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)',
                                fontSize: '14px',
                                backgroundColor: '#F9FAFB'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                            {dict.settings.email.senderName}
                        </label>
                        <input
                            type="text"
                            value={emailSettings.senderName}
                            disabled
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)',
                                fontSize: '14px',
                                backgroundColor: '#F9FAFB'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
