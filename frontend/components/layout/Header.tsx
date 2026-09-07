'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  ChevronRight, 
  CheckCircle2, 
  Train, 
  Menu, 
  X,
  ChevronDown,
  UserCheck,
  UserCircle,
  Eye,
  Phone,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useContactModal } from '@/context/ContactModalContext';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export default function Header({ onOpenMobileNav }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout, openLoginModal } = useAuth();
  const { language, openLanguageModal, t } = useLanguage();
  const { openContactModal } = useContactModal();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [profileSubmenuOpen, setProfileSubmenuOpen] = useState(false);
  const [isClickOpen, setIsClickOpen] = useState(false);
  const [clockStr, setClockStr] = useState('05-Sep-2026 [23:06:41]');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleAccountDropdown = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    if (accountDropdownOpen) {
      setAccountDropdownOpen(false);
      setIsClickOpen(false);
      setProfileSubmenuOpen(false);
    } else {
      setAccountDropdownOpen(true);
      setIsClickOpen(true);
    }
  };

  const handleAccountMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setAccountDropdownOpen(true);
  };

  const handleAccountMouseLeave = () => {
    if (isClickOpen) return; // If user opened via click, do NOT close on mouse move!
    dropdownTimeoutRef.current = setTimeout(() => {
      setAccountDropdownOpen(false);
      setProfileSubmenuOpen(false);
    }, 250);
  };

  const handleProfileMouseEnter = () => {
    if (profileTimeoutRef.current) {
      clearTimeout(profileTimeoutRef.current);
      profileTimeoutRef.current = null;
    }
    setProfileSubmenuOpen(true);
  };

  const handleProfileMouseLeave = () => {
    profileTimeoutRef.current = setTimeout(() => {
      setProfileSubmenuOpen(false);
    }, 250);
  };

  // TRAINS Dropdown handlers
  const [trainsDropdownOpen, setTrainsDropdownOpen] = useState(false);
  const [isTrainsClickOpen, setIsTrainsClickOpen] = useState(false);
  const [brctcSubmenuOpen, setBrctcSubmenuOpen] = useState(false);
  const trainsRef = useRef<HTMLDivElement>(null);
  const trainsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const brctcTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleTrainsDropdown = () => {
    if (trainsTimeoutRef.current) {
      clearTimeout(trainsTimeoutRef.current);
      trainsTimeoutRef.current = null;
    }
    if (trainsDropdownOpen) {
      setTrainsDropdownOpen(false);
      setIsTrainsClickOpen(false);
      setBrctcSubmenuOpen(false);
    } else {
      setTrainsDropdownOpen(true);
      setIsTrainsClickOpen(true);
    }
  };

  const handleTrainsMouseEnter = () => {
    if (trainsTimeoutRef.current) {
      clearTimeout(trainsTimeoutRef.current);
      trainsTimeoutRef.current = null;
    }
    setTrainsDropdownOpen(true);
  };

  const handleTrainsMouseLeave = () => {
    if (isTrainsClickOpen) return;
    trainsTimeoutRef.current = setTimeout(() => {
      setTrainsDropdownOpen(false);
      setBrctcSubmenuOpen(false);
    }, 250);
  };

  const handleBrctcMouseEnter = () => {
    if (brctcTimeoutRef.current) {
      clearTimeout(brctcTimeoutRef.current);
      brctcTimeoutRef.current = null;
    }
    setBrctcSubmenuOpen(true);
  };

  const handleBrctcMouseLeave = () => {
    brctcTimeoutRef.current = setTimeout(() => {
      setBrctcSubmenuOpen(false);
    }, 250);
  };

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = now.toLocaleString('en-US', { month: 'short' });
      const year = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setClockStr(`${day}-${month}-${year} [${hh}:${mm}:${ss}]`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
        setIsClickOpen(false);
        setProfileSubmenuOpen(false);
      }
      if (trainsRef.current && !trainsRef.current.contains(event.target as Node)) {
        setTrainsDropdownOpen(false);
        setIsTrainsClickOpen(false);
        setBrctcSubmenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 select-none shadow-xs">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between gap-4">
        
        {/* Far Left: Bharat Railways Official Circular Emblem */}
        <Link href="/" className="flex items-center flex-shrink-0 group" title="Bharat Railways">
          <div className="w-12 h-12 rounded-full border border-[#213D77] p-0.5 flex items-center justify-center bg-white shadow-2xs group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer Blue Ring */}
              <circle cx="50" cy="50" r="48" fill="#1C356C" stroke="#1C356C" strokeWidth="1" />
              {/* Inner White Rim */}
              <circle cx="50" cy="50" r="43" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="32" fill="#1C356C" stroke="#FFFFFF" strokeWidth="1.2" />
              {/* Decorative Stars */}
              <circle cx="16" cy="50" r="1.5" fill="#FFD700" />
              <circle cx="84" cy="50" r="1.5" fill="#FFD700" />
              {/* Top arc text: BHARAT RAILWAYS */}
              <path id="textArcTop" d="M 18,50 A 32,32 0 1,1 82,50" fill="none" />
              <text fill="#FFFFFF" fontSize="6.5" fontWeight="bold" letterSpacing="0.8">
                <textPath href="#textArcTop" startOffset="50%" textAnchor="middle">BHARAT RAILWAYS</textPath>
              </text>
              {/* Bottom arc text: भारत रेल */}
              <path id="textArcBottom" d="M 82,50 A 32,32 0 0,1 18,50" fill="none" />
              <text fill="#FFFFFF" fontSize="7" fontWeight="bold">
                <textPath href="#textArcBottom" startOffset="50%" textAnchor="middle">भारत रेल</textPath>
              </text>
              {/* Center White Disc with Train Emblem */}
              <circle cx="50" cy="50" r="23" fill="#FFFFFF" />
              <path d="M40 53 h20 v-3 h-2 v-5 c0-2-2-3.5-4-3.5 h-8 c-2 0-4 1.5-4 3.5 v5 h-2 z" fill="#1C356C" />
              <circle cx="44" cy="55" r="2.8" fill="#1C356C" />
              <circle cx="56" cy="55" r="2.8" fill="#1C356C" />
              <circle cx="50" cy="55" r="2.2" fill="#1C356C" />
              <rect x="42" y="44.5" width="6.5" height="3.5" fill="#FFFFFF" rx="0.5" />
              <rect x="51.5" y="44.5" width="6.5" height="3.5" fill="#FFFFFF" rx="0.5" />
              <circle cx="50" cy="39" r="1.8" fill="#FFD700" />
              <path d="M48 35 h4 v3 h-4 z" fill="#1C356C" />
            </svg>
          </div>
        </Link>

        {/* Center: Perfectly Centered Nav Block (Top Greeting/Time + Bottom Nav Links) */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-1.5 px-2">
          
          {/* Top Row: Timestamp, Accessibility, Language (and Welcome greeting if logged in) */}
          <div className="hidden sm:flex items-center space-x-2 text-[12px] text-gray-900 leading-none">
            {/* If Logged In: Welcome Greeting with Green Checkmark */}
            {isLoggedIn && user && (
              <>
                <div className="flex items-center gap-1 text-gray-900">
                  <span className="font-normal text-gray-700">{t('welcome')}</span>
                  <span className="font-bold text-gray-900">{user.fullName} ({user.username})</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 fill-green-100 ml-0.5 inline-block" />
                </div>
                <span className="text-gray-300 font-light mx-1">|</span>
              </>
            )}

            {/* Date & Time */}
            <div className="font-bold text-gray-900 tracking-tight">
              {clockStr}
            </div>

            <span className="text-gray-300 font-light mx-1">|</span>

            {/* Font Accessibility Toggles: A - | A | A + */}
            <div className="flex items-center space-x-1.5 text-[12px] text-gray-900 font-bold">
              <button type="button" className="hover:text-blue-700 px-0.5 cursor-pointer">
                A <sup className="text-[9px] font-bold">-</sup>
              </button>
              <span className="text-gray-300 font-light">|</span>
              <button type="button" className="hover:text-blue-700 px-0.5 cursor-pointer font-bold">
                A
              </button>
              <span className="text-gray-300 font-light">|</span>
              <button type="button" className="hover:text-blue-700 px-0.5 cursor-pointer">
                A <sup className="text-[9px] font-bold">+</sup>
              </button>
            </div>

            <span className="text-gray-300 font-light mx-1">|</span>

            {/* Language Hindi/English */}
            <button
              type="button"
              onClick={openLanguageModal}
              className="text-[12px] font-bold text-gray-900 hover:text-blue-700 cursor-pointer"
              title="Change Language Preference / भाषा बदलें"
            >
              {language === 'EN' ? 'हिंदी' : 'English'}
            </button>
          </div>

          {/* Bottom Row: Main Navigation Links - Pixel-perfect aligned baseline and height */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-4.5 text-[12px] font-bold uppercase tracking-wider text-gray-900">
            {/* Home Icon */}
            <Link href="/" className="h-[28px] flex items-center justify-center text-gray-600 hover:text-[#213D77] px-0.5 transition-colors" title="Home">
              <svg className="w-4 h-4 fill-gray-600 hover:fill-[#213D77]" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>

            {/* If NOT logged in: Solid Dark Navy 'LOGIN / REGISTER' button matching Screenshot */}
            {!isLoggedIn ? (
              <div className="h-[28px] bg-[#213D77] text-white px-3 rounded-[2px] text-[12px] font-bold tracking-wider uppercase transition-colors shadow-2xs flex items-center gap-1 leading-none">
                <button
                  type="button"
                  onClick={() => openLoginModal()}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                  title={language === 'HI' ? 'लॉगिन' : 'LOGIN'}
                >
                  {language === 'HI' ? 'लॉगिन' : 'LOGIN'}
                </button>
                <span className="text-white/60 font-light mx-0.5">/</span>
                <Link
                  href="/register"
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                  title={language === 'HI' ? 'रजिस्टर' : 'REGISTER'}
                >
                  {language === 'HI' ? 'रजिस्टर' : 'REGISTER'}
                </Link>
              </div>
            ) : (
              /* If Logged In: MY ACCOUNT Dropdown */
              <div 
                className="relative h-[28px] flex items-center" 
                ref={dropdownRef}
                onMouseEnter={handleAccountMouseEnter}
                onMouseLeave={handleAccountMouseLeave}
              >
                <button
                  type="button"
                  onClick={toggleAccountDropdown}
                  className={`h-full flex items-center gap-1 transition-colors cursor-pointer tracking-wider border-b-2 leading-none ${accountDropdownOpen ? 'text-[#FB792B] border-[#FB792B]' : 'hover:text-[#FB792B] border-transparent'}`}
                >
                  <span>{t('myAccount')}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {accountDropdownOpen && (
                  <div className="absolute left-0 top-full pt-1.5 z-50">
                    <div className="w-56 bg-white border border-gray-200 rounded shadow-2xl py-1 text-xs text-gray-800 font-semibold animate-in fade-in duration-100">
                      
                      {/* My Profile with Sub-options */}
                      <div 
                        className="relative group/profile"
                        onMouseEnter={handleProfileMouseEnter}
                        onMouseLeave={handleProfileMouseLeave}
                      >
                        <div className="flex items-center justify-between hover:bg-gray-100 border-b border-gray-100 pr-2">
                          <Link
                            href="/account?tab=profile&sub=view"
                            onClick={() => {
                              setAccountDropdownOpen(false);
                              setIsClickOpen(false);
                              setProfileSubmenuOpen(false);
                            }}
                            className="flex-1 flex items-center gap-2 px-3.5 py-2 text-gray-800 hover:text-[#213D77] transition-colors"
                          >
                            <UserCircle className="w-4 h-4 text-[#213D77]" />
                            <span>{t('myProfile')}</span>
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setProfileSubmenuOpen(!profileSubmenuOpen);
                            }}
                            className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                            title="Toggle Sub Options"
                          >
                            <ChevronRight className={`w-3.5 h-3.5 text-gray-500 transition-transform ${profileSubmenuOpen ? 'rotate-90 sm:rotate-0' : ''}`} />
                          </button>
                        </div>

                        {/* Profile Sub-Options Flyout Menu with seamless hover bridge */}
                        {profileSubmenuOpen && (
                          <div className="sm:absolute sm:left-full sm:top-0 sm:pl-1.5 z-50">
                            <div className="sm:w-56 bg-white sm:border sm:border-gray-200 sm:rounded sm:shadow-2xl py-1 text-xs text-gray-800 font-medium pl-3 sm:pl-0 border-b sm:border-b-0 border-gray-100 bg-gray-50/80 sm:bg-white animate-in fade-in duration-150">
                              <Link
                                href="/account?tab=profile&sub=view"
                                onClick={() => {
                                  setAccountDropdownOpen(false);
                                  setIsClickOpen(false);
                                  setProfileSubmenuOpen(false);
                                }}
                                className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-blue-50 hover:text-[#213D77] transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600" />
                                <span>{t('viewProfile')}</span>
                              </Link>
                              <Link
                                href="/account?tab=profile&sub=contact"
                                onClick={() => {
                                  setAccountDropdownOpen(false);
                                  setIsClickOpen(false);
                                  setProfileSubmenuOpen(false);
                                }}
                                className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-blue-50 hover:text-[#213D77] transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-green-600" />
                                <span>{t('updateContact')}</span>
                              </Link>
                              <Link
                                href="/account?tab=profile&sub=password"
                                onClick={() => {
                                  setAccountDropdownOpen(false);
                                  setIsClickOpen(false);
                                  setProfileSubmenuOpen(false);
                                }}
                                className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-blue-50 hover:text-[#213D77] transition-colors"
                              >
                                <Lock className="w-3.5 h-3.5 text-amber-600" />
                                <span>{t('changePassword')}</span>
                              </Link>
                              <Link
                                href="/account?tab=profile&sub=aadhaar"
                                onClick={() => {
                                  setAccountDropdownOpen(false);
                                  setIsClickOpen(false);
                                  setProfileSubmenuOpen(false);
                                }}
                                className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-blue-50 hover:text-[#213D77] transition-colors"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                                <span>{t('aadhaarVerification')}</span>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>

                      <Link
                        href="/account?tab=history"
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          setIsClickOpen(false);
                          setProfileSubmenuOpen(false);
                        }}
                        className="flex items-center justify-between px-3.5 py-2 hover:bg-gray-100 border-b border-gray-100"
                      >
                        <span>{t('myBookings')}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </Link>

                      <Link
                        href="/account?tab=passengers"
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          setIsClickOpen(false);
                          setProfileSubmenuOpen(false);
                        }}
                        className="flex items-center justify-between px-3.5 py-2 hover:bg-gray-100 border-b border-gray-100"
                      >
                        <span>{t('savedPassengers')}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </Link>

                      <div className="flex items-center justify-between px-3.5 py-2 hover:bg-gray-100 border-b border-gray-100 text-gray-800">
                        <span>Authenticate User</span>
                        <CheckCircle2 className="w-4 h-4 text-green-600 fill-green-100" />
                      </div>

                      <Link
                        href="/#feedback"
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          setIsClickOpen(false);
                          setProfileSubmenuOpen(false);
                        }}
                        className="block px-3.5 py-2 hover:bg-gray-100 border-b border-gray-100"
                      >
                        Feedback
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          setIsClickOpen(false);
                          setProfileSubmenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TRAINS Dropdown (Active Bold Red with Red Underline, matching screenshot) */}
            <div
              ref={trainsRef}
              className="relative inline-flex items-center"
              onMouseEnter={handleTrainsMouseEnter}
              onMouseLeave={handleTrainsMouseLeave}
            >
              <button
                type="button"
                onClick={toggleTrainsDropdown}
                className="h-[28px] flex items-center text-[#ED1C24] border-b-2 border-[#ED1C24] tracking-wider font-extrabold leading-none cursor-pointer focus:outline-none"
              >
                {t('trains')}
              </button>

              {trainsDropdownOpen && (
                <div className="absolute top-full left-0 pt-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Upward pointing orange triangle pointer matching screenshot directly under TRAINS */}
                  <div className="pl-5 -mb-[1px]">
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[#FB792B]" />
                  </div>

                  <div className="w-[235px] bg-white rounded-none border-t-2 border-t-[#FB792B] border-x border-b border-gray-200 py-0.5 text-[13px] text-[#222222] font-bold normal-case tracking-normal shadow-xl">
                    {/* 1. Book Ticket */}
                    <Link
                      href="/"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                    >
                      {t('bookTicketItem')}
                    </Link>

                    {/* 2. Foreign Tourist Booking */}
                    <Link
                      href="/foreign-tourist-booking"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                    >
                      {t('foreignTouristBooking')}
                    </Link>

                    {/* 3. Connecting Journey Booking */}
                    <Link
                      href="/connecting-journey-booking"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                    >
                      {t('connectingJourneyBooking')}
                    </Link>

                    {/* 4. BRCTC TRAINS (with flyout submenu) */}
                    <div
                      className="relative border-b border-gray-200"
                      onMouseEnter={handleBrctcMouseEnter}
                      onMouseLeave={handleBrctcMouseLeave}
                    >
                      <Link
                        href="/brctc-trains"
                        onClick={() => {
                          setTrainsDropdownOpen(false);
                          setIsTrainsClickOpen(false);
                          setBrctcSubmenuOpen(false);
                        }}
                        className="flex items-center justify-between px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] transition-colors"
                      >
                        <span className="font-bold text-[#222222]">{t('brctcTrains')}</span>
                        <span className="text-[9px] text-[#222222] ml-1">▶</span>
                      </Link>

                      {/* BRCTC Submenu Flyout */}
                      {brctcSubmenuOpen && (
                        <div
                          className="absolute left-full top-0 pl-1.5 z-50"
                          onMouseEnter={handleBrctcMouseEnter}
                          onMouseLeave={handleBrctcMouseLeave}
                        >
                          <div className="w-52 bg-white rounded-none shadow-2xl border-t-2 border-t-[#213D77] border-x border-b border-gray-200 py-0.5 text-[13px] text-[#222222] font-bold normal-case tracking-normal">
                            <Link
                              href="/brctc-trains#vande-bharat"
                              onClick={() => {
                                setTrainsDropdownOpen(false);
                                setIsTrainsClickOpen(false);
                                setBrctcSubmenuOpen(false);
                              }}
                              className="block px-3.5 py-2 hover:bg-blue-50 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                            >
                              {t('vandeBharat')}
                            </Link>
                            <Link
                              href="/brctc-trains#tejas-express"
                              onClick={() => {
                                setTrainsDropdownOpen(false);
                                setIsTrainsClickOpen(false);
                                setBrctcSubmenuOpen(false);
                              }}
                              className="block px-3.5 py-2 hover:bg-blue-50 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                            >
                              {t('tejasExpress')}
                            </Link>
                            <Link
                              href="/brctc-trains#bharat-gaurav"
                              onClick={() => {
                                setTrainsDropdownOpen(false);
                                setIsTrainsClickOpen(false);
                                setBrctcSubmenuOpen(false);
                              }}
                              className="block px-3.5 py-2 hover:bg-blue-50 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                            >
                              {t('bharatGaurav')}
                            </Link>
                            <Link
                              href="/brctc-trains#maharajas-express"
                              onClick={() => {
                                setTrainsDropdownOpen(false);
                                setIsTrainsClickOpen(false);
                                setBrctcSubmenuOpen(false);
                              }}
                              className="block px-3.5 py-2 hover:bg-blue-50 hover:text-[#213D77] transition-colors"
                            >
                              {t('maharajasExpress')}
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 5. Cancel E-Ticket */}
                    <Link
                      href="/cancel-ticket"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                    >
                      {t('cancelETicket')}
                    </Link>

                    {/* 6. PNR Enquiry */}
                    <Link
                      href="/pnr-status"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                    >
                      {t('pnrEnquiry')}
                    </Link>

                    {/* 7. Train Schedule */}
                    <Link
                      href="/train-schedule"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                    >
                      {t('trainScheduleItem')}
                    </Link>

                    {/* 8. Track Your Train */}
                    <Link
                      href="/live-status"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                    >
                      {t('trackYourTrain')}
                    </Link>

                    {/* 9. FTR Coach/Train Booking */}
                    <Link
                      href="/ftr-booking"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                    >
                      {t('ftrBooking')}
                    </Link>

                    {/* 10. Luggage Booking */}
                    <Link
                      href="/luggage-booking"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                    >
                      {t('luggageBooking')}
                    </Link>

                    {/* 11. Dogs/Cats Booking */}
                    <Link
                      href="/pet-booking"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                    >
                      {t('petBooking')}
                    </Link>

                    {/* 12. Link Your Aadhaar */}
                    <Link
                      href="/account?tab=profile&sub=aadhaar"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                    >
                      {t('linkYourAadhaar')}
                    </Link>

                    {/* 13. Counter Ticket Cancellation */}
                    <Link
                      href="/counter-ticket-cancellation"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] border-b border-gray-200 transition-colors"
                    >
                      {t('counterTicketCancel')}
                    </Link>

                    {/* 14. Counter Ticket Boarding Point Change */}
                    <Link
                      href="/counter-ticket-boarding-change"
                      onClick={() => {
                        setTrainsDropdownOpen(false);
                        setIsTrainsClickOpen(false);
                      }}
                      className="block px-3.5 py-2 hover:bg-gray-100 hover:text-[#213D77] transition-colors leading-tight"
                    >
                      {t('counterTicketBoarding')}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* MEALS (Text matching screenshot, aligned with border-b-2 transparent) */}
            <a
              href="#meals"
              className="h-[28px] flex items-center text-gray-900 hover:text-[#FB792B] border-b-2 border-transparent tracking-wider transition-colors leading-none"
            >
              {t('meals')}
            </a>

            {/* Upto 10% Cashback (Solid Dark Navy Block Button matching screenshot) */}
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  openLoginModal('/account');
                } else {
                  router.push('/account');
                }
              }}
              className="h-[28px] bg-[#213D77] hover:bg-[#182F5D] text-white px-3.5 rounded-[2px] text-[12px] font-bold tracking-normal normal-case transition-colors shadow-2xs cursor-pointer flex items-center justify-center leading-none"
            >
              {language === 'HI' ? '10% तक कैशबैक' : 'Upto 10% Cashback'}
            </button>

            {/* E-WALLET (Orange Underline, perfectly aligned height & baseline) */}
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  openLoginModal('/account?tab=wallet');
                } else {
                  router.push('/account?tab=wallet');
                }
              }}
              className="h-[28px] flex items-center border-b-2 border-[#FB792B] text-gray-900 hover:text-[#FB792B] tracking-wider cursor-pointer font-bold leading-none"
            >
              {t('eWallet')}
            </button>

            {/* ALERTS */}
            <Link 
              href="/pnr-status" 
              className="h-[28px] flex items-center text-gray-900 hover:text-[#FB792B] border-b-2 border-transparent tracking-wider leading-none"
            >
              {t('alerts')}
            </Link>

            {/* OTHER SERVICES */}
            <a 
              href="#services" 
              className="h-[28px] flex items-center text-gray-900 hover:text-[#FB792B] border-b-2 border-transparent tracking-wider leading-none"
            >
              {t('otherServices')}
            </a>

            {/* CONTACT US */}
            <button
              type="button"
              onClick={openContactModal}
              className="h-[28px] flex items-center text-gray-900 hover:text-[#FB792B] border-b-2 border-transparent tracking-wider leading-none cursor-pointer"
            >
              {t('contactUs')}
            </button>
          </nav>
        </div>

        {/* Far Right: Official BRCTC Logo Emblem */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/" className="flex flex-col items-center group" title="BRCTC">
            <div className="w-12 h-12 flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 80 62" className="w-11 h-9">
                {/* Stylized BRCTC Circular Arch in Navy & Orange */}
                <path d="M22 10 A24 24 0 1 1 66 38" fill="none" stroke="#1C356C" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M60 46 A24 24 0 0 1 18 32" fill="none" stroke="#FB792B" strokeWidth="4" strokeLinecap="round" />
                {/* Central Stylized B */}
                <path d="M30 17 h12 c4 0 7 2 7 5.5 c0 2.4-1.4 4.2-3.5 4.8 c2.6 0.8 4.5 2.7 4.5 5.7 c0 3.8-3.2 6-8 6 h-12 z M36 22 v5 h5 c1.8 0 3-0.8 3-2.5 s-1.2-2.5-3-2.5 z M36 31 v5.5 h5.5 c2.2 0 3.5-0.9 3.5-2.8 s-1.3-2.7-3.5-2.7 z" fill="#1C356C" />
              </svg>
              <span className="text-[11px] font-black text-[#1C356C] tracking-tighter leading-none mt-0.5">BRCTC</span>
            </div>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="p-1.5 lg:hidden text-gray-700 hover:bg-gray-100 rounded"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}
