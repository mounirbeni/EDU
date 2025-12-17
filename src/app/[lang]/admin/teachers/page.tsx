'use client';

import { use, useEffect, useState } from 'react';
import { Users, Search, Eye, UserX, UserCheck, X } from 'lucide-react';

interface Teacher {
    id: string;
    name: string;
    email: string;
    educationLevel: string | null;
    subject: string | null;
    phone: string | null;
    city: string | null;
    institution: string | null;
    isActive: boolean;
    createdAt: string;
    _count: {
        orders: number;
    };
}

export default function AdminTeachersPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    // Dictionary
    const dict = {
        teachers: {
            title: lang === 'ar' ? 'إدارة المعلمين' : lang === 'fr' ? 'Gestion des enseignants' : 'Teacher Management',
            search: lang === 'ar' ? 'البحث عن معلم...' : lang === 'fr' ? 'Rechercher un enseignant...' : 'Search teachers...',
            noTeachers: lang === 'ar' ? 'لا توجد معلمين' : lang === 'fr' ? 'Aucun enseignant' : 'No teachers found',
            name: lang === 'ar' ? 'الاسم' : lang === 'fr' ? 'Nom' : 'Name',
            email: lang === 'ar' ? 'البريد الإلكتروني' : lang === 'fr' ? 'Email' : 'Email',
            level: lang === 'ar' ? 'المستوى' : lang === 'fr' ? 'Niveau' : 'Level',
            subject: lang === 'ar' ? 'المادة' : lang === 'fr' ? 'Matière' : 'Subject',
            orders: lang === 'ar' ? 'الطلبات' : lang === 'fr' ? 'Commandes' : 'Orders',
            status: lang === 'ar' ? 'الحالة' : lang === 'fr' ? 'Statut' : 'Status',
            joined: lang === 'ar' ? 'تاريخ التسجيل' : lang === 'fr' ? 'Date d\'inscription' : 'Joined',
            active: lang === 'ar' ? 'نشط' : lang === 'fr' ? 'Actif' : 'Active',
            suspended: lang === 'ar' ? 'موقوف' : lang === 'fr' ? 'Suspendu' : 'Suspended',
            suspend: lang === 'ar' ? 'إيقاف الحساب' : lang === 'fr' ? 'Suspendre' : 'Suspend',
            activate: lang === 'ar' ? 'تفعيل الحساب' : lang === 'fr' ? 'Activer' : 'Activate',
            close: lang === 'ar' ? 'إغلاق' : lang === 'fr' ? 'Fermer' : 'Close',
            view: lang === 'ar' ? 'عرض' : lang === 'fr' ? 'Voir' : 'View',
            phone: lang === 'ar' ? 'الهاتف' : lang === 'fr' ? 'Tél' : 'Phone',
            city: lang === 'ar' ? 'المدينة' : lang === 'fr' ? 'Ville' : 'City',
            institution: lang === 'ar' ? 'المؤسسة' : lang === 'fr' ? 'Établissement' : 'Institution',
        },
        levels: {
            PRIMARY: lang === 'ar' ? 'ابتدائي' : lang === 'fr' ? 'Primaire' : 'Primary',
            SECONDARY: lang === 'ar' ? 'إعدادي' : lang === 'fr' ? 'Collège' : 'Middle School',
            HIGH_SCHOOL: lang === 'ar' ? 'ثانوي' : lang === 'fr' ? 'Lycée' : 'High School',
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await fetch('/api/admin/teachers');
            const data = await res.json();
            if (data.teachers) {
                setTeachers(data.teachers);
            }
        } catch (error) {
            console.error('Failed to fetch teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (teacherId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/teachers/${teacherId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (res.ok) {
                fetchTeachers();
                setSelectedTeacher(null);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filteredTeachers = teachers.filter(t =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phone?.includes(searchTerm)
    );

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
                        <Users size={20} />
                        {dict.teachers.title}
                    </h2>

                    {/* Search */}
                    <div style={{ position: 'relative', minWidth: '250px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder={dict.teachers.search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px 10px 40px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                        {lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}
                    </div>
                ) : filteredTeachers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                        {dict.teachers.noTeachers}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.teachers.name}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.teachers.phone}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.teachers.level}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.teachers.orders}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        {dict.teachers.status}
                                    </th>
                                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeachers.map((teacher) => (
                                    <tr key={teacher.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '16px 12px' }}>
                                            <p style={{ fontWeight: '500', marginBottom: '2px' }}>{teacher.name || '-'}</p>
                                            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{teacher.email}</p>
                                        </td>
                                        <td style={{ padding: '16px 12px', fontSize: '14px' }}>
                                            {teacher.phone || '-'}
                                        </td>
                                        <td style={{ padding: '16px 12px', fontSize: '14px' }}>
                                            {teacher.educationLevel ? (dict.levels[teacher.educationLevel as keyof typeof dict.levels] || teacher.educationLevel) : '-'}
                                        </td>
                                        <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: '600' }}>
                                            {teacher._count.orders}
                                        </td>
                                        <td style={{ padding: '16px 12px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                backgroundColor: teacher.isActive ? 'rgba(104, 211, 145, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                color: teacher.isActive ? 'var(--color-secondary-dark)' : '#EF4444',
                                                fontSize: '13px',
                                                fontWeight: '500'
                                            }}>
                                                {teacher.isActive ? dict.teachers.active : dict.teachers.suspended}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => setSelectedTeacher(teacher)}
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid var(--color-border)',
                                                    borderRadius: 'var(--border-radius-md)',
                                                    padding: '6px 12px',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '13px',
                                                    color: 'var(--color-text-main)',
                                                }}
                                            >
                                                <Eye size={14} />
                                                {dict.teachers.view}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Teacher Details Modal */}
            {selectedTeacher && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: 'var(--spacing-md)'
                    }}
                    onClick={() => setSelectedTeacher(null)}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 'var(--border-radius-lg)',
                            padding: 'var(--spacing-lg)',
                            maxWidth: '500px',
                            width: '100%',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                            <h3 style={{ fontSize: '18px', color: 'var(--color-primary-dark)' }}>
                                {selectedTeacher.name || selectedTeacher.email}
                            </h3>
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={20} color="var(--color-text-muted)" />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.teachers.email}</span>
                                <span style={{ fontWeight: '500' }}>{selectedTeacher.email}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.teachers.level}</span>
                                <span style={{ fontWeight: '500' }}>
                                    {selectedTeacher.educationLevel ? (dict.levels[selectedTeacher.educationLevel as keyof typeof dict.levels] || selectedTeacher.educationLevel) : '-'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.teachers.phone}</span>
                                <span style={{ fontWeight: '500' }}>{selectedTeacher.phone || '-'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.teachers.city}</span>
                                <span style={{ fontWeight: '500' }}>{selectedTeacher.city || '-'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.teachers.institution}</span>
                                <span style={{ fontWeight: '500' }}>{selectedTeacher.institution || '-'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.teachers.subject}</span>
                                <span style={{ fontWeight: '500' }}>{selectedTeacher.subject || '-'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.teachers.orders}</span>
                                <span style={{ fontWeight: '500' }}>{selectedTeacher._count.orders}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.teachers.joined}</span>
                                <span style={{ fontWeight: '500' }}>
                                    {new Date(selectedTeacher.createdAt).toLocaleDateString(
                                        lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US'
                                    )}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{dict.teachers.status}</span>
                                <span style={{
                                    color: selectedTeacher.isActive ? 'var(--color-secondary-dark)' : '#EF4444',
                                    fontWeight: '500'
                                }}>
                                    {selectedTeacher.isActive ? dict.teachers.active : dict.teachers.suspended}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                            >
                                {dict.teachers.close}
                            </button>
                            <button
                                onClick={() => handleToggleStatus(selectedTeacher.id, selectedTeacher.isActive)}
                                className="btn btn-primary"
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    backgroundColor: selectedTeacher.isActive ? '#EF4444' : 'var(--color-secondary)',
                                    borderColor: selectedTeacher.isActive ? '#EF4444' : 'var(--color-secondary)'
                                }}
                            >
                                {selectedTeacher.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                                {selectedTeacher.isActive ? dict.teachers.suspend : dict.teachers.activate}
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}
