
import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/app-context';
import AppShell from '@/components/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'HADIYA – মানবতার উপহার',
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Cinzel+Decorative:wght@400;700;900&family=Noto+Serif+Bengali:wght@400;700&family=Poppins:wght@400;600;700&family=Montserrat:wght@400;700&family=SolaimanLipi&family=AdorshoLipi&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AppProvider>
            <AppShell>{children}</AppShell>
          </AppProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
