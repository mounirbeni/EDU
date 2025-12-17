import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Removing default fonts
import "../../styles/globals.css";
import { i18n } from "../../lib/i18n-config";

export const metadata: Metadata = {
  title: "Educational Platform",
  description: "Learn and grow.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

import AuthProvider from "../../components/AuthProvider";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
