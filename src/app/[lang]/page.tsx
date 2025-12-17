import { getDictionary } from '../../lib/get-dictionary';
import { Locale } from '../../lib/i18n-config';
import Header from '../../components/Header';
import Hero from '../../components/Hero';

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main>
      <Header lang={lang} dict={dict} />
      <Hero lang={lang} dict={dict} />
    </main>
  );
}
