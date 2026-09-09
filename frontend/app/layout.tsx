import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { BookingProvider } from '@/context/BookingContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ContactModalProvider } from '@/context/ContactModalContext';
import AppLayoutClient from '@/components/layout/AppLayoutClient';

export const metadata: Metadata = {
  title: 'BRCTC Next Generation eTicketing System - Bharat Railways',
  description: 'Pixel-faithful frontend clone of the Bharat Railway Catering and Tourism Corporation (BRCTC) passenger reservation system showcasing responsive layout, search workflows, and booking architecture.',
  keywords: 'BRCTC, Bharat Railways, Train Ticket Booking, PNR Status, Train Schedule, Live Status, Reservation'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#F5F7FA]" suppressHydrationWarning>
        <ToastProvider>
          <LanguageProvider>
            <AuthProvider>
              <BookingProvider>
                <ContactModalProvider>
                  <AppLayoutClient>{children}</AppLayoutClient>
                </ContactModalProvider>
              </BookingProvider>
            </AuthProvider>
          </LanguageProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
