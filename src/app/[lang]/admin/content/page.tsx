'use client';

import { use } from 'react';
import { FileText, Upload, Globe } from 'lucide-react';

export default function AdminContentPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);

    // Dictionary
    const dict = {
        content: {
            title: lang === 'ar' ? 'إدارة المحتوى' : lang === 'fr' ? 'Gestion du contenu' : 'Content Management',
            comingSoon: lang === 'ar' ? 'قريباً' : lang === 'fr' ? 'Bientôt disponible' : 'Coming Soon',
            description: lang === 'ar' ? 'ستتمكن قريباً من إدارة محتوى الموقع ورفع الملفات من هنا' :
                lang === 'fr' ? 'Vous pourrez bientôt gérer le contenu du site et télécharger des fichiers ici' :
                    'You will soon be able to manage site content and upload files here',
            sections: {
                homepage: lang === 'ar' ? 'الصفحة الرئيسية' : lang === 'fr' ? 'Page d\'accueil' : 'Homepage',
                educational: lang === 'ar' ? 'المحتوى التعليمي' : lang === 'fr' ? 'Contenu éducatif' : 'Educational Content',
                testimonials: lang === 'ar' ? 'الشهادات' : lang === 'fr' ? 'Témoignages' : 'Testimonials',
                staticPages: lang === 'ar' ? 'الصفحات الثابتة' : lang === 'fr' ? 'Pages statiques' : 'Static Pages',
            }
        }
    };

    const sections = [
        { key: 'homepage', icon: Globe, description: lang === 'ar' ? 'تعديل عناوين ونصوص الصفحة الرئيسية' : 'Edit hero section and homepage text' },
        { key: 'educational', icon: FileText, description: lang === 'ar' ? 'رفع وإدارة الملفات التعليمية' : 'Upload and manage educational files' },
        { key: 'testimonials', icon: FileText, description: lang === 'ar' ? 'إضافة وتعديل شهادات العملاء' : 'Add and edit customer testimonials' },
        { key: 'staticPages', icon: FileText, description: lang === 'ar' ? 'تعديل صفحة من نحن والشروط' : 'Edit about page and terms' },
    ];

    return (
        <div>
            <div style={{
                backgroundColor: 'white',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={20} />
                    {dict.content.title}
                </h2>

                {/* Content Sections */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 'var(--spacing-md)' }}>
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.key}
                                style={{
                                    padding: 'var(--spacing-lg)',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: 'var(--border-radius-md)',
                                    border: '1px solid var(--color-border)',
                                    opacity: 0.6
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <Icon size={20} color="var(--color-primary)" />
                                    <h3 style={{ fontSize: '16px', fontWeight: '600' }}>
                                        {dict.content.sections[section.key as keyof typeof dict.content.sections]}
                                    </h3>
                                </div>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                                    {section.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Coming Soon Notice */}
                <div style={{
                    marginTop: 'var(--spacing-xl)',
                    padding: 'var(--spacing-lg)',
                    backgroundColor: 'rgba(43, 108, 176, 0.05)',
                    borderRadius: 'var(--border-radius-md)',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '8px' }}>
                        🚧 {dict.content.comingSoon}
                    </p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                        {dict.content.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
