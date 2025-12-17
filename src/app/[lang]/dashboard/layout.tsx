'use client';

import { use } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import { LayoutDashboard, ShoppingBag, FileText, MessageSquare, Settings, ChevronRight } from 'lucide-react';

export default function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = use(params);
    const { data: session } = useSession();
    const pathname = usePathname();

    // Dictionary
    const dict = {
        dashboard: {
            title: lang === 'ar' ? 'لوحة التحكم' : lang === 'fr' ? 'Tableau de bord' : 'Dashboard',
            overview: lang === 'ar' ? 'نظرة عامة' : lang === 'fr' ? 'Aperçu' : 'Overview',
            orders: lang === 'ar' ? 'الطلبات' : lang === 'fr' ? 'Commandes' : 'Orders',
            content: lang === 'ar' ? 'المحتوى' : lang === 'fr' ? 'Contenu' : 'My Content',
            support: lang === 'ar' ? 'الدعم' : lang === 'fr' ? 'Support' : 'Support',
            settings: lang === 'ar' ? 'الإعدادات' : lang === 'fr' ? 'Paramètres' : 'Settings',
        },
        brand: lang === 'ar' ? 'منصة التعليم' : lang === 'fr' ? 'PLATEFORME EDU' : 'EDU PLATFORM',
        navigation: {
            home: lang === 'ar' ? 'الرئيسية' : lang === 'fr' ? 'Accueil' : 'Home',
            features: lang === 'ar' ? 'المميزات' : lang === 'fr' ? 'Fonctionnalités' : 'Features',
            pricing: lang === 'ar' ? 'الأسعار' : lang === 'fr' ? 'Tarifs' : 'Pricing',
            about: lang === 'ar' ? 'من نحن' : lang === 'fr' ? 'À propos' : 'About',
            login: lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Connexion' : 'Login',
            getStarted: lang === 'ar' ? 'ابدأ الآن' : lang === 'fr' ? 'Commencer' : 'Get Started',
            dashboard: lang === 'ar' ? 'لوحة التحكم' : lang === 'fr' ? 'Tableau de bord' : 'Dashboard',
            logout: lang === 'ar' ? 'تسجيل الخروج' : lang === 'fr' ? 'Déconnexion' : 'Logout',
        },
    };

    const navItems = [
        { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: dict.dashboard.overview },
        { href: `/${lang}/dashboard/orders`, icon: ShoppingBag, label: dict.dashboard.orders },
        { href: `/${lang}/dashboard/content`, icon: FileText, label: dict.dashboard.content },
        { href: `/${lang}/dashboard/support`, icon: MessageSquare, label: dict.dashboard.support },
        { href: `/${lang}/dashboard/settings`, icon: Settings, label: dict.dashboard.settings },
    ];

    const isActive = (href: string) => {
        if (href === `/${lang}/dashboard`) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F7FAFC' }}>
            <Header lang={lang} dict={dict} />

            <div className="container" style={{ paddingTop: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-xl)' }}>
                {/* Welcome Banner */}
                <div style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--border-radius-lg)',
                    marginBottom: 'var(--spacing-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-md)'
                }}>
                    <div>
                        <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', marginBottom: '4px' }}>
                            {lang === 'ar' ? `مرحباً، ${session?.user?.name || 'المعلم'}` :
                                lang === 'fr' ? `Bienvenue, ${session?.user?.name || 'Enseignant'}` :
                                    `Welcome back, ${session?.user?.name || 'Teacher'}`}
                        </h1>
                        <p style={{ fontSize: '14px', opacity: 0.9 }}>
                            {lang === 'ar' ? 'إليك ما يحدث مع حسابك' :
                                lang === 'fr' ? 'Voici ce qui se passe avec votre compte' :
                                    "Here's what's happening with your account"}
                        </p>
                    </div>
                    <Link
                        href={`/${lang}/pricing`}
                        className="btn btn-secondary"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {lang === 'ar' ? 'تصفح الحزم' : lang === 'fr' ? 'Voir les packs' : 'Browse Packages'}
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'var(--spacing-lg)' }}>
                    {/* Sidebar Navigation - becomes horizontal on mobile */}
                    <nav style={{
                        backgroundColor: 'white',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--border-radius-lg)',
                        boxShadow: 'var(--shadow-sm)',
                        height: 'fit-content',
                    }}>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px 16px',
                                                borderRadius: 'var(--border-radius-md)',
                                                backgroundColor: active ? 'rgba(43, 108, 176, 0.1)' : 'transparent',
                                                color: active ? 'var(--color-primary)' : 'var(--color-text-main)',
                                                fontWeight: active ? '600' : '400',
                                                fontSize: '15px',
                                                transition: 'all 0.2s ease',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <Icon size={18} />
                                            <span style={{ flex: 1 }}>{item.label}</span>
                                            {active && <ChevronRight size={16} />}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Main Content */}
                    <main style={{ gridColumn: 'span 3' }}>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
