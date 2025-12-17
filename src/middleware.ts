import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './lib/i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { getToken } from 'next-auth/jwt';

function getLocale(request: NextRequest): string | undefined {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // @ts-ignore
    const locales: string[] = i18n.locales;
    let languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);

    return matchLocale(languages, locales, i18n.defaultLocale);
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // -- 1. Auth Protection --
    const protectedPaths = ['/dashboard', '/admin', '/checkout'];
    const isProtected = protectedPaths.some(path => pathname.includes(path));

    if (isProtected) {
        const token = await getToken({ req: request });
        if (!token) {
            const locale = getLocale(request) || 'en';
            const loginUrl = new URL(`/${locale}/login`, request.url);
            loginUrl.searchParams.set('callbackUrl', request.url);
            return NextResponse.redirect(loginUrl);
        }

        // Role-based protection
        if (pathname.includes('/admin') && token.role !== 'ADMIN') {
            const locale = getLocale(request) || 'en';
            return NextResponse.redirect(new URL(`/${locale}`, request.url));
        }
    }

    // -- 2. i18n Routing --
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);
        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
                request.url
            )
        );
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
