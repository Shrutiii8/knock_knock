'use client';

import React, { useState } from 'react';
import { Phone, Mail, Shield, CheckCircle2, ChevronDown, ChevronUp, FileSpreadsheet } from 'lucide-react';
import { IRCTC_CHARGES } from '@/lib/constants';

interface ContactDetailsFormProps {
  mobile: string;
  onChangeMobile: (m: string) => void;
  email: string;
  onChangeEmail: (e: string) => void;
  travelInsurance: boolean;
  onChangeInsurance: (val: boolean) => void;
  autoUpgrade: boolean;
  onChangeAutoUpgrade: (val: boolean) => void;
  gstin: string;
  onChangeGstin: (val: string) => void;
}

export default function ContactDetailsForm({
  mobile,
  onChangeMobile,
  email,
  onChangeEmail,
  travelInsurance,
  onChangeInsurance,
  autoUpgrade,
  onChangeAutoUpgrade,
  gstin,
  onChangeGstin
}: ContactDetailsFormProps) {
  const [showGst, setShowGst] = useState(false);

  return (
    <div className="space-y-4 text-xs">
      {/* Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="border-b border-gray-100 pb-2.5">
          <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
            Contact Information for E-Ticket & SMS
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Your ticket confirmation, coach allocation, and live departure updates will be sent here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
              Mobile Number (SMS Updates) <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-2.5 border border-r-0 border-gray-300 bg-gray-100 text-gray-600 rounded-l font-bold">
                +91
              </span>
              <input
                type="tel"
                value={mobile}
                onChange={e => onChangeMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                className="w-full text-xs font-semibold px-2.5 py-2 border border-gray-300 rounded-r focus:ring-2 focus:ring-[#0A3D62] outline-hidden bg-white text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
              Email ID (Electronic Reservation Slip ERS) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => onChangeEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full text-xs font-semibold px-2.5 py-2 pl-8 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] outline-hidden bg-white text-gray-900"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences & Add-ons */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="border-b border-gray-100 pb-2.5">
          <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
            Booking Preferences & Add-ons
          </h3>
        </div>

        {/* Auto Upgradation */}
        <div className="flex items-start gap-3 p-3 bg-gray-50/70 rounded-md border border-gray-200">
          <input
            type="checkbox"
            id="auto-upgrade"
            checked={autoUpgrade}
            onChange={e => onChangeAutoUpgrade(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-[#0A3D62] focus:ring-[#0A3D62] w-4 h-4 cursor-pointer"
          />
          <label htmlFor="auto-upgrade" className="cursor-pointer select-none">
            <span className="font-bold text-gray-900 block">Consider for Free Auto-Upgradation</span>
            <span className="text-gray-500 text-[11px] block mt-0.5">
              If higher class berths (e.g. 3A to 2A, or SL to 3A) remain vacant at chart preparation, your seat will be automatically upgraded with no extra charge!
            </span>
          </label>
        </div>

        {/* Travel Insurance */}
        <div className="p-3 bg-blue-50/60 rounded-md border border-blue-200/70 space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-700" />
            <span className="font-bold text-gray-900">
              Travel Insurance (₹{IRCTC_CHARGES.TRAVEL_INSURANCE_PER_PASSENGER}/person)
            </span>
          </div>
          <p className="text-[11px] text-gray-600">
            Comprehensive coverage of up to ₹ 10 Lakhs against accidental disability or hospital charges during the journey.
          </p>

          <div className="flex items-center space-x-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
              <input
                type="radio"
                name="travel_insurance"
                checked={travelInsurance}
                onChange={() => onChangeInsurance(true)}
                className="text-[#0A3D62] focus:ring-[#0A3D62]"
              />
              <span>Yes, secure my travel (Recommended)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
              <input
                type="radio"
                name="travel_insurance"
                checked={!travelInsurance}
                onChange={() => onChangeInsurance(false)}
                className="text-[#0A3D62] focus:ring-[#0A3D62]"
              />
              <span>No, I do not want insurance</span>
            </label>
          </div>
        </div>

        {/* Optional GST Details */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowGst(!showGst)}
            className="flex items-center justify-between w-full p-2.5 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-gray-800 font-bold transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#0A3D62]" />
              <span>GST Details for Tax Invoice (Optional)</span>
            </div>
            {showGst ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showGst && (
            <div className="mt-3 p-3 border border-gray-200 rounded-md bg-white animate-in fade-in duration-150">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                GSTIN / Tax ID
              </label>
              <input
                type="text"
                value={gstin}
                onChange={e => onChangeGstin(e.target.value.toUpperCase())}
                placeholder="22AAAAA0000A1Z5"
                className="w-full text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] outline-hidden bg-white text-gray-900"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                GST invoice will be generated in your company&apos;s name for input tax credit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
