'use client';

import { use } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import { LayoutDashboard, ShoppingBag, Package, Users, MessageSquare, FileText, Settings, ChevronRight } from 'lucide-react';

export default function AdminLayout({
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
        admin: {
            title: lang === 'ar' ? 'لوحة الإدارة' : lang === 'fr' ? 'Panneau d\'administration' : 'Admin Dashboard',
            overview: lang === 'ar' ? 'نظرة عامة' : lang === 'fr' ? 'Aperçu' : 'Overview',
            orders: lang === 'ar' ? 'الطلبات' : lang === 'fr' ? 'Commandes' : 'Orders',
            packages: lang === 'ar' ? 'الحزم' : lang === 'fr' ? 'Packs' : 'Packages',
            teachers: lang === 'ar' ? 'المعلمون' : lang === 'fr' ? 'Enseignants' : 'Teachers',
            support: lang === 'ar' ? 'الدعم' : lang === 'fr' ? 'Support' : 'Support',
            content: lang === 'ar' ? 'المحتوى' : lang === 'fr' ? 'Contenu' : 'Content',
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
            admin: lang === 'ar' ? 'الإدارة' : lang === 'fr' ? 'Admin' : 'Admin',
            logout: lang === 'ar' ? 'تسجيل الخروج' : lang === 'fr' ? 'Déconnexion' : 'Logout',
        },
    };

    const navItems = [
        { href: `/${lang}/admin`, icon: LayoutDashboard, label: dict.admin.overview },
        { href: `/${lang}/admin/orders`, icon: ShoppingBag, label: dict.admin.orders },
        { href: `/${lang}/admin/packages`, icon: Package, label: dict.admin.packages },
        { href: `/${lang}/admin/teachers`, icon: Users, label: dict.admin.teachers },
        { href: `/${lang}/admin/support`, icon: MessageSquare, label: dict.admin.support },
        { href: `/${lang}/admin/content`, icon: FileText, label: dict.admin.content },
        { href: `/${lang}/admin/settings`, icon: Settings, label: dict.admin.settings },
    ];

    const isActive = (href: string) => {
        if (href === `/${lang}/admin`) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F7FAFC' }}>
            <Header lang={lang} dict={dict} />

            <div className="container" style={{ paddingTop: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-xl)' }}>
                {/* Admin Header Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #1A365D 0%, #2B6CB0 100%)',
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
                        <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            🛡️ {dict.admin.title}
                        </h1>
                        <p style={{ fontSize: '14px', opacity: 0.9 }}>
                            {lang === 'ar' ? `مرحباً، ${session?.user?.name || 'المسؤول'}` :
                                lang === 'fr' ? `Bienvenue, ${session?.user?.name || 'Admin'}` :
                                    `Welcome, ${session?.user?.name || 'Admin'}`}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'var(--spacing-lg)' }}>
                    {/* Sidebar Navigation */}
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
