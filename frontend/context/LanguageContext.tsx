'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, TranslationKey } from '@/lib/translations';

export type LanguageCode = 'EN' | 'HI';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('EN');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('brctc_language_preference') as LanguageCode | null;
      if (saved === 'EN' || saved === 'HI') {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }

    // Always ask language preference as a popup when opening the website
    const timer = setTimeout(() => {
      setIsLanguageModalOpen(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('brctc_language_preference', lang);
    } catch {
      // ignore
    }
  };

  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);

  const t = (key: TranslationKey): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.EN[key] || (key as string);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        openLanguageModal,
        closeLanguageModal,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
