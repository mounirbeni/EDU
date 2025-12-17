'use client';

import { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { CheckCircle, BookOpen, Infinity, Headphones } from 'lucide-react';

export default function FeaturesPage({ params }: { params: { lang: string } }) {
    const [dict, setDict] = useState<any>(null);
    const [lang, setLang] = useState<string>('en');

    useEffect(() => {
        const loadDict = async () => {
            const resolvedParams = await Promise.resolve(params);
            setLang(resolvedParams.lang);
            const dictionary = await import(`../../../dictionaries/${resolvedParams.lang}.json`);
            setDict(dictionary.default);
        };
        loadDict();
    }, [params]);

    if (!dict) return null;

    const features = [
        {
            icon: CheckCircle,
            title: dict.features.feature1Title,
            desc: dict.features.feature1Desc,
        },
        {
            icon: BookOpen,
            title: dict.features.feature2Title,
            desc: dict.features.feature2Desc,
        },
        {
            icon: Infinity,
            title: dict.features.feature3Title,
            desc: dict.features.feature3Desc,
        },
        {
            icon: Headphones,
            title: dict.features.feature4Title,
            desc: dict.features.feature4Desc,
        },
    ];

    return (
        <main>
            <Header lang={lang} dict={dict} />

            <div className="section-spacing" style={{ backgroundColor: '#F0F4F8' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--spacing-md)', color: 'var(--color-primary-dark)' }}>
                        {dict.features.title}
                    </h1>
                    <p style={{ fontSize: '20px', color: 'var(--color-text-muted)', maxWidth: '800px', margin: '0 auto' }}>
                        {dict.features.subtitle}
                    </p>
                </div>
            </div>

            <div className="container section-spacing">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                    gap: 'clamp(20px, 4vw, 32px)'
                }}>

                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                style={{
                                    padding: 'clamp(24px, 5vw, 48px)',
                                    backgroundColor: 'var(--color-bg-card)',
                                    borderRadius: 'var(--border-radius-lg)',
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--color-border)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                }}
                            >
                                <div style={{
                                    width: 'clamp(48px, 12vw, 64px)',
                                    height: 'clamp(48px, 12vw, 64px)',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(43, 108, 176, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 'var(--spacing-md)'
                                }}>
                                    <Icon size={28} color="var(--color-primary)" strokeWidth={2} />
                                </div>
                                <h3 style={{
                                    fontSize: 'var(--font-size-h3)',
                                    marginBottom: 'var(--spacing-md)',
                                    color: 'var(--color-primary)',
                                    fontWeight: '600'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    color: 'var(--color-text-muted)',
                                    lineHeight: '1.6',
                                    fontSize: '16px'
                                }}>
                                    {feature.desc}
                                </p>
                            </div>
                        );
                    })}

                </div>
            </div>
        </main>
    );
}
