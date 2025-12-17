'use client';

import { use, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Settings, User, Globe, Lock, Save, Check } from 'lucide-react';

export default function SettingsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const { data: session, update } = useSession();

    const [name, setName] = useState('');
    const [preferredLanguage, setPreferredLanguage] = useState('en');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Dictionary
    const dict = {
        settings: {
            title: lang === 'ar' ? 'الإعدادات' : lang === 'fr' ? 'Paramètres' : 'Settings',
            personalInfo: lang === 'ar' ? 'المعلومات الشخصية' : lang === 'fr' ? 'Informations personnelles' : 'Personal Information',
            name: lang === 'ar' ? 'الاسم الكامل' : lang === 'fr' ? 'Nom complet' : 'Full Name',
            email: lang === 'ar' ? 'البريد الإلكتروني' : lang === 'fr' ? 'Email' : 'Email',
            emailNote: lang === 'ar' ? 'لا يمكن تغيير البريد الإلكتروني' : lang === 'fr' ? 'L\'email ne peut pas être modifié' : 'Email cannot be changed',
            language: lang === 'ar' ? 'اللغة المفضلة' : lang === 'fr' ? 'Langue préférée' : 'Preferred Language',
            security: lang === 'ar' ? 'الأمان' : lang === 'fr' ? 'Sécurité' : 'Security',
            currentPassword: lang === 'ar' ? 'كلمة المرور الحالية' : lang === 'fr' ? 'Mot de passe actuel' : 'Current Password',
            newPassword: lang === 'ar' ? 'كلمة المرور الجديدة' : lang === 'fr' ? 'Nouveau mot de passe' : 'New Password',
            confirmPassword: lang === 'ar' ? 'تأكيد كلمة المرور' : lang === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password',
            saveChanges: lang === 'ar' ? 'حفظ التغييرات' : lang === 'fr' ? 'Enregistrer' : 'Save Changes',
            changePassword: lang === 'ar' ? 'تغيير كلمة المرور' : lang === 'fr' ? 'Changer le mot de passe' : 'Change Password',
            saved: lang === 'ar' ? 'تم الحفظ بنجاح' : lang === 'fr' ? 'Enregistré avec succès' : 'Saved successfully',
            passwordChanged: lang === 'ar' ? 'تم تغيير كلمة المرور' : lang === 'fr' ? 'Mot de passe modifié' : 'Password changed',
            passwordMismatch: lang === 'ar' ? 'كلمات المرور غير متطابقة' : lang === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match',
            error: lang === 'ar' ? 'حدث خطأ' : lang === 'fr' ? 'Une erreur s\'est produite' : 'An error occurred',
        },
        languages: {
            en: lang === 'ar' ? 'الإنجليزية' : lang === 'fr' ? 'Anglais' : 'English',
            ar: lang === 'ar' ? 'العربية' : lang === 'fr' ? 'Arabe' : 'Arabic',
            fr: lang === 'ar' ? 'الفرنسية' : lang === 'fr' ? 'Français' : 'French',
        }
    };

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
        }
    }, [session]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, preferredLanguage }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: dict.settings.saved });
                // Update session
                await update({ name });
            } else {
                setMessage({ type: 'error', text: dict.settings.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: dict.settings.error });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: dict.settings.passwordMismatch });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: dict.settings.passwordChanged });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || dict.settings.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: dict.settings.error });
        } finally {
            setLoading(false);
        }
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

            {/* Personal Information */}
            <div style={{
                backgroundColor: 'white',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={20} />
                    {dict.settings.personalInfo}
                </h2>

                <form onSubmit={handleSaveProfile}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                                {dict.settings.name}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                                {dict.settings.email}
                            </label>
                            <input
                                type="email"
                                value={session?.user?.email || ''}
                                disabled
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--border-radius-md)',
                                    fontSize: '15px',
                                    backgroundColor: '#F9FAFB',
                                    color: 'var(--color-text-muted)'
                                }}
                            />
                            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                {dict.settings.emailNote}
                            </p>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Globe size={14} />
                                {dict.settings.language}
                            </label>
                            <select
                                value={preferredLanguage}
                                onChange={(e) => setPreferredLanguage(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--border-radius-md)',
                                    fontSize: '15px',
                                    outline: 'none',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="en">{dict.languages.en}</option>
                                <option value="ar">{dict.languages.ar}</option>
                                <option value="fr">{dict.languages.fr}</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Save size={16} />
                        {dict.settings.saveChanges}
                    </button>
                </form>
            </div>

            {/* Security / Password */}
            <div style={{
                backgroundColor: 'white',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={20} />
                    {dict.settings.security}
                </h2>

                <form onSubmit={handleChangePassword}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                                {dict.settings.currentPassword}
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
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

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                                {dict.settings.newPassword}
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                                {dict.settings.confirmPassword}
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Lock size={16} />
                        {dict.settings.changePassword}
                    </button>
                </form>
            </div>
        </div>
    );
}
