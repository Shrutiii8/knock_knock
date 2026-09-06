'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  QrCode, 
  CreditCard, 
  Building2, 
  Wallet, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import confetti from 'canvas-confetti';

type PaymentTab = 'UPI' | 'CARDS' | 'NET_BANKING' | 'WALLET';

export default function PaymentGateway() {
  const router = useRouter();
  const { currentBooking, createBooking, selectedTrain, selectedClass, passengers, travelInsurance, searchParams } = useBooking();
  const { walletBalance } = useAuth();

  const [activeTab, setActiveTab] = useState<PaymentTab>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('SBI');

  const classObj = selectedTrain?.classes.find(c => c.classCode === selectedClass);
  const baseRate = classObj?.fare || 1750;
  const totalAmount = currentBooking ? currentBooking.totalFare : (baseRate * passengers.length) + 120;

  const handleProcessPayment = async (methodName: string) => {
    setIsProcessing(true);

    const created = await createBooking(methodName);

    // Simulate realistic 1-second banking authorization delay if successful
    setTimeout(() => {
      if (created) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // safe
        }
        setIsProcessing(false);
        router.push('/booking/confirmation');
      } else {
        setIsProcessing(false);
      }
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden text-xs">
      {/* Top Security Banner */}
      <div className="bg-[#0A3D62] text-white px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-400" />
          <h2 className="font-bold text-sm uppercase tracking-wider">
            BRCTC Secure Payment Gateway
          </h2>
        </div>
        <div className="text-[11px] text-green-300 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>256-bit SSL Encrypted</span>
        </div>
      </div>

      {/* Payment Processing Overlay */}
      {isProcessing && (
        <div className="p-12 flex flex-col items-center justify-center space-y-3 bg-white/90">
          <Loader2 className="w-10 h-10 text-[#0A3D62] animate-spin" />
          <h3 className="text-base font-black text-gray-900">Authorizing Payment...</h3>
          <p className="text-xs text-gray-500 text-center max-w-sm">
            Please do not press back or refresh. We are confirming seat reservations with the Bharat Railways Passenger Reservation System (PRS).
          </p>
        </div>
      )}

      {!isProcessing && (
        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Method Selector Tabs (Left Col) */}
          <div className="md:col-span-4 bg-gray-50 border-r border-gray-200 divide-y divide-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('UPI')}
              className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                activeTab === 'UPI'
                  ? 'bg-white font-bold text-[#0A3D62] border-l-4 border-l-[#0A3D62] shadow-2xs'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-[#FF6F00]" />
                <div>
                  <div className="text-xs font-bold">UPI / QR Code</div>
                  <div className="text-[10px] text-gray-500">Google Pay, PhonePe, Paytm</div>
                </div>
              </div>
              <span className="text-[9px] bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded">FAST</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CARDS')}
              className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                activeTab === 'CARDS'
                  ? 'bg-white font-bold text-[#0A3D62] border-l-4 border-l-[#0A3D62] shadow-2xs'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-blue-700" />
                <div>
                  <div className="text-xs font-bold">Credit / Debit Cards</div>
                  <div className="text-[10px] text-gray-500">Visa, Mastercard, RuPay</div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('NET_BANKING')}
              className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                activeTab === 'NET_BANKING'
                  ? 'bg-white font-bold text-[#0A3D62] border-l-4 border-l-[#0A3D62] shadow-2xs'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-indigo-700" />
                <div>
                  <div className="text-xs font-bold">Net Banking</div>
                  <div className="text-[10px] text-gray-500">All Major Indian Banks</div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('WALLET')}
              className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                activeTab === 'WALLET'
                  ? 'bg-white font-bold text-[#0A3D62] border-l-4 border-l-[#0A3D62] shadow-2xs'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="text-xs font-bold">BRCTC e-Wallet</div>
                  <div className="text-[10px] text-amber-700 font-bold">Balance: ₹{walletBalance}</div>
                </div>
              </div>
              <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">1-CLICK</span>
            </button>
          </div>

          {/* Method Active Form Panel (Right Col) */}
          <div className="md:col-span-8 p-6 flex flex-col justify-between">
            {/* Tab: UPI */}
            {activeTab === 'UPI' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                    Instant UPI Payment
                  </h3>
                  <p className="text-[11px] text-gray-500">Zero surcharge with lowest convenience fee</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {/* Mock Dynamic QR Code */}
                  <div className="flex flex-col items-center justify-center p-3 bg-white rounded border border-gray-300">
                    <div className="w-32 h-32 bg-gray-900 p-2 rounded flex flex-col items-center justify-center text-white relative">
                      <div className="w-28 h-28 border-4 border-white border-dashed flex items-center justify-center font-mono text-[9px] text-center p-1">
                        SCAN & PAY
                        <br />
                        {formatCurrency(totalAmount)}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 mt-2 flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-[#0A3D62]" />
                      Scan with any UPI App
                    </span>
                  </div>

                  {/* Or Enter VPA ID */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold text-gray-700">Or Pay using UPI Virtual Payment Address:</div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] outline-hidden bg-white text-gray-900"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map(handle => (
                        <button
                          key={handle}
                          type="button"
                          onClick={() => setUpiId(`user${handle}`)}
                          className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-[10px] font-medium text-gray-700"
                        >
                          {handle}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleProcessPayment('UPI / VPA')}
                  className="w-full py-3 bg-[#FF6F00] hover:bg-[#E65100] text-white font-extrabold text-xs uppercase tracking-wider rounded shadow-md transition-all"
                >
                  PAY {formatCurrency(totalAmount)} VIA UPI
                </button>
              </div>
            )}

            {/* Tab: CARDS */}
            {activeTab === 'CARDS' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                    Credit / Debit Card Details
                  </h3>
                  <p className="text-[11px] text-gray-500">Supports RuPay, Visa, Mastercard, Maestro</p>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8912"
                      className="w-full text-xs font-mono font-bold px-3 py-2 border border-gray-300 rounded bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        defaultValue="08/29"
                        className="w-full text-xs font-mono px-3 py-2 border border-gray-300 rounded bg-white text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        defaultValue="842"
                        className="w-full text-xs font-mono px-3 py-2 border border-gray-300 rounded bg-white text-center"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleProcessPayment('Credit / Debit Card')}
                  className="w-full py-3 bg-[#FF6F00] hover:bg-[#E65100] text-white font-extrabold text-xs uppercase tracking-wider rounded shadow-md transition-all"
                >
                  PAY {formatCurrency(totalAmount)} WITH CARD
                </button>
              </div>
            )}

            {/* Tab: NET BANKING */}
            {activeTab === 'NET_BANKING' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                    Net Banking
                  </h3>
                  <p className="text-[11px] text-gray-500">Select your bank from popular institutions</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB', 'Kotak'].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-3 rounded border text-center font-bold text-xs transition-all ${
                        selectedBank === b
                          ? 'border-[#0A3D62] bg-blue-50 text-[#0A3D62] ring-1 ring-[#0A3D62]'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {b} Bank
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleProcessPayment(`${selectedBank} Net Banking`)}
                  className="w-full py-3 bg-[#FF6F00] hover:bg-[#E65100] text-white font-extrabold text-xs uppercase tracking-wider rounded shadow-md transition-all"
                >
                  PAY {formatCurrency(totalAmount)} VIA NET BANKING
                </button>
              </div>
            )}

            {/* Tab: WALLET */}
            {activeTab === 'WALLET' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                    BRCTC e-Wallet
                  </h3>
                  <p className="text-[11px] text-gray-500">Instant one-click ticket booking with zero payment gateway failures</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700">Available Wallet Balance:</span>
                    <span className="text-base font-black text-amber-700 font-mono">₹{walletBalance}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Ticket Total:</span>
                    <span className="font-bold text-gray-900 font-mono">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="border-t border-amber-200 pt-2 flex items-center justify-between font-bold text-green-700">
                    <span>Balance After Payment:</span>
                    <span className="font-mono">₹{Math.max(0, walletBalance - totalAmount)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleProcessPayment('BRCTC e-Wallet')}
                  className="w-full py-3 bg-[#2E7D32] hover:bg-green-800 text-white font-extrabold text-xs uppercase tracking-wider rounded shadow-md transition-all"
                >
                  PAY {formatCurrency(totalAmount)} FROM WALLET
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
