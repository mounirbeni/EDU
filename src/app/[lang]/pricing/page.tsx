'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Link from 'next/link';
import { Zap, TrendingUp, Crown, Check } from 'lucide-react';

export default function PricingPage({ params }: { params: { lang: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [dict, setDict] = useState<any>(null);
    const [lang, setLang] = useState<string>('en');

    const isAuthenticated = status === 'authenticated';

    useEffect(() => {
        const loadDict = async () => {
            const resolvedParams = await Promise.resolve(params);
            setLang(resolvedParams.lang);
            const dictionary = await import(`../../../dictionaries/${resolvedParams.lang}.json`);
            setDict(dictionary.default);
        };
        loadDict();
    }, [params]);

    const handleBuyNow = (bundleTier: string) => {
        if (isAuthenticated) {
            router.push(`/${lang}/checkout?bundle=${bundleTier}`);
        } else {
            // Redirect to register with the bundle context preserved
            router.push(`/${lang}/register?redirect=/checkout&bundle=${bundleTier}`);
        }
    };

    if (!dict) return null;

    const calculateSavings = (original: string, discounted: string) => {
        const origNum = parseInt(original.replace(/[^\d]/g, ''));
        const discNum = parseInt(discounted.replace(/[^\d]/g, ''));
        return origNum - discNum;
    };

    const bundles = [
        {
            icon: Zap,
            name: dict.pricing.bundle1Name,
            price: dict.pricing.bundle1Price,
            originalPrice: dict.pricing.bundle1OriginalPrice,
            desc: dict.pricing.bundle1Desc,
            features: dict.pricing.bundle1Features,
            tier: 'starter',
            color: 'var(--color-primary)',
        },
        {
            icon: TrendingUp,
            name: dict.pricing.bundle2Name,
            price: dict.pricing.bundle2Price,
            originalPrice: dict.pricing.bundle2OriginalPrice,
            desc: dict.pricing.bundle2Desc,
            features: dict.pricing.bundle2Features,
            tier: 'professional',
            popular: true,
            color: 'var(--color-primary)',
        },
        {
            icon: Crown,
            name: dict.pricing.bundle3Name,
            price: dict.pricing.bundle3Price,
            originalPrice: dict.pricing.bundle3OriginalPrice,
            desc: dict.pricing.bundle3Desc,
            features: dict.pricing.bundle3Features,
            tier: 'complete',
            color: 'var(--color-primary)',
        },
    ];

    return (
        <main>
            <Header lang={lang} dict={dict} />

            <div className="section-spacing" style={{ backgroundColor: '#F0F4F8' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--spacing-md)', color: 'var(--color-primary-dark)' }}>
                        {dict.pricing.title}
                    </h1>
                    <p style={{ fontSize: '20px', color: 'var(--color-text-muted)', maxWidth: '800px', margin: '0 auto' }}>
                        {dict.pricing.subtitle}
                    </p>
                </div>
            </div>

            <div className="container section-spacing">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--spacing-lg)', maxWidth: '1200px', margin: '0 auto' }}>

                    {bundles.map((bundle, index) => {
                        const Icon = bundle.icon;
                        const isPopular = bundle.popular;
                        const savings = calculateSavings(bundle.originalPrice, bundle.price);

                        return (
                            <div
                                key={index}
                                style={{
                                    padding: isPopular ? 'clamp(24px, 6vw, 48px)' : 'clamp(20px, 5vw, 32px)',
                                    backgroundColor: isPopular ? 'var(--color-primary)' : 'var(--color-bg-card)',
                                    borderRadius: 'var(--border-radius-lg)',
                                    boxShadow: isPopular ? 'var(--shadow-lg)' : 'var(--shadow-md)',
                                    border: isPopular ? '3px solid var(--color-primary-dark)' : '2px solid var(--color-border)',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease',
                                    position: 'relative' as const,
                                    transform: isPopular ? 'scale(1.02)' : 'scale(1)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isPopular) {
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isPopular) {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    }
                                }}
                            >
                                {isPopular && (
                                    <div style={{
                                        position: 'absolute' as const,
                                        top: '-12px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: 'var(--color-secondary)',
                                        color: 'var(--color-text-main)',
                                        padding: '6px 24px',
                                        borderRadius: 'var(--border-radius-md)',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase' as const,
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        POPULAR
                                    </div>
                                )}

                                {/* Save Badge */}
                                <div style={{
                                    position: 'absolute' as const,
                                    top: isPopular ? '20px' : '12px',
                                    right: '12px',
                                    backgroundColor: '#E53E3E',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: 'var(--border-radius-md)',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    letterSpacing: '0.3px',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    {dict.pricing.save} {savings} MAD
                                </div>

                                {/* Icon */}
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '16px',
                                    backgroundColor: isPopular ? 'rgba(255, 255, 255, 0.2)' : 'rgba(43, 108, 176, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--spacing-lg)',
                                    marginTop: isPopular ? 'var(--spacing-md)' : '0'
                                }}>
                                    <Icon size={32} color={isPopular ? 'white' : bundle.color} strokeWidth={2} />
                                </div>

                                <h3 style={{
                                    fontSize: 'var(--font-size-h3)',
                                    marginBottom: 'var(--spacing-md)',
                                    color: isPopular ? 'var(--color-text-inverse)' : 'var(--color-primary)',
                                    fontWeight: '700'
                                }}>
                                    {bundle.name}
                                </h3>

                                {/* Original Price (strikethrough) */}
                                <div style={{
                                    fontSize: '20px',
                                    color: isPopular ? 'rgba(255,255,255,0.6)' : 'var(--color-text-muted)',
                                    textDecoration: 'line-through',
                                    marginBottom: 'var(--spacing-sm)'
                                }}>
                                    {bundle.originalPrice}
                                </div>

                                {/* Discounted Price */}
                                <div style={{
                                    fontSize: '56px',
                                    fontWeight: '700',
                                    color: isPopular ? 'var(--color-text-inverse)' : 'var(--color-primary-dark)',
                                    marginBottom: 'var(--spacing-sm)',
                                    lineHeight: '1'
                                }}>
                                    {bundle.price}
                                </div>

                                <p style={{
                                    color: isPopular ? 'rgba(255,255,255,0.9)' : 'var(--color-text-muted)',
                                    marginBottom: 'var(--spacing-xl)',
                                    lineHeight: '1.6',
                                    minHeight: '48px',
                                    fontSize: '15px'
                                }}>
                                    {bundle.desc}
                                </p>

                                {/* Features List */}
                                <div style={{
                                    textAlign: lang === 'ar' ? 'right' : 'left',
                                    marginBottom: 'var(--spacing-xl)',
                                    paddingInlineStart: 'var(--spacing-md)',
                                    paddingInlineEnd: 'var(--spacing-md)'
                                }}>
                                    {bundle.features.map((feature: string, idx: number) => (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-sm)',
                                            marginBottom: 'var(--spacing-sm)',
                                            color: isPopular ? 'rgba(255,255,255,0.95)' : 'var(--color-text-main)'
                                        }}>
                                            <Check
                                                size={18}
                                                color={isPopular ? 'var(--color-secondary)' : 'var(--color-secondary-dark)'}
                                                strokeWidth={3}
                                                style={{ flexShrink: 0 }}
                                            />
                                            <span style={{ fontSize: '15px' }}>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleBuyNow(bundle.tier)}
                                    className={isPopular ? "btn btn-secondary" : "btn btn-primary"}
                                    style={{ width: '100%' }}
                                >
                                    {dict.pricing.cta}
                                </button>
                            </div>
                        );
                    })}

                </div>
            </div>
        </main>
    );
}
