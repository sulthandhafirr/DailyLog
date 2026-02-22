import type { Metadata } from 'next';
import './globals.css';
import DarkModeToggle from '@/components/DarkModeToggle';

export const metadata: Metadata = {
  title: 'Daily Report Generator',
  description: 'Generate professional daily work reports with AI assistance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 transition-colors antialiased">
        <DarkModeToggle />
        {children}
      </body>
    </html>
  );
}
