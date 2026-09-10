'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* BRAND NAME ONLY (NO BOX LOGO) */}
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors duration-200">
            LLD Practice
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 group-hover:scale-125 transition-transform duration-200" />
        </Link>

        {/* MINIMALIST NAV LINKS */}
        <nav className="flex items-center gap-6 text-xs font-bold">
          <Link
            href="/"
            className={`transition-all duration-200 py-1 relative ${
              pathname === '/'
                ? 'text-indigo-600 font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Catalog
            {pathname === '/' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
            )}
          </Link>

          <Link
            href="/history"
            className={`transition-all duration-200 py-1 relative ${
              pathname.startsWith('/history')
                ? 'text-indigo-600 font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Attempt History
            {pathname.startsWith('/history') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
