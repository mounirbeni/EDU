'use client';

import { use, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../../components/Header';
import { ShoppingCart, CreditCard, Building2, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';

export default function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const bundleTier = searchParams.get('bundle') || 'starter';

    const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'CASHPLUS'>('BANK_TRANSFER');
    const [paymentReference, setPaymentReference] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Dictionary
    const dict = {
        checkout: {
            title: lang === 'ar' ? 'إتمام الشراء' : lang === 'fr' ? 'Finaliser la commande' : 'Complete Your Order',
            subtitle: lang === 'ar' ? 'خطوة واحدة للوصول إلى المحتوى' : lang === 'fr' ? 'Une étape pour accéder au contenu' : 'One step away from accessing your content',
            orderSummary: lang === 'ar' ? 'ملخص الطلب' : lang === 'fr' ? 'Résumé de la commande' : 'Order Summary',
            paymentMethod: lang === 'ar' ? 'طريقة الدفع' : lang === 'fr' ? 'Mode de paiement' : 'Payment Method',
            bankTransfer: lang === 'ar' ? 'التحويل البنكي' : lang === 'fr' ? 'Virement bancaire' : 'Bank Transfer',
            cashPlus: lang === 'ar' ? 'كاش بلس' : lang === 'fr' ? 'CashPlus' : 'CashPlus',
            bankDetails: lang === 'ar' ? 'تفاصيل الحساب البنكي' : lang === 'fr' ? 'Détails du compte bancaire' : 'Bank Account Details',
            cashPlusDetails: lang === 'ar' ? 'تفاصيل كاش بلس' : lang === 'fr' ? 'Détails CashPlus' : 'CashPlus Details',
            referenceLabel: lang === 'ar' ? 'رقم التحويل / المرجع' : lang === 'fr' ? 'Numéro de transfert / Référence' : 'Transfer Number / Reference',
            referencePlaceholder: lang === 'ar' ? 'أدخل رقم التحويل بعد الدفع' : lang === 'fr' ? 'Entrez le numéro de transfert après le paiement' : 'Enter transfer number after payment',
            submit: lang === 'ar' ? 'تأكيد الطلب' : lang === 'fr' ? 'Confirmer la commande' : 'Confirm Order',
            processing: lang === 'ar' ? 'جاري المعالجة...' : lang === 'fr' ? 'Traitement...' : 'Processing...',
            successTitle: lang === 'ar' ? 'تم استلام طلبك!' : lang === 'fr' ? 'Commande reçue !' : 'Order Received!',
            successMessage: lang === 'ar' ? 'سنراجع الدفع وسنقوم بتفعيل المحتوى قريباً' : lang === 'fr' ? 'Nous vérifierons le paiement et activerons le contenu bientôt' : 'We will verify your payment and activate your content shortly',
            goToDashboard: lang === 'ar' ? 'الذهاب للوحة التحكم' : lang === 'fr' ? 'Aller au tableau de bord' : 'Go to Dashboard',
            total: lang === 'ar' ? 'المجموع' : lang === 'fr' ? 'Total' : 'Total',
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

    // Bundle info based on tier
    const bundles: Record<string, { name: string; price: number; priceDisplay: string }> = {
        starter: {
            name: lang === 'ar' ? 'الحزمة الأساسية' : lang === 'fr' ? 'Pack Essentiel' : 'Essential Package',
            price: 149,
            priceDisplay: '149 MAD',
        },
        professional: {
            name: lang === 'ar' ? 'الحزمة المهنية' : lang === 'fr' ? 'Pack Professionnel' : 'Professional Package',
            price: 249,
            priceDisplay: '249 MAD',
        },
        complete: {
            name: lang === 'ar' ? 'حزمة المعلم المتميز' : lang === 'fr' ? 'Pack Maître Enseignant' : 'Master Teacher Package',
            price: 599,
            priceDisplay: '599 MAD',
        },
    };

    const selectedBundle = bundles[bundleTier] || bundles.starter;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bundleTier,
                    total: selectedBundle.price,
                    paymentMethod,
                    paymentReference,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to create order');
                setLoading(false);
                return;
            }

            setSuccess(true);
        } catch (err) {
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main style={{ minHeight: '100vh', backgroundColor: '#F7FAFC' }}>
                <Header lang={lang} dict={dict} />
                <div className="container" style={{ paddingTop: 'clamp(60px, 12vh, 100px)', textAlign: 'center' }}>
                    <div style={{
                        maxWidth: '500px',
                        margin: '0 auto',
                        backgroundColor: 'white',
                        padding: 'clamp(32px, 6vw, 48px)',
                        borderRadius: 'var(--border-radius-lg)',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <CheckCircle size={64} color="var(--color-secondary)" style={{ marginBottom: 'var(--spacing-lg)' }} />
                        <h1 style={{ fontSize: '28px', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-md)' }}>
                            {dict.checkout.successTitle}
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)', lineHeight: '1.6' }}>
                            {dict.checkout.successMessage}
                        </p>
                        <button
                            onClick={() => router.push(`/${lang}/dashboard`)}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            {dict.checkout.goToDashboard}
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#F7FAFC' }}>
            <Header lang={lang} dict={dict} />

            <div className="container" style={{ paddingTop: 'clamp(40px, 8vh, 64px)', paddingBottom: 'clamp(40px, 8vh, 64px)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', marginBottom: 'var(--spacing-sm)', textAlign: 'center', color: 'var(--color-primary-dark)' }}>
                        {dict.checkout.title}
                    </h1>
                    <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        {dict.checkout.subtitle}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: 'var(--spacing-lg)' }}>
                        {/* Order Summary */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: 'var(--spacing-lg)',
                            borderRadius: 'var(--border-radius-lg)',
                            boxShadow: 'var(--shadow-md)',
                            height: 'fit-content'
                        }}>
                            <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary-dark)' }}>
                                <ShoppingCart size={20} />
                                {dict.checkout.orderSummary}
                            </h2>

                            <div style={{
                                padding: 'var(--spacing-md)',
                                backgroundColor: 'rgba(43, 108, 176, 0.05)',
                                borderRadius: 'var(--border-radius-md)',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                <p style={{ fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                                    {selectedBundle.name}
                                </p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                                    {lang === 'ar' ? 'وصول مدى الحياة' : lang === 'fr' ? 'Accès à vie' : 'Lifetime Access'}
                                </p>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 'var(--spacing-md)',
                                borderTop: '2px solid var(--color-border)'
                            }}>
                                <span style={{ fontWeight: '600', fontSize: '16px' }}>{dict.checkout.total}</span>
                                <span style={{ fontWeight: '700', fontSize: '24px', color: 'var(--color-primary)' }}>
                                    {selectedBundle.priceDisplay}
                                </span>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: 'var(--spacing-lg)',
                            borderRadius: 'var(--border-radius-lg)',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary-dark)' }}>
                                <CreditCard size={20} />
                                {dict.checkout.paymentMethod}
                            </h2>

                            {error && (
                                <div style={{
                                    padding: 'var(--spacing-md)',
                                    backgroundColor: 'rgba(229, 62, 62, 0.1)',
                                    border: '1px solid #E53E3E',
                                    borderRadius: 'var(--border-radius-md)',
                                    marginBottom: 'var(--spacing-lg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#E53E3E'
                                }}>
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Payment Method Selection */}
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('BANK_TRANSFER')}
                                        style={{
                                            flex: 1,
                                            padding: 'var(--spacing-md)',
                                            border: `2px solid ${paymentMethod === 'BANK_TRANSFER' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                            borderRadius: 'var(--border-radius-md)',
                                            backgroundColor: paymentMethod === 'BANK_TRANSFER' ? 'rgba(43, 108, 176, 0.05)' : 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Building2 size={24} color={paymentMethod === 'BANK_TRANSFER' ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                                        <span style={{ fontSize: '14px', fontWeight: paymentMethod === 'BANK_TRANSFER' ? '600' : '400' }}>
                                            {dict.checkout.bankTransfer}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('CASHPLUS')}
                                        style={{
                                            flex: 1,
                                            padding: 'var(--spacing-md)',
                                            border: `2px solid ${paymentMethod === 'CASHPLUS' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                            borderRadius: 'var(--border-radius-md)',
                                            backgroundColor: paymentMethod === 'CASHPLUS' ? 'rgba(43, 108, 176, 0.05)' : 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Smartphone size={24} color={paymentMethod === 'CASHPLUS' ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                                        <span style={{ fontSize: '14px', fontWeight: paymentMethod === 'CASHPLUS' ? '600' : '400' }}>
                                            {dict.checkout.cashPlus}
                                        </span>
                                    </button>
                                </div>

                                {/* Payment Instructions */}
                                <div style={{
                                    padding: 'var(--spacing-md)',
                                    backgroundColor: '#FEF3C7',
                                    borderRadius: 'var(--border-radius-md)',
                                    marginBottom: 'var(--spacing-lg)',
                                    fontSize: '14px'
                                }}>
                                    <p style={{ fontWeight: '600', marginBottom: '8px' }}>
                                        {paymentMethod === 'BANK_TRANSFER' ? dict.checkout.bankDetails : dict.checkout.cashPlusDetails}:
                                    </p>
                                    {paymentMethod === 'BANK_TRANSFER' ? (
                                        <div style={{ lineHeight: '1.8' }}>
                                            <p><strong>Banque:</strong> Attijariwafa Bank</p>
                                            <p><strong>RIB:</strong> 007 780 0001 234 567 890 123 45</p>
                                            <p><strong>Titulaire:</strong> EDU Platform SARL</p>
                                        </div>
                                    ) : (
                                        <div style={{ lineHeight: '1.8' }}>
                                            <p><strong>Numéro CashPlus:</strong> 0600-000-000</p>
                                            <p><strong>Nom:</strong> EDU Platform</p>
                                        </div>
                                    )}
                                </div>

                                {/* Reference Input */}
                                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '14px', fontWeight: '600' }}>
                                        {dict.checkout.referenceLabel}
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentReference}
                                        onChange={(e) => setPaymentReference(e.target.value)}
                                        placeholder={dict.checkout.referencePlaceholder}
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
                                        opacity: loading ? 0.6 : 1,
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loading ? dict.checkout.processing : dict.checkout.submit}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
