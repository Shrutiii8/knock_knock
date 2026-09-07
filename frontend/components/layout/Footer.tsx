'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useContactModal } from '@/context/ContactModalContext';

export default function Footer() {
  const { language } = useLanguage();
  const { openContactModal } = useContactModal();
  const isHindi = language === 'HI';

  // 10 Social Media Links matching user screenshot in exact order and colors
  const SOCIAL_LINKS = [
    {
      id: 'facebook',
      name: 'Facebook',
      bg: '#3B5998',
      url: 'https://www.facebook.com/IRCTCofficial/',
      icon: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      bg: '#25D366',
      url: 'https://wa.me/918750001323',
      icon: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.579 4.187 1.594 5.938l-1.594 5.824 5.956-1.562c1.698.926 3.639 1.454 5.688 1.454 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      id: 'youtube',
      name: 'YouTube',
      bg: '#FF0000',
      url: 'https://www.youtube.com/c/IRCTCOFFICIAL',
      icon: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      id: 'instagram',
      name: 'Instagram',
      bg: '#125688',
      url: 'https://www.instagram.com/irctc.official/',
      icon: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      bg: '#0077B5',
      url: 'https://www.linkedin.com/company/irctcofficial',
      icon: (
        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    {
      id: 'telegram',
      name: 'Telegram',
      bg: '#2CA5E0',
      url: 'https://t.me/IRCTCofficial',
      icon: (
        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      )
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      bg: '#BD081C',
      url: 'https://in.pinterest.com/irctcofficial/',
      icon: (
        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
          <path d="M12 0a12 12 0 0 0-4.37 23.18c-.04-.95-.08-2.42.02-3.46.09-.94.61-4.04.61-4.04s-.15-.31-.15-.78c0-.73.42-1.28.95-1.28.45 0 .66.34.66.74 0 .45-.29 1.13-.44 1.76-.12.53.27.96.79.96 1.15 0 2.03-1.21 2.03-2.96 0-1.55-1.11-2.63-2.7-2.63-1.84 0-2.92 1.38-2.92 2.8 0 .55.21 1.15.48 1.47.05.06.06.12.04.18-.05.2-.16.66-.18.75-.03.11-.09.13-.21.08-.8-.37-1.3-1.54-1.3-2.48 0-2.02 1.47-3.87 4.23-3.87 2.22 0 3.95 1.58 3.95 3.7 0 2.21-1.39 3.98-3.32 3.98-.65 0-1.26-.34-1.47-.73l-.4 1.53c-.15.56-.54 1.27-.81 1.7A12 12 0 1 0 12 0z"/>
        </svg>
      )
    },
    {
      id: 'tumblr',
      name: 'Tumblr',
      bg: '#35465C',
      url: 'https://irctcofficial.tumblr.com/',
      icon: (
        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
          <path d="M14.563 24c-5.093 0-7.031-2.556-7.031-6.685v-7.315H5.063V6.26C8.219 5.344 9.406 2.656 9.531 0h3.5v5.875h4.156v4.125h-4.156v6.656c0 1.906.656 2.719 2.188 2.719h2.094V24h-2.75z"/>
        </svg>
      )
    },
    {
      id: 'koo',
      name: 'Koo',
      bg: '#FAC600',
      url: 'https://www.kooapp.com/profile/IRCTCofficial',
      icon: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#FAC600"/>
          <path d="M12 7c-2.76 0-5 2.24-5 5 0 1.93 1.1 3.6 2.7 4.43l-.45 1.8 1.95-.98c.26.05.53.07.8.07 2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="white"/>
        </svg>
      )
    },
    {
      id: 'twitter',
      name: 'Twitter',
      bg: '#1DA1F2',
      url: 'https://twitter.com/IRCTCofficial',
      icon: (
        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.18 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/>
        </svg>
      )
    }
  ];

  // 5 Columns matching the user's exact IRCTC screenshot
  const FOOTER_COLUMNS = [
    {
      colId: 'col-1',
      items: [
        { label: 'BRCTC Trains', labelHi: 'बीआरसीटीसी ट्रेनें', hasCaret: true, href: '/train-schedule' },
        { label: 'General Information', labelHi: 'सामान्य जानकारी', hasCaret: true, href: '#general-info' },
        { label: 'Important Information', labelHi: 'महत्वपूर्ण जानकारी', hasCaret: true, href: '#important-info' },
        { label: 'Agents', labelHi: 'एजेंट्स', hasCaret: true, href: '#agents' },
        { label: 'Enquiries', labelHi: 'पूछताछ', hasCaret: true, href: '/pnr-status' }
      ]
    },
    {
      colId: 'col-2',
      items: [
        { label: 'How To', labelHi: 'कैसे करें', hasCaret: true, href: '#how-to' },
        { label: 'BRCTC Official App', labelHi: 'बीआरसीटीसी आधिकारिक ऐप', hasCaret: true, href: '#official-app' },
        { label: 'Advertise with us', labelHi: 'हमारे साथ विज्ञापन करें', hasCaret: true, href: '#advertise' },
        { label: 'Refund Rules', labelHi: 'रिफंड नियम', hasCaret: true, href: '/cancel-ticket' },
        { label: 'Person With Disability Facilities', labelHi: 'दिव्यांगजन सुविधाएं', hasCaret: true, href: '#pwd-facilities' }
      ]
    },
    {
      colId: 'col-3',
      items: [
        { label: 'E-Wallet', labelHi: 'ई-वॉलेट', hasCaret: true, href: '/account?tab=wallet' },
        { label: 'BRCTC Co-branded Card Benefits', labelHi: 'बीआरसीटीसी को-ब्रांडेड कार्ड लाभ', hasCaret: true, href: '#cobranded-cards' },
        { label: 'BRCTC-iPAY Payment Gateway', labelHi: 'बीआरसीटीसी-आईपे पेमेंट गेटवे', hasCaret: true, href: '#ipay-gateway' },
        { label: 'BRCTC Zone', labelHi: 'बीआरसीटीसी ज़ोन', hasCaret: true, href: '#irctc-zone' },
        { label: 'DMRC Ticket Booking at BRCTC', labelHi: 'बीआरसीटीसी पर डीएमआरसी टिकट बुकिंग', hasCaret: true, href: '#dmrc-tickets' }
      ]
    },
    {
      colId: 'col-4',
      items: [
        { label: 'For Newly Migrated Agents', labelHi: 'नए माइग्रेट एजेंटों के लिए', hasCaret: true, href: '#migrated-agents' },
        { label: 'Mobile Zone', labelHi: 'मोबाइल ज़ोन', hasCaret: true, href: '#mobile-zone' },
        { label: 'Policies', labelHi: 'नीतियां', hasCaret: true, href: '#policies' },
        { label: 'Ask Disha ChatBot', labelHi: 'दिशा चैटबॉट से पूछें', hasCaret: true, href: '#ask-disha' },
        { label: 'About us', labelHi: 'हमारे बारे में', hasCaret: true, href: '#about-us' }
      ]
    },
    {
      colId: 'col-5',
      items: [
        { label: 'Help & Support', labelHi: 'सहायता एवं समर्थन', hasCaret: false, href: '#help-support' },
        { label: 'E-Pantry', labelHi: 'ई-पेंट्री', hasCaret: true, href: '#epantry' }
      ]
    }
  ];

  return (
    <footer className="w-full select-none text-white font-sans">
      
      {/* 1. TOP SOCIAL NETWORKS BAR: Deep Wine/Plum Purple */}
      <div className="bg-gradient-to-r from-[#4A1D54] via-[#5C2366] to-[#4A1D54] py-2.5 px-4 sm:px-6 lg:px-12 border-b border-[#3B1544]">
        <div className="max-w-[1380px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left Text */}
          <span className="text-[13px] sm:text-[14px] text-white/95 font-medium tracking-wide">
            {isHindi ? 'सोशल नेटवर्क पर हमारे साथ जुड़ें' : 'Get Connected with us on social networks'}
          </span>

          {/* Right: 10 Circular Social Icons */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={item.name}
                aria-label={item.name}
                style={{ backgroundColor: item.bg }}
                className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 shadow-sm"
              >
                {item.icon}
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* 2. MAIN FOOTER LINKS SECTION: Deep Imperial Purple-Indigo */}
      <div className="bg-[#2B1B54] py-8 sm:py-10 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1380px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-6 lg:gap-x-8">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.colId} className="flex flex-col space-y-3 sm:space-y-3.5">
                {column.items.map((item) => {
                  if (item.href === '#help-support') {
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={openContactModal}
                        className="group inline-flex items-center gap-1.5 text-white/95 hover:text-amber-300 font-semibold text-[13px] sm:text-[13.5px] tracking-wide transition-colors cursor-pointer w-fit text-left"
                      >
                        <span>{isHindi ? item.labelHi : item.label}</span>
                        {item.hasCaret && (
                          <ChevronDown className="w-3.5 h-3.5 text-white/80 group-hover:text-amber-300 transition-transform group-hover:translate-y-0.5 stroke-[2.5]" />
                        )}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 text-white/95 hover:text-amber-300 font-semibold text-[13px] sm:text-[13.5px] tracking-wide transition-colors cursor-pointer w-fit"
                    >
                      <span>{isHindi ? item.labelHi : item.label}</span>
                      {item.hasCaret && (
                        <ChevronDown className="w-3.5 h-3.5 text-white/80 group-hover:text-amber-300 transition-transform group-hover:translate-y-0.5 stroke-[2.5]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM WHITE BAR: Trust / Payment Partner Badges & Copyright */}
      <div className="bg-white text-gray-800 py-3.5 px-4 sm:px-6 lg:px-12 border-t border-gray-200">
        <div className="max-w-[1380px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">
          
          {/* Left: Security & Payment Logos matching official IRCTC */}
          <div className="flex items-center flex-wrap justify-center gap-4 sm:gap-6 py-1">
            
            {/* 1. VeriSign */}
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#CC0000" strokeWidth="2.5" />
                <path d="M7 12l3.5 3.5L17 8.5" stroke="#CC0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex items-baseline">
                <span className="font-serif italic font-bold text-gray-900 text-sm tracking-tight">Veri</span>
                <span className="font-serif italic text-red-600 font-semibold text-sm">Sign</span>
              </div>
            </div>

            {/* 2. MasterCard SecureCode */}
            <div className="flex items-center gap-1.5">
              <div className="relative w-6 h-4 flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#EB001B]" />
                <div className="w-4 h-4 rounded-full bg-[#FF5F00] -ml-2 mix-blend-multiply opacity-95" />
              </div>
              <div className="flex flex-col text-[9.5px] leading-tight font-sans">
                <span className="font-bold text-[#222222]">MasterCard.</span>
                <span className="font-semibold text-[#FF5F00]">SecureCode.</span>
              </div>
            </div>

            {/* 3. American Express SafeKey */}
            <div className="flex flex-col border border-gray-300 rounded px-1.5 py-0.5 text-center">
              <span className="text-[7.5px] font-extrabold uppercase tracking-tighter text-[#006FCF]">American Express</span>
              <span className="text-[10px] font-serif font-bold text-[#333333] -mt-0.5">SafeKey</span>
            </div>

            {/* 4. Verified by VISA */}
            <div className="flex items-center gap-1">
              <div className="flex flex-col text-right">
                <span className="text-[8px] font-semibold text-[#1A1F71] leading-none">Verified by</span>
                <span className="text-[13px] font-black italic tracking-tighter text-[#1A1F71] leading-none">VISA</span>
              </div>
            </div>

            {/* 5. RuPay */}
            <div className="flex items-center gap-0.5">
              <span className="text-sm font-black italic tracking-tight text-[#003865]">RuPay</span>
              <div className="flex items-center -space-x-1 ml-0.5">
                <span className="text-xs font-black text-[#00A859]">❯</span>
                <span className="text-xs font-black text-[#F47920]">❯</span>
              </div>
            </div>

            {/* 6. brctctourism.com */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-gray-800">brctc</span>
              <div className="w-4 h-4 rounded-full bg-[#FAC600] flex items-center justify-center border border-gray-300">
                <span className="text-[8px] font-black text-red-600">🚂</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-600">.com</span>
            </div>

            {/* 7. CRIS Logo */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-gray-300">
              <div className="w-5 h-5 rounded-xs bg-[#005DAA] text-white flex items-center justify-center font-black text-[9px] shadow-2xs">
                CRIS
              </div>
              <div className="flex flex-col text-[9px] leading-tight">
                <span className="font-bold text-[#005DAA] tracking-wider">CRIS</span>
                <span className="text-[7.5px] text-gray-500 font-medium">Centre for Railway Info</span>
              </div>
            </div>

          </div>

          {/* Right: Copyright, Hosted by CRIS, and Compatible Browsers */}
          <div className="text-center xl:text-right text-[11px] sm:text-[11.5px] text-gray-700 leading-relaxed font-sans">
            <div>
              {isHindi ? (
                <span>कॉपीराइट © 2026 - www.brctc.co.in। सर्वाधिकार सुरक्षित</span>
              ) : (
                <span>Copyright © 2026 - www.brctc.co.in. All Rights Reserved</span>
              )}
            </div>
            <div className="flex items-center justify-center xl:justify-end gap-1.5 mt-0.5">
              <span>{isHindi ? 'डिज़ाइन और होस्ट किया गया:' : 'Designed and Hosted by'}</span>
              <a
                href="https://www.cris.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#005DAA] hover:underline cursor-pointer"
              >
                CRIS
              </a>
            </div>
            <div className="mt-0.5">
              <a
                href="#compatible-browsers"
                className="font-bold text-gray-900 hover:text-[#005DAA] transition-colors cursor-pointer"
              >
                {isHindi ? 'संगत ब्राउज़र (Compatible Browsers)' : 'Compatible Browsers'}
              </a>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}
