'use client';

import { use, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';

export default function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Dictionary
    const dict = {
        login: {
            title: lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Connexion' : 'Login to Your Account',
            subtitle: lang === 'ar' ? 'مرحباً بعودتك' : lang === 'fr' ? 'Bienvenue de retour' : 'Welcome back',
            email: lang === 'ar' ? 'البريد الإلكتروني' : lang === 'fr' ? 'Email' : 'Email Address',
            password: lang === 'ar' ? 'كلمة المرور' : lang === 'fr' ? 'Mot de passe' : 'Password',
            submit: lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Se connecter' : 'Sign In',
            noAccount: lang === 'ar' ? 'ليس لديك حساب؟' : lang === 'fr' ? 'Pas de compte ?' : "Don't have an account?",
            registerLink: lang === 'ar' ? 'سجل الآن' : lang === 'fr' ? "S'inscrire" : 'Register here',
            error: lang === 'ar' ? 'بريد إلكتروني أو كلمة مرور غير صحيحة' : lang === 'fr' ? 'Email ou mot de passe incorrect' : 'Invalid email or password',
        },
        brand: lang === 'ar' ? 'منصة التعليم' : lang === 'fr' ? 'PLATEFORME EDU' : 'EDU PLATFORM',
        navigation: {
            home: lang === 'ar' ? 'الرئيسية' : lang === 'fr' ? 'Accueil' : 'Home',
            features: lang === 'ar' ? 'المميزات' : lang === 'fr' ? 'Fonctionnalités' : 'Features',
            pricing: lang === 'ar' ? 'الأسعار' : lang === 'fr' ? 'Tarifs' : 'Pricing',
            about: lang === 'ar' ? 'من نحن' : lang === 'fr' ? 'À propos' : 'About',
            login: lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Connexion' : 'Login',
            getStarted: lang === 'ar' ? 'ابدأ الآن' : lang === 'fr' ? 'Commencer' : 'Get Started',
        },
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError(dict.login.error);
            setLoading(false);
        } else {
            // Redirect to callback URL or dashboard
            const redirectTo = callbackUrl || `/${lang}/dashboard`;
            router.push(redirectTo);
            router.refresh();
        }
    };

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#F7FAFC' }}>
            <Header lang={lang} dict={dict} />

            <div className="container" style={{ paddingTop: 'clamp(40px, 8vh, 64px)', paddingBottom: 'clamp(40px, 8vh, 64px)' }}>
                <div style={{
                    maxWidth: '450px',
                    margin: '0 auto',
                    backgroundColor: 'white',
                    padding: 'clamp(32px, 6vw, 48px)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <h1 style={{ fontSize: 'clamp(28px, 5vw, 36px)', marginBottom: 'var(--spacing-sm)', textAlign: 'center', color: 'var(--color-primary-dark)' }}>
                        {dict.login.title}
                    </h1>
                    <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        {dict.login.subtitle}
                    </p>

                    {error && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            backgroundColor: 'rgba(229, 62, 62, 0.1)',
                            border: '1px solid #E53E3E',
                            borderRadius: 'var(--border-radius-md)',
                            marginBottom: 'var(--spacing-lg)',
                            textAlign: 'center',
                            color: '#E53E3E'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                                {dict.login.email}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    fontSize: '15px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--border-radius-md)',
                                    outline: 'none',
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                                {dict.login.password}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    fontSize: '15px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--border-radius-md)',
                                    outline: 'none',
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                marginTop: 'var(--spacing-md)',
                                opacity: loading ? 0.6 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? (lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Signing in...') : dict.login.submit}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                        {dict.login.noAccount}{' '}
                        <Link href={`/${lang}/register`} style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                            {dict.login.registerLink}
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

