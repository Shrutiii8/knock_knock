'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, 
  Train, 
  User, 
  FileText, 
  Calendar, 
  Activity, 
  LayoutGrid, 
  Wallet, 
  LogOut, 
  HelpCircle,
  Phone,
  ShieldCheck,
  Globe,
  UtensilsCrossed,
  Bell,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useContactModal } from '@/context/ContactModalContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { user, isLoggedIn, openLoginModal, openRegisterModal, logout, walletBalance } = useAuth();
  const { language, openLanguageModal } = useLanguage();
  const { openContactModal } = useContactModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        
        {/* Drawer Header */}
        <div className="bg-[#0A3D62] text-white p-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2">
            <Train className="w-6 h-6 text-[#FF6F00]" />
            <div>
              <div className="font-bold text-base leading-tight">BRCTC</div>
              <div className="text-[10px] text-blue-200">Bharat Railway Catering & Tourism</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Status Card in Drawer */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          {isLoggedIn && user ? (
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A3D62] text-white font-bold flex items-center justify-center text-sm">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{user.fullName}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200 text-xs">
                <span className="text-gray-600">BRCTC e-Wallet:</span>
                <span className="font-bold text-[#FF6F00]">₹{walletBalance}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-600 mb-1">Sign in to manage bookings, check wallet & more</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    openLoginModal();
                  }}
                  className="w-full py-2 bg-[#0A3D62] text-white text-xs font-bold rounded uppercase tracking-wider text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onClose();
                    openRegisterModal();
                  }}
                  className="w-full py-2 bg-[#FB792B] hover:bg-[#E65100] text-white text-xs font-bold rounded uppercase tracking-wider text-center transition-colors"
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-2 divide-y divide-gray-100 text-xs font-semibold text-gray-700">
          <div className="py-2">
            <Link
              href="/"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 ${pathname === '/' ? 'text-[#0A3D62] font-bold bg-blue-50' : ''}`}
            >
              <Train className="w-4 h-4 text-[#0A3D62]" />
              <span>Book Ticket / Search</span>
            </Link>

            <Link
              href="/search-results"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 ${pathname === '/search-results' ? 'text-[#0A3D62] font-bold bg-blue-50' : ''}`}
            >
              <LayoutGrid className="w-4 h-4 text-[#0A3D62]" />
              <span>Train Search Results</span>
            </Link>

            <Link
              href="/pnr-status"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 ${pathname === '/pnr-status' ? 'text-[#0A3D62] font-bold bg-blue-50' : ''}`}
            >
              <FileText className="w-4 h-4 text-[#0A3D62]" />
              <span>PNR Status Enquiry</span>
            </Link>

            <Link
              href="/train-schedule"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 ${pathname === '/train-schedule' ? 'text-[#0A3D62] font-bold bg-blue-50' : ''}`}
            >
              <Calendar className="w-4 h-4 text-[#0A3D62]" />
              <span>Train Timetable / Schedule</span>
            </Link>

            <Link
              href="/live-status"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 ${pathname === '/live-status' ? 'text-[#0A3D62] font-bold bg-blue-50' : ''}`}
            >
              <Activity className="w-4 h-4 text-[#0A3D62]" />
              <span>Live Train Running Status</span>
            </Link>

            <Link
              href="/meals"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 ${pathname === '/meals' ? 'text-[#0A3D62] font-bold bg-blue-50' : ''}`}
            >
              <UtensilsCrossed className="w-4 h-4 text-[#0A3D62]" />
              <span>Meals & Catering</span>
            </Link>

            <Link
              href="/alerts"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 ${pathname === '/alerts' ? 'text-[#0A3D62] font-bold bg-blue-50' : ''}`}
            >
              <Bell className="w-4 h-4 text-[#0A3D62]" />
              <span>Alerts & Updates</span>
            </Link>

            <Link
              href="/feedback"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 ${pathname === '/feedback' ? 'text-[#0A3D62] font-bold bg-blue-50' : ''}`}
            >
              <Star className="w-4 h-4 text-[#0A3D62]" />
              <span>Feedback</span>
            </Link>
          </div>

          {isLoggedIn && (
            <div className="py-2">
              <Link
                href="/account?tab=history"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100"
              >
                <FileText className="w-4 h-4 text-gray-500" />
                <span>Booking History</span>
              </Link>
              <Link
                href="/account?tab=wallet"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100"
              >
                <Wallet className="w-4 h-4 text-gray-500" />
                <span>BRCTC e-Wallet</span>
              </Link>
              <Link
                href="/account?tab=profile"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100"
              >
                <User className="w-4 h-4 text-gray-500" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                onClose();
                openLanguageModal();
              }}
              className="w-full flex items-center justify-between py-2 px-3 mb-3 bg-white rounded border border-gray-200 text-xs font-semibold text-gray-800 hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#213D77]" />
                <span>Language / भाषा:</span>
              </div>
              <span className="font-bold text-[#213D77]">{language === 'EN' ? 'English' : 'हिन्दी'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                openContactModal();
              }}
              className="w-full flex items-center justify-between py-2 px-3 bg-white rounded border border-gray-200 text-xs font-semibold text-gray-800 hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer mb-2"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0A3D62]" />
                <span>Contact Us / Helpline</span>
              </div>
              <span className="font-bold text-[#FB792B]">14646</span>
            </button>

            <div className="flex items-center gap-2 text-gray-600 text-[11px] px-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#0A3D62]" />
              <span>care@brctc.co.in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
