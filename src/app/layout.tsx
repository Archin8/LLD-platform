import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'LLD Practice Platform — Low-Level Object Oriented System Design',
  description: 'Master Object-Oriented System Design with real-time, rule-based deterministic evaluation feedback.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500 font-medium">
          LLD Practice Platform Prototype • Rule-Based Evaluator Engine
        </footer>
      </body>
    </html>
  );
}
