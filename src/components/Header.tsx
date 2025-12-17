'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './header.module.css';
import { useState } from 'react';
import { Globe, Menu, X, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function Header({ lang, dict }: { lang: string; dict: any }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isAuthenticated = status === 'authenticated';
    const isAdmin = session?.user && (session.user as any).role === 'ADMIN';

    const languages = [
        { code: 'ar', label: 'العربية' },
        { code: 'fr', label: 'Français' },
        { code: 'en', label: 'English' },
    ];

    // Get current path without language prefix for language switcher
    const getPathWithoutLang = () => {
        const pathParts = pathname.split('/').filter(Boolean);
        if (pathParts.length > 0 && ['en', 'ar', 'fr'].includes(pathParts[0])) {
            return '/' + pathParts.slice(1).join('/');
        }
        return pathname;
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: `/${lang}` });
    };

    return (
        <header className={styles.header}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--header-height)' }}>
                <Link href={`/${lang}`} className={styles.logo}>{dict.brand}</Link>

                {/* Desktop Navigation */}
                <nav className={`${styles.nav} desktop-only`}>
                    <ul className={styles.navList}>
                        <li><Link href={`/${lang}`}>{dict.navigation.home}</Link></li>
                        <li><Link href={`/${lang}/features`}>{dict.navigation.features}</Link></li>
                        <li><Link href={`/${lang}/pricing`}>{dict.navigation.pricing}</Link></li>
                        <li><Link href={`/${lang}/about`}>{dict.navigation.about}</Link></li>
                    </ul>
                </nav>

                {/* Desktop Actions */}
                <div className={`${styles.actions} desktop-only`}>
                    {/* Language Switcher Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: 'var(--color-text-main)',
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                e.currentTarget.style.backgroundColor = 'rgba(43, 108, 176, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <Globe size={16} />
                            <span style={{ textTransform: 'uppercase' }}>{lang}</span>
                        </button>

                        {langMenuOpen && (
                            <>
                                <div
                                    onClick={() => setLangMenuOpen(false)}
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 999,
                                    }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: lang === 'ar' ? 'auto' : 0,
                                        left: lang === 'ar' ? 0 : 'auto',
                                        marginTop: '8px',
                                        backgroundColor: 'white',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--border-radius-md)',
                                        boxShadow: 'var(--shadow-lg)',
                                        zIndex: 1000,
                                        minWidth: '160px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {languages.map((language) => (
                                        <Link
                                            key={language.code}
                                            href={`/${language.code}${getPathWithoutLang()}`}
                                            onClick={() => setLangMenuOpen(false)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '12px 16px',
                                                color: lang === language.code ? 'var(--color-primary)' : 'var(--color-text-main)',
                                                textDecoration: 'none',
                                                backgroundColor: lang === language.code ? 'rgba(43, 108, 176, 0.1)' : 'transparent',
                                                fontSize: '14px',
                                                fontWeight: lang === language.code ? '600' : '400',
                                                transition: 'background-color 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (lang !== language.code) {
                                                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (lang !== language.code) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                } else {
                                                    e.currentTarget.style.backgroundColor = 'rgba(43, 108, 176, 0.1)';
                                                }
                                            }}
                                        >
                                            {language.label}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Auth-aware Action Buttons */}
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link
                                    href={`/${lang}/admin`}
                                    className="btn btn-secondary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <Shield size={16} />
                                    {dict.navigation.admin || 'Admin'}
                                </Link>
                            )}
                            <Link
                                href={`/${lang}/dashboard`}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                <LayoutDashboard size={16} />
                                {dict.navigation.dashboard || 'Dashboard'}
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="btn btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                <LogOut size={16} />
                                {dict.navigation.logout || 'Logout'}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href={`/${lang}/login`} className="btn btn-secondary">{dict.navigation.login}</Link>
                            <Link href={`/${lang}/register`} className="btn btn-primary">{dict.navigation.getStarted}</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-only"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-main)',
                    }}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 'var(--header-height)',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderTop: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-lg)',
                        zIndex: 999,
                        maxHeight: 'calc(100vh - var(--header-height))',
                        overflowY: 'auto',
                    }}
                >
                    <nav style={{ padding: 'var(--spacing-md)' }}>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <li>
                                <Link
                                    href={`/${lang}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        display: 'block',
                                        padding: '12px 16px',
                                        fontSize: '16px',
                                        color: 'var(--color-text-main)',
                                        borderRadius: 'var(--border-radius-md)',
                                        transition: 'background-color 0.2s ease',
                                    }}
                                >
                                    {dict.navigation.home}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${lang}/features`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        display: 'block',
                                        padding: '12px 16px',
                                        fontSize: '16px',
                                        color: 'var(--color-text-main)',
                                        borderRadius: 'var(--border-radius-md)',
                                    }}
                                >
                                    {dict.navigation.features}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${lang}/pricing`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        display: 'block',
                                        padding: '12px 16px',
                                        fontSize: '16px',
                                        color: 'var(--color-text-main)',
                                        borderRadius: 'var(--border-radius-md)',
                                    }}
                                >
                                    {dict.navigation.pricing}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${lang}/about`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        display: 'block',
                                        padding: '12px 16px',
                                        fontSize: '16px',
                                        color: 'var(--color-text-main)',
                                        borderRadius: 'var(--border-radius-md)',
                                    }}
                                >
                                    {dict.navigation.about}
                                </Link>
                            </li>
                        </ul>

                        {/* Mobile Language Selector */}
                        <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-sm)', paddingInlineStart: '16px' }}>
                                Language
                            </p>
                            {languages.map((language) => (
                                <Link
                                    key={language.code}
                                    href={`/${language.code}${getPathWithoutLang()}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px 16px',
                                        color: lang === language.code ? 'var(--color-primary)' : 'var(--color-text-main)',
                                        backgroundColor: lang === language.code ? 'rgba(43, 108, 176, 0.1)' : 'transparent',
                                        fontSize: '14px',
                                        fontWeight: lang === language.code ? '600' : '400',
                                        borderRadius: 'var(--border-radius-md)',
                                    }}
                                >
                                    <Globe size={16} style={{ marginInlineEnd: '8px' }} />
                                    {language.label}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-lg)' }}>
                            {isAuthenticated ? (
                                <>
                                    {isAdmin && (
                                        <Link
                                            href={`/${lang}/admin`}
                                            className="btn btn-secondary"
                                            onClick={() => setMobileMenuOpen(false)}
                                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            <Shield size={16} />
                                            {dict.navigation.admin || 'Admin'}
                                        </Link>
                                    )}
                                    <Link
                                        href={`/${lang}/dashboard`}
                                        className="btn btn-primary"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <LayoutDashboard size={16} />
                                        {dict.navigation.dashboard || 'Dashboard'}
                                    </Link>
                                    <button
                                        onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                                        className="btn btn-secondary"
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <LogOut size={16} />
                                        {dict.navigation.logout || 'Logout'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href={`/${lang}/login`} className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%' }}>
                                        {dict.navigation.login}
                                    </Link>
                                    <Link href={`/${lang}/register`} className="btn btn-primary" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%' }}>
                                        {dict.navigation.getStarted}
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
