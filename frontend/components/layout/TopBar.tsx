'use client';

import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TopBar() {
  const { t } = useLanguage();
  const [timeStr, setTimeStr] = useState('05-09-2026 | 22:54:06');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const d = String(now.getDate()).padStart(2, '0');
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const y = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${d}-${m}-${y} | ${hh}:${mm}:${ss}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#F58220] text-black text-xs font-semibold py-1.5 px-4 select-none border-b border-[#E07010]">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left Advisory Note */}
        <div className="flex items-center gap-2 text-left leading-tight">
          <span className="w-4 h-4 rounded-full bg-black text-[#F58220] flex items-center justify-center font-bold text-[10px] flex-shrink-0">
            i
          </span>
          <span className="text-[11px] sm:text-xs text-black font-bold">
            {t('travelAdvisory')} <span className="font-medium text-black/90">{t('travelAdvisoryText')}</span>
          </span>
        </div>

        {/* Right Date/Time and Accessibility Font Sizing */}
        <div className="flex items-center space-x-3 text-[11px] font-mono font-bold flex-shrink-0">
          <span>{timeStr}</span>
          <div className="flex items-center space-x-1.5 pl-2 border-l border-black/30 font-sans">
            <button
              type="button"
              className="px-1 hover:bg-black/10 rounded transition-colors text-[10px]"
              title="Decrease font size"
            >
              A-
            </button>
            <button
              type="button"
              className="px-1 hover:bg-black/10 rounded transition-colors text-[11px] font-bold"
              title="Normal font size"
            >
              A
            </button>
            <button
              type="button"
              className="px-1 hover:bg-black/10 rounded transition-colors text-[12px] font-black"
              title="Increase font size"
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
