'use client';

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import LoginModal from '@/components/modals/LoginModal';
import LanguagePreferenceModal from '@/components/modals/LanguagePreferenceModal';
import ContactUsModal from '@/components/modals/ContactUsModal';

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] text-[#1A1A1A]">
      <div className="no-print">
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />
        <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <LoginModal />
        <LanguagePreferenceModal />
        <ContactUsModal />
      </div>

      <main className="flex-1 w-full">
        {children}
      </main>

      <div className="no-print mt-auto">
        <Footer />
      </div>
    </div>
  );
}
