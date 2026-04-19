import type { Metadata } from 'next';
import { Montserrat, Montserrat_Alternates } from 'next/font/google';
import QueryProvider from '@/providers/QueryProvider';
import ToastProvider from '@/providers/ToastProvider';
import WebVitalsReporter from '@/components/WebVitalsReporter';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat-var',
  subsets: ['latin'],
  display: 'swap',
});

const montserratAlt = Montserrat_Alternates({
  variable: '--font-montserrat-alt-var',
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SAA 2025',
  description: 'Sun Annual Awards 2025',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${montserrat.variable} ${montserratAlt.variable} antialiased`}>
        <QueryProvider>
          <ToastProvider>
            <WebVitalsReporter />
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
