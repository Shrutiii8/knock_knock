'use client';

import React, { useEffect } from 'react';
import { useContactModal } from '@/context/ContactModalContext';

export default function ContactUsModal() {
  const { isContactModalOpen, closeContactModal } = useContactModal();

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isContactModalOpen) {
        closeContactModal();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isContactModalOpen, closeContactModal]);

  if (!isContactModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-[1px] animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={closeContactModal}
    >
      <div
        className="relative bg-white w-full max-w-[720px] shadow-2xl rounded-xs overflow-hidden border border-gray-300 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navy Blue Header Bar matching IRCTC / BRCTC modal style */}
        <div className="bg-[#1E3A6E] text-white px-4 py-2.5 flex items-center justify-between select-none shrink-0">
          <h2 id="contact-modal-title" className="text-[15px] font-bold tracking-tight">
            You may contact us
          </h2>
          <button
            type="button"
            onClick={closeContactModal}
            className="text-white hover:text-gray-200 transition-colors p-0.5 cursor-pointer font-bold text-base leading-none"
            aria-label="Close dialog"
          >
            ✖
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto text-[#111827] text-[13.5px] sm:text-[14px] leading-relaxed select-text space-y-4 font-sans">
          
          {/* Main Headline */}
          <h3 className="text-[18px] sm:text-[21px] font-serif font-bold text-[#111827] leading-snug">
            For Any Queries Related to Railway Tickets Booked via BRCTC
          </h3>

          {/* Section: Customer Support */}
          <div>
            <h4 className="font-bold text-[#111827] text-[14.5px] mb-1">
              Customer Support:
            </h4>
            <p className="text-gray-800">
              Customers can now submit and track queries through the enhanced online BRCTC eQuery interface:
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              {/* Chain link icon */}
              <svg className="w-4 h-4 text-gray-400 rotate-[-45deg] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <a
                href="https://equery.brctc.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0000EE] hover:text-[#0000AA] underline font-bold"
              >
                https://equery.brctc.co.in/
              </a>
            </div>
          </div>

          {/* Cancellation / TDR filing */}
          <p className="text-gray-800">
            In case a passenger faces any problem in cancelling an E-Ticket online or TDR filing, Write to:{' '}
            <a
              href="mailto:etickets@brctc.co.in"
              className="text-[#0000EE] hover:text-[#0000AA] underline font-medium"
            >
              etickets@brctc.co.in
            </a>{' '}
            (from the registered email ID only)
          </p>

          {/* Helpline - Within India */}
          <div className="flex items-start gap-2.5 pt-1">
            <span className="text-[#D81B60] text-lg leading-none mt-0.5">📞</span>
            <div>
              <p className="font-bold text-[#111827]">
                Dial 14646 (Within India)
              </p>
              <p className="text-[12.5px] text-gray-700 mt-1 leading-relaxed">
                Support is available in the following languages:<br />
                Hindi, English, Punjabi, Bengali, Assamese, Odia, Marathi, Gujarati, Tamil, Telugu, Kannada and Malayalam.
              </p>
            </div>
          </div>

          {/* Customer Support Outside India */}
          <div className="pt-1">
            <h4 className="font-bold text-[#111827] text-[14.5px] mb-1">
              Customer Support (Outside India):
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[#D81B60] text-lg leading-none">📞</span>
              <span>
                Call:{' '}
                <a
                  href="tel:+918044647999"
                  className="text-[#0000EE] hover:text-[#0000AA] underline font-bold"
                >
                  +91-8044647999
                </a>
                {' / '}
                <a
                  href="tel:+918035734999"
                  className="text-[#0000EE] hover:text-[#0000AA] underline font-bold"
                >
                  +91-8035734999
                </a>
              </span>
            </div>
          </div>

          {/* B Mudra wallet */}
          <div className="pt-1">
            <p className="text-gray-800">
              For queries related to B Mudra wallet:
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-400 rotate-[-45deg] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <a
                href="https://equery.brctc.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0000EE] hover:text-[#0000AA] underline font-bold"
              >
                https://equery.brctc.co.in/
              </a>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-t border-gray-300 my-4" />

          {/* Loyalty Credit Card Section */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#111827] text-[14.5px]">
              For complaint regarding BRCTC Loyalty credit card, kindly contact as below.
            </h4>
            
            <div className="space-y-1.5 pt-1 text-[13px] sm:text-[13.5px]">
              <p className="font-serif">
                LOYALTY CREDIT CARD:{' '}
                <strong className="font-sans font-bold text-[#111827]">BRCTC-SBI</strong>
              </p>
              <p className="font-serif">
                CONTACT NUMBER:{' '}
                <a
                  href="tel:012439021212"
                  className="text-[#0000EE] hover:text-[#0000AA] underline font-sans font-bold"
                >
                  0124-39021212
                </a>
                {' / '}
                <a
                  href="tel:18001801295"
                  className="text-[#0000EE] hover:text-[#0000AA] underline font-sans font-bold"
                >
                  18001801295
                </a>
              </p>
              <p className="font-serif">
                EMAIL/URL:{' '}
                <a
                  href="mailto:customercare@sbicard.com"
                  className="text-[#0000EE] hover:text-[#0000AA] underline font-sans font-medium"
                >
                  customercare@sbicard.com
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
