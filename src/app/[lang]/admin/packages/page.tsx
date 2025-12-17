'use client';

import { use } from 'react';
import { Package, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export default function AdminPackagesPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);

    // Dictionary
    const dict = {
        packages: {
            title: lang === 'ar' ? 'إدارة الحزم' : lang === 'fr' ? 'Gestion des packs' : 'Package Management',
            addNew: lang === 'ar' ? 'إضافة حزمة جديدة' : lang === 'fr' ? 'Ajouter un pack' : 'Add New Package',
            comingSoon: lang === 'ar' ? 'قريباً' : lang === 'fr' ? 'Bientôt disponible' : 'Coming Soon',
            description: lang === 'ar' ? 'ستتمكن قريباً من إدارة الحزم والمنتجات من هنا' :
                lang === 'fr' ? 'Vous pourrez bientôt gérer les packs et produits ici' :
                    'You will soon be able to manage packages and products here',
        }
    };

    // Current packages (hardcoded for now)
    const packages = [
        { id: '1', name: lang === 'ar' ? 'الحزمة الأساسية' : 'Essential Package', price: 149, isActive: true },
        { id: '2', name: lang === 'ar' ? 'الحزمة المهنية' : 'Professional Package', price: 249, isActive: true },
        { id: '3', name: lang === 'ar' ? 'حزمة المعلم المتميز' : 'Master Teacher Package', price: 599, isActive: true },
    ];

    return (
        <div>
            <div style={{
                backgroundColor: 'white',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Package size={20} />
                        {dict.packages.title}
                    </h2>

                    <button
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.5, cursor: 'not-allowed' }}
                        disabled
                    >
                        <Plus size={16} />
                        {dict.packages.addNew}
                    </button>
                </div>

                {/* Packages List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 'var(--spacing-md)',
                                backgroundColor: '#F9FAFB',
                                borderRadius: 'var(--border-radius-md)',
                                flexWrap: 'wrap',
                                gap: 'var(--spacing-md)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--color-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Package size={20} color="white" />
                                </div>
                                <div>
                                    <p style={{ fontWeight: '500' }}>{pkg.name}</p>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                                        {pkg.price} MAD
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    backgroundColor: pkg.isActive ? 'rgba(104, 211, 145, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                                    color: pkg.isActive ? 'var(--color-secondary-dark)' : 'var(--color-text-muted)',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    {pkg.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                    {pkg.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'غير نشط' : 'Inactive')}
                                </span>

                                <button
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--border-radius-md)',
                                        padding: '6px 10px',
                                        cursor: 'not-allowed',
                                        opacity: 0.5
                                    }}
                                    disabled
                                >
                                    <Edit size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
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
                        🚧 {dict.packages.comingSoon}
                    </p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                        {dict.packages.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
