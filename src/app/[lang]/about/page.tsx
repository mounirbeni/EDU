'use client';

import { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { Target, Eye, BookOpen, Users, Award, TrendingUp, Heart, Sparkles } from 'lucide-react';

export default function AboutPage({ params }: { params: { lang: string } }) {
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

    const values = [
        { icon: Award, title: dict.about.value1, desc: dict.about.value1Desc },
        { icon: Users, title: dict.about.value2, desc: dict.about.value2Desc },
        { icon: Sparkles, title: dict.about.value3, desc: dict.about.value3Desc },
        { icon: Heart, title: dict.about.value4, desc: dict.about.value4Desc },
    ];

    const stats = [
        { value: dict.about.stats.students, label: dict.about.stats.studentsLabel },
        { value: dict.about.stats.courses, label: dict.about.stats.coursesLabel },
        { value: dict.about.stats.satisfaction, label: dict.about.stats.satisfactionLabel },
        { value: dict.about.stats.completion, label: dict.about.stats.completionLabel },
    ];

    return (
        <main>
            <Header lang={lang} dict={dict} />

            {/* Hero Section */}
            <div className="section-spacing" style={{ backgroundColor: '#F0F4F8' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--spacing-md)', color: 'var(--color-primary-dark)' }}>
                        {dict.about.title}
                    </h1>
                    <p style={{ fontSize: '20px', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                        {dict.about.subtitle}
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container" style={{ marginTop: '-40px', marginBottom: 'var(--spacing-xxl)' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
                    gap: 'var(--spacing-md)',
                    backgroundColor: 'white',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    {stats.map((stat, idx) => (
                        <div key={idx} style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
                            <div style={{
                                fontSize: '48px',
                                fontWeight: '700',
                                color: 'var(--color-primary)',
                                marginBottom: 'var(--spacing-sm)'
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: 'var(--color-text-muted)',
                                textTransform: 'uppercase' as const,
                                letterSpacing: '0.5px'
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="container section-spacing">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--spacing-xl)' }}>

                    {/* Mission */}
                    <div style={{
                        padding: 'var(--spacing-xl)',
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--border-radius-lg)',
                        border: '2px solid var(--color-primary)',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(43, 108, 176, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            <Target size={28} color="var(--color-primary)" strokeWidth={2} />
                        </div>
                        <h2 style={{
                            fontSize: 'var(--font-size-h2)',
                            marginBottom: 'var(--spacing-md)',
                            color: 'var(--color-primary)'
                        }}>
                            {dict.about.mission}
                        </h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--color-text-main)' }}>
                            {dict.about.missionDesc}
                        </p>
                    </div>

                    {/* Vision */}
                    <div style={{
                        padding: 'var(--spacing-xl)',
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--border-radius-lg)',
                        border: '2px solid var(--color-secondary)',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(104, 211, 145, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            <Eye size={28} color="var(--color-secondary-dark)" strokeWidth={2} />
                        </div>
                        <h2 style={{
                            fontSize: 'var(--font-size-h2)',
                            marginBottom: 'var(--spacing-md)',
                            color: 'var(--color-secondary-dark)'
                        }}>
                            {dict.about.vision}
                        </h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--color-text-main)' }}>
                            {dict.about.visionDesc}
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Story */}
            <div className="section-spacing" style={{ backgroundColor: '#F0F4F8' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)',
                        marginBottom: 'var(--spacing-lg)',
                        justifyContent: 'center'
                    }}>
                        <BookOpen size={32} color="var(--color-primary)" strokeWidth={2} />
                        <h2 style={{
                            fontSize: 'var(--font-size-h2)',
                            color: 'var(--color-primary)',
                            margin: 0
                        }}>
                            {dict.about.story}
                        </h2>
                    </div>
                    <p style={{
                        fontSize: '18px',
                        lineHeight: '1.8',
                        color: 'var(--color-text-main)',
                        textAlign: 'center'
                    }}>
                        {dict.about.storyDesc}
                    </p>
                </div>
            </div>

            {/* Our Values */}
            <div className="container section-spacing">
                <h2 style={{
                    fontSize: 'var(--font-size-h2)',
                    marginBottom: 'var(--spacing-xl)',
                    color: 'var(--color-primary-dark)',
                    textAlign: 'center'
                }}>
                    {dict.about.values}
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    {values.map((value, idx) => {
                        const Icon = value.icon;
                        return (
                            <div
                                key={idx}
                                style={{
                                    padding: 'var(--spacing-lg)',
                                    backgroundColor: 'var(--color-bg-card)',
                                    borderRadius: 'var(--border-radius-lg)',
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--color-border)',
                                    textAlign: 'center',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(43, 108, 176, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--spacing-md)'
                                }}>
                                    <Icon size={28} color="var(--color-primary)" strokeWidth={2} />
                                </div>
                                <h3 style={{
                                    fontSize: 'var(--font-size-h3)',
                                    marginBottom: 'var(--spacing-sm)',
                                    color: 'var(--color-primary)',
                                    fontWeight: '600'
                                }}>
                                    {value.title}
                                </h3>
                                <p style={{
                                    color: 'var(--color-text-muted)',
                                    lineHeight: '1.6',
                                    fontSize: '15px'
                                }}>
                                    {value.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
