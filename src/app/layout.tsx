import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/app-context';
import AppShell from '@/components/app-shell';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Shahid Liyakot Shiriti Songo (Chandgaon)',
  description: 'Non-profit organization management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
