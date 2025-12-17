'use client';

import { use, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';

function RegisterContent({ lang, dict }: { lang: string, dict: any }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect');
    const bundleParam = searchParams.get('bundle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        institution: '',
        password: '',
        educationLevel: '',
        subject: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const requiredMsg = lang === 'ar' ? 'هذا الحقل مطلوب' : lang === 'fr' ? 'Ce champ est requis' : 'This field is required';

        if (!formData.name.trim()) newErrors.name = requiredMsg;

        if (!formData.email.trim()) newErrors.email = requiredMsg;
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = lang === 'ar' ? 'بريد إلكتروني غير صالح' : lang === 'fr' ? 'Email invalide' : 'Invalid email address';
        }

        if (!formData.phone.trim()) newErrors.phone = requiredMsg;
        if (!formData.city.trim()) newErrors.city = requiredMsg;
        if (!formData.institution.trim()) newErrors.institution = requiredMsg;

        if (!formData.password) newErrors.password = requiredMsg;
        else if (formData.password.length < 8) {
            newErrors.password = lang === 'ar' ? 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' : lang === 'fr' ? 'Le mot de passe doit contenir au moins 8 caractères' : 'Password must be at least 8 characters';
        }

        if (!formData.educationLevel) newErrors.educationLevel = requiredMsg;
        if (!formData.subject.trim()) newErrors.subject = requiredMsg;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ submit: data.error || 'Registration failed' });
                setLoading(false);
                return;
            }

            setSuccessMessage(dict.register.submitButton);
            setTimeout(() => {
                // Redirect to login with any preserved params
                let loginUrl = `/${lang}/login`;
                if (redirectPath || bundleParam) {
                    const params = new URLSearchParams();
                    if (redirectPath) params.set('callbackUrl', `/${lang}${redirectPath}${bundleParam ? `?bundle=${bundleParam}` : ''}`);
                    loginUrl += `?${params.toString()}`;
                }
                router.push(loginUrl);
            }, 2000);

        } catch (error) {
            setErrors({ submit: 'Network error. Please try again.' });
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: 'clamp(40px, 8vh, 64px)', paddingBottom: 'clamp(40px, 8vh, 64px)' }}>
            <div style={{
                maxWidth: '500px',
                margin: '0 auto',
                backgroundColor: 'white',
                padding: 'clamp(32px, 6vw, 48px)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <h1 style={{ fontSize: 'clamp(28px, 5vw, 36px)', marginBottom: 'var(--spacing-sm)', textAlign: 'center', color: 'var(--color-primary-dark)' }}>
                    {dict.register.title}
                </h1>
                <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    {dict.register.subtitle}
                </p>

                {successMessage && (
                    <div style={{
                        padding: 'var(--spacing-md)',
                        backgroundColor: 'rgba(104, 211, 145, 0.1)',
                        border: '1px solid var(--color-secondary)',
                        borderRadius: 'var(--border-radius-md)',
                        marginBottom: 'var(--spacing-lg)',
                        textAlign: 'center',
                        color: 'var(--color-secondary-dark)'
                    }}>
                        {lang === 'ar' ? 'تم إنشاء الحساب بنجاح! جاري التحويل...' : lang === 'fr' ? 'Compte créé avec succès ! Redirection...' : 'Account created successfully! Redirecting...'}
                    </div>
                )}

                {errors.submit && (
                    <div style={{
                        padding: 'var(--spacing-md)',
                        backgroundColor: 'rgba(229, 62, 62, 0.1)',
                        border: '1px solid #E53E3E',
                        borderRadius: 'var(--border-radius-md)',
                        marginBottom: 'var(--spacing-lg)',
                        textAlign: 'center',
                        color: '#E53E3E'
                    }}>
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    {/* Full Name */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                            {dict.register.fullName} <span style={{ color: '#E53E3E' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={dict.register.fullNamePlaceholder}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '15px',
                                border: `1px solid ${errors.name ? '#E53E3E' : 'var(--color-border)'}`,
                                borderRadius: 'var(--border-radius-md)',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => !errors.name && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                        />
                        {errors.name && <p style={{ color: '#E53E3E', fontSize: '13px', marginTop: 'var(--spacing-sm)' }}>{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                            {dict.register.email} <span style={{ color: '#E53E3E' }}>*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder={dict.register.emailPlaceholder}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '15px',
                                border: `1px solid ${errors.email ? '#E53E3E' : 'var(--color-border)'}`,
                                borderRadius: 'var(--border-radius-md)',
                                outline: 'none',
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => !errors.email && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                        />
                        {errors.email && <p style={{ color: '#E53E3E', fontSize: '13px', marginTop: 'var(--spacing-sm)' }}>{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                            {dict.register.phone} <span style={{ color: '#E53E3E' }}>*</span>
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder={dict.register.phonePlaceholder}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '15px',
                                border: `1px solid ${errors.phone ? '#E53E3E' : 'var(--color-border)'}`,
                                borderRadius: 'var(--border-radius-md)',
                                outline: 'none',
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => !errors.phone && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                        />
                        {errors.phone && <p style={{ color: '#E53E3E', fontSize: '13px', marginTop: 'var(--spacing-sm)' }}>{errors.phone}</p>}
                    </div>

                    {/* City */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                            {dict.register.city} <span style={{ color: '#E53E3E' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder={dict.register.cityPlaceholder}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '15px',
                                border: `1px solid ${errors.city ? '#E53E3E' : 'var(--color-border)'}`,
                                borderRadius: 'var(--border-radius-md)',
                                outline: 'none',
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => !errors.city && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                        />
                        {errors.city && <p style={{ color: '#E53E3E', fontSize: '13px', marginTop: 'var(--spacing-sm)' }}>{errors.city}</p>}
                    </div>

                    {/* Institution */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                            {dict.register.institution} <span style={{ color: '#E53E3E' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.institution}
                            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                            placeholder={dict.register.institutionPlaceholder}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '15px',
                                border: `1px solid ${errors.institution ? '#E53E3E' : 'var(--color-border)'}`,
                                borderRadius: 'var(--border-radius-md)',
                                outline: 'none',
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => !errors.institution && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                        />
                        {errors.institution && <p style={{ color: '#E53E3E', fontSize: '13px', marginTop: 'var(--spacing-sm)' }}>{errors.institution}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                            {dict.register.password} <span style={{ color: '#E53E3E' }}>*</span>
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder={dict.register.passwordPlaceholder}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '15px',
                                border: `1px solid ${errors.password ? '#E53E3E' : 'var(--color-border)'}`,
                                borderRadius: 'var(--border-radius-md)',
                                outline: 'none',
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => !errors.password && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                        />
                        {errors.password && <p style={{ color: '#E53E3E', fontSize: '13px', marginTop: 'var(--spacing-sm)' }}>{errors.password}</p>}
                    </div>

                    {/* Education Level */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                            {dict.register.educationLevel} <span style={{ color: '#E53E3E' }}>*</span>
                        </label>
                        <select
                            value={formData.educationLevel}
                            onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '15px',
                                border: `1px solid ${errors.educationLevel ? '#E53E3E' : 'var(--color-border)'}`,
                                borderRadius: 'var(--border-radius-md)',
                                outline: 'none',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => !errors.educationLevel && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                        >
                            <option value="">{dict.register.educationLevelPlaceholder}</option>
                            <option value="PRIMARY">{dict.register.primary}</option>
                            <option value="SECONDARY">{dict.register.secondary}</option>
                            <option value="HIGH_SCHOOL">{dict.register.highSchool}</option>
                        </select>
                        {errors.educationLevel && <p style={{ color: '#E53E3E', fontSize: '13px', marginTop: 'var(--spacing-sm)' }}>{errors.educationLevel}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                            {dict.register.subject} <span style={{ color: '#E53E3E' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder={dict.register.subjectPlaceholder}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '15px',
                                border: `1px solid ${errors.subject ? '#E53E3E' : 'var(--color-border)'}`,
                                borderRadius: 'var(--border-radius-md)',
                                outline: 'none',
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => !errors.subject && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                        />
                        {errors.subject && <p style={{ color: '#E53E3E', fontSize: '13px', marginTop: 'var(--spacing-sm)' }}>{errors.subject}</p>}
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
                        {loading ? (lang === 'ar' ? 'جاري التسجيل...' : lang === 'fr' ? 'Inscription...' : 'Creating Account...') : dict.register.submitButton}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                    {dict.register.alreadyHaveAccount}{' '}
                    <Link href={`/${lang}/login`} style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                        {dict.register.loginLink}
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);

    // Dictionary (simplified for now - can be loaded from files)
    const dict = {
        register: {
            title: lang === 'ar' ? 'إنشاء حساب معلم' : lang === 'fr' ? 'Créer un Compte Enseignant' : 'Create Your Teacher Account',
            subtitle: lang === 'ar' ? 'انضم إلى مجتمع المعلمين المحترفين' : lang === 'fr' ? 'Rejoignez notre communauté d\'éducateurs professionnels' : 'Join our community of professional educators',
            fullName: lang === 'ar' ? 'الاسم الكامل' : lang === 'fr' ? 'Nom Complet' : 'Full Name',
            fullNamePlaceholder: lang === 'ar' ? 'أدخل اسمك الكامل' : lang === 'fr' ? 'Entrez votre nom complet' : 'Enter your full name',
            email: lang === 'ar' ? 'البريد الإلكتروني' : lang === 'fr' ? 'Email' : 'Email Address',
            emailPlaceholder: lang === 'ar' ? 'your.email@example.com' : lang === 'fr' ? 'votre.email@exemple.com' : 'your.email@example.com',
            password: lang === 'ar' ? 'كلمة المرور' : lang === 'fr' ? 'Mot de Passe' : 'Password',
            passwordPlaceholder: lang === 'ar' ? 'على الأقل 8 أحرف' : lang === 'fr' ? 'Minimum 8 caractères' : 'Minimum 8 characters',
            educationLevel: lang === 'ar' ? 'المستوى التعليمي' : lang === 'fr' ? 'Niveau d\'Enseignement' : 'Education Level',
            educationLevelPlaceholder: lang === 'ar' ? 'اختر مستوى التدريس' : lang === 'fr' ? 'Sélectionnez votre niveau' : 'Select your teaching level',
            primary: lang === 'ar' ? 'الابتدائي' : lang === 'fr' ? 'Primaire' : 'Primary School',
            secondary: lang === 'ar' ? 'الإعدادي' : lang === 'fr' ? 'Collège' : 'Secondary School',
            highSchool: lang === 'ar' ? 'الثانوي' : lang === 'fr' ? 'Lycée' : 'High School',
            subject: lang === 'ar' ? 'المادة التي تدرسها' : lang === 'fr' ? 'Matière Enseignée' : 'Subject You Teach',
            subjectPlaceholder: lang === 'ar' ? 'مثال: الرياضيات، العربية، العلوم' : lang === 'fr' ? 'ex: Mathématiques, Arabe, Sciences' : 'e.g., Mathematics, Arabic, Science',
            phone: lang === 'ar' ? 'رقم الهاتف' : lang === 'fr' ? 'Numéro de téléphone' : 'Phone Number',
            phonePlaceholder: lang === 'ar' ? 'مثال: 06 00 00 00 00' : lang === 'fr' ? 'ex: 06 00 00 00 00' : 'e.g., 06 00 00 00 00',
            city: lang === 'ar' ? 'المدينة' : lang === 'fr' ? 'Ville' : 'City',
            cityPlaceholder: lang === 'ar' ? 'مثال: الدار البيضاء' : lang === 'fr' ? 'ex: Casablanca' : 'e.g., Casablanca',
            institution: lang === 'ar' ? 'المؤسسة / المدرسة' : lang === 'fr' ? 'Établissement / École' : 'Institution / School',
            institutionPlaceholder: lang === 'ar' ? 'مثال: ثانوية ابن سينا' : lang === 'fr' ? 'ex: Lycée Ibn Sina' : 'e.g., Lycée Ibn Sina',
            submitButton: lang === 'ar' ? 'إنشاء الحساب' : lang === 'fr' ? 'Créer le Compte' : 'Create Account',
            alreadyHaveAccount: lang === 'ar' ? 'لديك حساب بالفعل؟' : lang === 'fr' ? 'Vous avez déjà un compte ?' : 'Already have an account?',
            loginLink: lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Se connecter' : 'Login here',
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

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#F7FAFC' }}>
            <Header lang={lang} dict={dict} />
            <Suspense fallback={<div>Loading...</div>}>
                <RegisterContent lang={lang} dict={dict} />
            </Suspense>
        </main>
    );
}
