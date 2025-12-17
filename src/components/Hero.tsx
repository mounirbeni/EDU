import Link from 'next/link';

export default function Hero({ lang, dict }: { lang: string; dict: any }) {
    return (
        <section
            className="section-spacing"
            style={{
                textAlign: 'center',
                backgroundColor: '#F0F4F8',
                minHeight: 'clamp(500px, 85vh, 700px)',
                display: 'flex',
                alignItems: 'center',
                paddingTop: 'clamp(40px, 10vh, 80px)',
                paddingBottom: 'clamp(40px, 10vh, 80px)'
            }}
        >
            <div className="container" style={{ width: '100%' }}>
                <h1 style={{
                    fontSize: 'var(--font-size-hero)',
                    color: 'var(--color-primary-dark)',
                    lineHeight: '1.2',
                    fontWeight: '700',
                    maxWidth: '900px',
                    margin: '0 auto',
                    marginBottom: 'clamp(20px, 5vh, 32px)'
                }}>
                    {dict.hero.title}
                </h1>
                <p style={{
                    fontSize: 'clamp(15px, 3.5vw, 20px)',
                    maxWidth: 'min(90%, 700px)',
                    margin: '0 auto',
                    marginBottom: 'clamp(32px, 6vh, 48px)',
                    color: 'var(--color-text-muted)',
                    lineHeight: '1.7',
                    fontWeight: '400'
                }}>
                    {dict.hero.description}
                </p>
                <Link
                    href={`/${lang}/register`}
                    className="btn btn-primary"
                    style={{
                        padding: '0 clamp(32px, 8vw, 56px)',
                        fontSize: 'clamp(15px, 3.5vw, 18px)',
                        height: 'clamp(48px, 10vw, 56px)',
                        maxWidth: '400px',
                        margin: '0 auto',
                        display: 'inline-flex'
                    }}
                >
                    {dict.hero.cta}
                </Link>
            </div>
        </section>
    );
}
