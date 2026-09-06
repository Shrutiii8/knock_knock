'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginModal() {
  const router = useRouter();
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpOption, setOtpOption] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isLoginModalOpen) {
        closeLoginModal();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoginModalOpen, closeLoginModal]);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter User Name');
      return;
    }
    await login(username, password);
  };

  const handleRegisterClick = () => {
    closeLoginModal();
    router.push('/register');
  };

  const handleAgentLoginClick = async () => {
    await login('agent_shruti', 'password123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeLoginModal}
      />

      {/* Modal Dialog Card matching the exact screenshot */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="relative bg-white shadow-2xl w-full max-w-[375px] sm:max-w-[390px] border border-gray-300 z-10 animate-in zoom-in-95 duration-150 select-none overflow-hidden"
      >
        {/* Top-Right Square Navy Close Button */}
        <button
          type="button"
          onClick={closeLoginModal}
          className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#213D77] hover:bg-[#182F5D] text-white flex items-center justify-center rounded-[2px] transition-colors cursor-pointer z-20"
          aria-label="Close login dialog"
        >
          <X className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        {/* Main Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 pb-4">
          
          {/* Centered LOGIN Title with Navy Underline */}
          <div className="text-center pt-1 mb-5">
            <h2 
              id="login-modal-title" 
              className="text-[#213D77] font-black text-[22px] sm:text-[23px] tracking-wider uppercase font-sans inline-block"
            >
              LOGIN
            </h2>
            <div className="w-[72px] h-[2.5px] bg-[#213D77] mx-auto mt-0.5" />
          </div>

          {/* Unified Light Blue Input Block */}
          <div className="bg-[#EBF3FC] border border-[#D5E5F7] rounded-[2px] overflow-hidden mb-3">
            
            {/* Top Field: Username */}
            <div className="border-b border-white">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="User Name"
                autoComplete="username"
                className="w-full px-3.5 py-2.5 text-[14px] font-bold text-gray-950 bg-transparent focus:outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Bottom Field: Password with Eye Icon */}
            <div className="flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className={`w-full px-3.5 py-2.5 text-[14px] font-bold text-gray-950 bg-transparent focus:outline-none placeholder:text-gray-400 ${
                  !showPassword ? 'tracking-[0.2em]' : 'tracking-normal'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3 text-[#5A6D87] hover:text-[#213D77] cursor-pointer transition-colors flex-shrink-0"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* FORGOT ACCOUNT DETAILS? Link */}
          <div className="mb-3 text-left">
            <button
              type="button"
              onClick={() => alert('Forgot Account Details: Please use your registered Mobile Number or Email ID on the official portal to recover your credentials.')}
              className="text-[#1A5276] hover:text-[#0A3D62] font-bold text-[11px] sm:text-[11.5px] tracking-wide uppercase hover:underline cursor-pointer"
            >
              FORGOT ACCOUNT DETAILS?
            </button>
          </div>

          {/* Visually Impaired OTP Option Checkbox */}
          <div className="flex items-start gap-2.5 mb-4 text-left select-none">
            <input
              type="checkbox"
              id="otpOptionCheckbox"
              checked={otpOption}
              onChange={(e) => setOtpOption(e.target.checked)}
              className="w-4 h-4 rounded-[2px] border border-[#B0CEF2] bg-[#E8F2FC] accent-[#213D77] cursor-pointer mt-0.5 flex-shrink-0"
            />
            <label
              htmlFor="otpOptionCheckbox"
              className="text-[#1C3B6E] font-bold text-[11px] sm:text-[11.5px] leading-tight cursor-pointer font-serif"
            >
              Visually impaired users may select this option to receive OTP instead of CAPTCHA
            </label>
          </div>

          {/* SIGN IN Button: Rich Deep Orange */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#D85820] hover:bg-[#C04914] text-white font-extrabold text-[14px] sm:text-[14.5px] tracking-wide uppercase rounded-[4px] shadow-2xs transition-colors cursor-pointer mb-1"
          >
            SIGN IN
          </button>

        </form>

        {/* Bottom Navigation Buttons: REGISTER & AGENT LOGIN */}
        <div className="border-t border-gray-200 p-3 pt-2.5 bg-white">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleRegisterClick}
              className="w-full py-2 bg-[#213D77] hover:bg-[#182F5D] text-white font-bold text-[12px] sm:text-[12.5px] tracking-wider uppercase text-center rounded-[2px] transition-colors cursor-pointer"
            >
              REGISTER
            </button>
            <button
              type="button"
              onClick={handleAgentLoginClick}
              className="w-full py-2 bg-[#213D77] hover:bg-[#182F5D] text-white font-bold text-[12px] sm:text-[12.5px] tracking-wider uppercase text-center rounded-[2px] transition-colors cursor-pointer"
            >
              AGENT LOGIN
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
