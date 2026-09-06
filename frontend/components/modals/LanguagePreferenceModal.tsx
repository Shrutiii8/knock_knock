'use client';

import React, { useState, useEffect } from 'react';
import { Languages, Check, X, Globe, ShieldCheck } from 'lucide-react';
import { useLanguage, LanguageCode } from '@/context/LanguageContext';

export default function LanguagePreferenceModal() {
  const { language, setLanguage, isLanguageModalOpen, closeLanguageModal } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(language);
  const [rememberChoice, setRememberChoice] = useState(true);

  useEffect(() => {
    if (isLanguageModalOpen) {
      setSelectedLang(language);
    }
  }, [isLanguageModalOpen, language]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isLanguageModalOpen) {
        closeLanguageModal();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLanguageModalOpen, closeLanguageModal]);

  if (!isLanguageModalOpen) return null;

  const handleConfirm = () => {
    setLanguage(selectedLang);
    if (!rememberChoice) {
      try {
        localStorage.removeItem('brctc_language_preference');
      } catch {
        // ignore
      }
    }
    closeLanguageModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[1.5px] animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
      onClick={closeLanguageModal}
    >
      <div 
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200 select-none"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Dark Navy Header matching BRCTC style */}
        <div className="bg-[#213D77] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 id="language-modal-title" className="text-sm font-bold uppercase tracking-wider">
                Select Preferred Language
              </h2>
              <p className="text-[11px] text-blue-200">अपनी पसंदीदा भाषा चुनें</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeLanguageModal}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-gray-600 leading-relaxed">
            Welcome to <strong className="text-gray-900 font-bold">Bharat Railways (BRCTC)</strong> Next Generation eTicketing System. Please choose your primary language for booking tickets and viewing schedules.
          </p>

          {/* Language Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Option 1: English */}
            <div
              onClick={() => setSelectedLang('EN')}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedLang === 'EN'
                  ? 'border-[#213D77] bg-blue-50/50 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-bold text-gray-900 block">English</span>
                  <span className="text-[11px] text-gray-500 mt-0.5 block">English (Default)</span>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  selectedLang === 'EN'
                    ? 'border-[#213D77] bg-[#213D77] text-white'
                    : 'border-gray-300 bg-white'
                }`}>
                  {selectedLang === 'EN' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
              <p className="text-[11px] text-gray-600 mt-3 pt-3 border-t border-gray-100">
                Continue with full English portal and booking workflows.
              </p>
            </div>

            {/* Option 2: Hindi (हिन्दी) */}
            <div
              onClick={() => setSelectedLang('HI')}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedLang === 'HI'
                  ? 'border-[#213D77] bg-blue-50/50 shadow-xs'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-bold text-gray-900 block font-serif">हिन्दी</span>
                  <span className="text-[11px] text-gray-500 mt-0.5 block">Hindi</span>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  selectedLang === 'HI'
                    ? 'border-[#213D77] bg-[#213D77] text-white'
                    : 'border-gray-300 bg-white'
                }`}>
                  {selectedLang === 'HI' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
              <p className="text-[11px] text-gray-600 mt-3 pt-3 border-t border-gray-100">
                टिकट बुकिंग एवं ट्रेन पूछताछ के लिए हिन्दी भाषा चुनें।
              </p>
            </div>

          </div>

          {/* Regional Languages Note */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 flex items-center gap-2.5 text-gray-600 text-xs">
            <Languages className="w-4 h-4 text-[#213D77] flex-shrink-0" />
            <div className="text-[11px] leading-snug">
              <span className="font-semibold text-gray-800">Regional Indian Languages:</span>{' '}
              मराठी, বাংলা, தமிழ், తెలుగు, ગુજરાती will be automatically supported in upcoming releases.
            </div>
          </div>

          {/* Info & Remember Choice */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberChoice}
                onChange={e => setRememberChoice(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#213D77] focus:ring-[#213D77]"
              />
              <span className="text-gray-700 text-[11px]">Remember my preference on this browser</span>
            </label>
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              <span>Can change anytime</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full py-3 bg-[#FB792B] hover:bg-[#E65100] text-white font-extrabold text-xs uppercase tracking-wider rounded transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{selectedLang === 'HI' ? 'जारी रखें / CONTINUE' : 'CONTINUE / आगे बढ़ें'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
