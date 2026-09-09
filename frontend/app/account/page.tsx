'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { useToast } from '@/context/ToastContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  UserCircle, 
  Ticket, 
  Wallet, 
  Users, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  Printer, 
  XCircle, 
  ArrowRight,
  CreditCard,
  Building,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  KeyRound,
  Smartphone,
  MapPin,
  Check,
  Shield,
  Edit3
} from 'lucide-react';
import Link from 'next/link';

type AccountTab = 'profile' | 'history' | 'wallet' | 'passengers';
type ProfileSubTab = 'view' | 'contact' | 'password' | 'aadhaar';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = (searchParams.get('tab') as AccountTab) || 'history';
  const urlSub = (searchParams.get('sub') as ProfileSubTab) || 'view';

  const { 
    user, 
    isLoggedIn, 
    isAuthLoading,
    openLoginModal, 
    walletBalance, 
    rechargeWallet, 
    savedPassengers, 
    addSavedPassenger, 
    removeSavedPassenger,
    updateUser 
  } = useAuth();
  const { bookings, cancelBooking } = useBooking();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<AccountTab>(urlTab);
  const [profileSubTab, setProfileSubTab] = useState<ProfileSubTab>(urlSub);

  // New saved passenger form state
  const [newPName, setNewPName] = useState('');
  const [newPAge, setNewPAge] = useState(30);
  const [newPGender, setNewPGender] = useState<'M' | 'F' | 'T'>('M');
  const [newPBerth, setNewPBerth] = useState<'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'WS' | 'NONE'>('LB');

  // Wallet recharge state
  const [rechargeAmt, setRechargeAmt] = useState(1000);

  // Form states for Contact Details
  const [editEmail, setEditEmail] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editPincode, setEditPincode] = useState('');

  // Form states for Password
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Aadhaar linking state
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [aadhaarVerified, setAadhaarVerified] = useState(true);

  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  useEffect(() => {
    if (urlSub) {
      setProfileSubTab(urlSub);
    }
  }, [urlSub]);

  useEffect(() => {
    if (user) {
      setEditEmail(user.email || '');
      setEditMobile(user.mobile || '');
      setEditAddress(user.address || '');
      setEditCity(user.city || '');
      setEditState(user.state || '');
      setEditPincode(user.pincode || '');
    }
  }, [user]);

  const handleSubTabChange = (sub: ProfileSubTab) => {
    setProfileSubTab(sub);
    router.replace(`/account?tab=profile&sub=${sub}`, { scroll: false });
  };

  const handleTabChange = (tab: AccountTab) => {
    setActiveTab(tab);
    if (tab === 'profile') {
      router.replace(`/account?tab=profile&sub=${profileSubTab}`, { scroll: false });
    } else {
      router.replace(`/account?tab=${tab}`, { scroll: false });
    }
  };

  const handleUpdateContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmail.trim() || !editMobile.trim()) {
      showToast('error', 'Fields Required', 'Please provide valid email and mobile number.');
      return;
    }
    updateUser({
      email: editEmail,
      mobile: editMobile,
      address: editAddress,
      city: editCity,
      state: editState,
      pincode: editPincode
    });
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPass) {
      showToast('error', 'Password Required', 'Please enter your current password.');
      return;
    }
    if (newPass.length < 8) {
      showToast('error', 'Weak Password', 'New password must be at least 8 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('error', 'Mismatch', 'New password and confirm password do not match.');
      return;
    }
    showToast('success', 'Password Changed', 'Your BRCTC account password has been updated securely.');
    setCurrPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleSendAadhaarOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = aadhaarInput.replace(/\s/g, '');
    if (clean.length !== 12 || isNaN(Number(clean))) {
      showToast('error', 'Invalid Aadhaar', 'Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setAadhaarOtpSent(true);
    showToast('info', 'OTP Sent', 'A 6-digit verification OTP has been sent to your Aadhaar-registered mobile.');
  };

  const handleVerifyAadhaarOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarOtp.trim().length < 4) {
      showToast('error', 'Invalid OTP', 'Please enter the OTP received on your mobile.');
      return;
    }
    setAadhaarVerified(true);
    setAadhaarOtpSent(false);
    setAadhaarInput('');
    setAadhaarOtp('');
    showToast('success', 'Aadhaar Verified', 'Your Aadhaar is verified with UIDAI. Tatkal priority and 24 tickets/month enabled!');
  };

  const handleAddPassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPName.trim()) {
      showToast('error', 'Name Required', 'Please enter full passenger name.');
      return;
    }
    addSavedPassenger({
      name: newPName,
      age: newPAge,
      gender: newPGender,
      berthPreference: newPBerth,
      foodPreference: 'VEG'
    });
    setNewPName('');
  };

  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rechargeWallet(rechargeAmt);
  };

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.replace('/');
      openLoginModal('/account');
    }
  }, [isAuthLoading, isLoggedIn, openLoginModal, router]);

  if (isAuthLoading) {
    return (
      <div className="py-20 text-center select-none space-y-3 max-w-md mx-auto">
        <div className="w-8 h-8 border-3 border-[#0A3D62] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-gray-500">Loading your account...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-10 text-center max-w-md mx-auto space-y-4 shadow-sm text-xs mt-6">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0A3D62] flex items-center justify-center mx-auto border border-blue-200">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-gray-900">Sign In to Access Your Account</h2>
        <p className="text-gray-500">
          View your confirmed ticket bookings, download reservation slips, check wallet balance and manage your Master Passenger List.
        </p>
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => openLoginModal('/account')}
            className="w-full py-2.5 bg-[#0A3D62] hover:bg-[#072B45] text-white font-bold rounded uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
          >
            SIGN IN WITH BRCTC ID
          </button>
          <Link
            href="/"
            className="block py-2 text-gray-600 hover:text-[#0A3D62] font-semibold text-xs transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs max-w-5xl mx-auto">
      {/* Account Overview Header */}
      <div className="bg-[#0A3D62] text-white rounded-lg p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-500 text-white font-black text-xl flex items-center justify-center shadow">
            {user?.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black">{user?.fullName}</h1>
              <span className="bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" /> VERIFIED
              </span>
            </div>
            <div className="text-[11px] text-blue-200 mt-0.5">
              User ID: <span className="font-mono text-white font-bold">{user?.username}</span> • {user?.email}
            </div>
          </div>
        </div>

        <div className="bg-white/10 px-4 py-2.5 rounded-lg border border-white/20 text-right">
          <span className="text-[10px] text-blue-200 uppercase font-bold block">BRCTC e-Wallet</span>
          <span className="text-xl font-black text-amber-300 font-mono">₹{walletBalance}</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-gray-200 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'history', label: 'Booking History', icon: Ticket },
          { id: 'wallet', label: 'BRCTC e-Wallet', icon: Wallet },
          { id: 'passengers', label: 'Master Passenger List', icon: Users },
          { id: 'profile', label: 'My Profile', icon: UserCircle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as AccountTab)}
              className={`flex items-center gap-2 px-4 py-2.5 font-bold uppercase tracking-wider text-xs rounded-t-lg transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#FB792B] text-[#213D77] bg-white font-extrabold shadow-2xs'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Booking History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Past & Upcoming Train Reservations ({bookings.length})
            </h2>
            <Link
              href="/"
              className="text-xs font-bold text-[#213D77] hover:underline flex items-center gap-1"
            >
              <span>+ Book New Journey</span>
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              No tickets booked yet.
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => {
                const isCancelled = booking.bookingStatus === 'CANCELLED';
                return (
                  <div
                    key={booking.id}
                    className={`bg-white rounded-lg border ${
                      isCancelled ? 'border-red-200 bg-red-50/20' : 'border-gray-200'
                    } p-5 shadow-sm space-y-4`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-[#213D77] text-white px-2 py-0.5 rounded text-xs">
                            PNR: {booking.pnrNumber}
                          </span>
                          <span className="font-extrabold text-sm text-gray-900">
                            {booking.trainNumber} - {booking.trainName}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1">
                          Booked on {new Date(booking.bookedAt).toLocaleDateString()} • Class: {booking.selectedClass} • Quota: {booking.quota}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          isCancelled
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-3 rounded border border-gray-200">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block">FROM</span>
                        <div className="font-bold text-gray-800">{booking.fromStationName} ({booking.fromStation})</div>
                        <div className="text-[11px] text-gray-500">{formatDate(booking.journeyDate)} • {booking.departureTime}</div>
                      </div>

                      <div className="sm:text-center">
                        <span className="text-[10px] text-gray-500 uppercase font-bold block">PASSENGERS</span>
                        <div className="font-bold text-gray-800">{booking.passengers.length} Passenger{booking.passengers.length > 1 ? 's' : ''}</div>
                        <div className="text-[11px] text-gray-500">
                          {booking.passengers.map(p => `${p.name} (${p.allottedSeat?.coach || 'B2'}-${p.allottedSeat?.berth || 34})`).join(', ')}
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-[10px] text-gray-500 uppercase font-bold block">TO</span>
                        <div className="font-bold text-gray-800">{booking.toStationName} ({booking.toStation})</div>
                        <div className="text-[11px] text-gray-500">Arr: {booking.arrivalTime}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="font-bold text-gray-800 text-xs">
                        Total Amount: <span className="text-gray-900 font-mono font-extrabold">{formatCurrency(booking.totalFare)}</span>
                        {isCancelled && booking.cancellationRefund && (
                          <span className="text-green-700 ml-2">(Refund: {formatCurrency(booking.cancellationRefund)})</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/booking/confirmation`}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded flex items-center gap-1 transition-colors text-xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View Ticket</span>
                        </Link>

                        {!isCancelled && (
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm(`Are you sure you want to cancel PNR ${booking.pnrNumber}? Cancellation refund will be credited.`)) {
                                await cancelBooking(booking.pnrNumber);
                              }
                            }}
                            className="px-3 py-1.5 border border-red-300 hover:bg-red-50 text-red-700 font-bold rounded flex items-center gap-1 transition-colors text-xs"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel Ticket</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BRCTC e-Wallet */}
      {activeTab === 'wallet' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">BRCTC e-Wallet Services</h2>
              <p className="text-gray-500 text-[11px]">Instant 1-Click payment without payment gateway failures during Tatkal hours.</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 uppercase block font-bold">Current Balance</span>
              <span className="text-2xl font-black text-[#213D77] font-mono">₹{walletBalance}</span>
            </div>
          </div>

          <form onSubmit={handleRechargeSubmit} className="space-y-4 max-w-md bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide">Top-up Wallet Balance</h3>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Recharge Amount (₹)</label>
              <div className="flex gap-2">
                {[500, 1000, 2000, 5000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRechargeAmt(amt)}
                    className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors ${
                      rechargeAmt === amt
                        ? 'bg-[#213D77] text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#FB792B] hover:bg-[#E65100] text-white font-bold rounded uppercase text-xs transition-colors shadow-xs cursor-pointer"
            >
              Add ₹{rechargeAmt} to Wallet
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Master Passenger List */}
      {activeTab === 'passengers' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-gray-200 pb-3">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Master Passenger List ({savedPassengers.length})
            </h2>
            <p className="text-gray-500 text-[11px]">
              Pre-saved passengers are automatically available during booking for ultra-fast Tatkal checkout.
            </p>
          </div>

          <form onSubmit={handleAddPassengerSubmit} className="bg-gray-50 p-4 rounded border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide">Add New Passenger</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newPName}
                  onChange={e => setNewPName(e.target.value)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Age</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={newPAge}
                  onChange={e => setNewPAge(parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Gender</label>
                <select
                  value={newPGender}
                  onChange={e => setNewPGender(e.target.value as any)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="T">Transgender</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Berth Preference</label>
                <select
                  value={newPBerth}
                  onChange={e => setNewPBerth(e.target.value as any)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                >
                  <option value="LB">Lower Berth (LB)</option>
                  <option value="MB">Middle Berth (MB)</option>
                  <option value="UB">Upper Berth (UB)</option>
                  <option value="SL">Side Lower (SL)</option>
                  <option value="WS">Window Seat (WS)</option>
                  <option value="NONE">No Preference</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-[#213D77] hover:bg-[#182F5D] text-white font-bold rounded uppercase tracking-wider text-xs transition-colors cursor-pointer"
            >
              Save Passenger
            </button>
          </form>

          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 uppercase text-xs">Saved Travelers ({savedPassengers.length})</h3>
            <div className="border border-gray-200 rounded divide-y divide-gray-200">
              {savedPassengers.map((p, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <span className="font-bold text-gray-900 text-sm">{p.name}</span>
                    <span className="text-gray-500 text-xs ml-2">
                      ({p.age} yrs • {p.gender === 'M' ? 'Male' : 'Female'} • Berth: {p.berthPreference})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSavedPassenger(idx)}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    title="Delete from list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: My Profile with Sub-Options Navigation */}
      {activeTab === 'profile' && user && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden space-y-0">
          
          {/* Sub-Options Top Navigation Pills */}
          <div className="bg-gray-50 border-b border-gray-200 p-3 sm:px-6 flex flex-wrap items-center gap-2">
            {[
              { id: 'view', label: 'View Profile', icon: UserCircle },
              { id: 'contact', label: 'Update Contact Details', icon: Phone },
              { id: 'password', label: 'Change Password', icon: Lock },
              { id: 'aadhaar', label: 'Aadhaar Verification', icon: ShieldCheck }
            ].map(sub => {
              const SubIcon = sub.icon;
              const isSubActive = profileSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSubTabChange(sub.id as ProfileSubTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all cursor-pointer ${
                    isSubActive
                      ? 'bg-[#213D77] text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:text-[#213D77]'
                  }`}
                >
                  <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-white' : 'text-gray-500'}`} />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            
            {/* SUB-OPTION 1: View Profile */}
            {profileSubTab === 'view' && (
              <div className="space-y-6">
                
                {/* User Summary Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#213D77] text-white font-black text-xl flex items-center justify-center shadow-md">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-extrabold text-gray-900">{user.fullName}</h2>
                        <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Aadhaar Verified
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        BRCTC ID: <span className="font-mono font-bold text-[#213D77]">{user.username}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSubTabChange('contact')}
                      className="px-3.5 py-1.5 bg-white border border-gray-300 hover:border-[#213D77] text-gray-800 hover:text-[#213D77] rounded font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#213D77]" />
                      <span>Edit Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubTabChange('password')}
                      className="px-3.5 py-1.5 bg-white border border-gray-300 hover:border-[#213D77] text-gray-800 hover:text-[#213D77] rounded font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Change Password</span>
                    </button>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-gray-50 rounded border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Full Legal Name</span>
                    <span className="font-extrabold text-gray-900 text-sm">{user.fullName}</span>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">BRCTC User ID</span>
                    <span className="font-mono font-extrabold text-gray-900 text-sm">{user.username}</span>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Email Address</span>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-semibold text-gray-900 text-xs">{user.email}</span>
                      <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 py-0.2 rounded">Verified</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Mobile Phone</span>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-semibold text-gray-900 text-xs">+91 {user.mobile}</span>
                      <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 py-0.2 rounded">Verified</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Gender</span>
                    <span className="font-semibold text-gray-900 text-xs">
                      {user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : 'Transgender'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Date of Birth</span>
                    <span className="font-semibold text-gray-900 text-xs">{user.dob || '15/06/1992'}</span>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded border border-gray-200 sm:col-span-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Residential Address</span>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="font-semibold text-gray-900 text-xs">
                        {user.address}, {user.city}, {user.state} - {user.pincode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Aadhaar Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900 text-xs">Aadhaar Linked & Verified with UIDAI</h4>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Your account is verified. You can book up to 24 tickets per month and enjoy priority Tatkal booking.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubTabChange('aadhaar')}
                    className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold rounded text-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    View Status
                  </button>
                </div>
              </div>
            )}

            {/* SUB-OPTION 2: Update Contact Details */}
            {profileSubTab === 'contact' && (
              <form onSubmit={handleUpdateContactSubmit} className="space-y-5 max-w-2xl">
                <div className="border-b border-gray-200 pb-2">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Update Contact & Address Information
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Ensure your phone and email are valid to receive SMS notifications and PNR updates.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded font-medium focus:ring-1 focus:ring-[#213D77] focus:border-[#213D77]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Mobile Number *</label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={editMobile}
                        onChange={e => setEditMobile(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded font-medium focus:ring-1 focus:ring-[#213D77] focus:border-[#213D77]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Address Line *</label>
                    <input
                      type="text"
                      required
                      value={editAddress}
                      onChange={e => setEditAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-medium focus:ring-1 focus:ring-[#213D77] focus:border-[#213D77]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">City / Town *</label>
                    <input
                      type="text"
                      required
                      value={editCity}
                      onChange={e => setEditCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-medium focus:ring-1 focus:ring-[#213D77] focus:border-[#213D77]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={editState}
                      onChange={e => setEditState(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-medium focus:ring-1 focus:ring-[#213D77] focus:border-[#213D77]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={editPincode}
                      onChange={e => setEditPincode(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-medium focus:ring-1 focus:ring-[#213D77] focus:border-[#213D77]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#FB792B] hover:bg-[#E65100] text-white font-bold rounded text-xs transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Contact Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubTabChange('view')}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* SUB-OPTION 3: Change Password */}
            {profileSubTab === 'password' && (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-5 max-w-md">
                <div className="border-b border-gray-200 pb-2">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Change BRCTC Password
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Your password must be at least 8 characters long and kept confidential.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Current Password *</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        required
                        value={currPass}
                        onChange={e => setCurrPass(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-medium focus:ring-1 focus:ring-[#213D77] focus:border-[#213D77]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">New Password *</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={newPass}
                        onChange={e => setNewPass(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-medium focus:ring-1 focus:ring-[#213D77] focus:border-[#213D77]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Confirm New Password *</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        required
                        value={confirmPass}
                        onChange={e => setConfirmPass(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-medium focus:ring-1 focus:ring-[#213D77] focus:border-[#213D77]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="showPassToggle"
                      checked={showPass}
                      onChange={e => setShowPass(e.target.checked)}
                      className="w-3.5 h-3.5 text-[#213D77] rounded cursor-pointer"
                    />
                    <label htmlFor="showPassToggle" className="text-xs text-gray-600 select-none cursor-pointer">
                      Show passwords
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#213D77] hover:bg-[#182F5D] text-white font-bold rounded text-xs transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            )}

            {/* SUB-OPTION 4: Aadhaar Verification */}
            {profileSubTab === 'aadhaar' && (
              <div className="space-y-6 max-w-2xl">
                <div className="border-b border-gray-200 pb-2">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Aadhaar Verification & e-KYC Status
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Link and verify your Aadhaar with UIDAI to unlock higher booking quotas and Tatkal priority.
                  </p>
                </div>

                {aadhaarVerified ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-emerald-900 text-sm">Aadhaar Linked: XXXX-XXXX-4821</h4>
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            ACTIVE
                          </span>
                        </div>
                        <p className="text-xs text-emerald-700 mt-0.5">
                          Verified with Unique Identification Authority of India (UIDAI) on 12-Jan-2024.
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-emerald-200 pt-3 space-y-2 text-xs text-emerald-900">
                      <div className="font-bold uppercase text-[11px] tracking-wider text-emerald-800">Enabled Features:</div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Monthly reservation quota expanded to <strong>24 tickets</strong> (standard accounts get 12).</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Priority Tatkal opening window access enabled from 10:00 AM AC / 11:00 AM Non-AC.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Saved Master Passengers pre-verified for seamless boarding without physical ID cards.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-amber-600" />
                      <div>
                        <h4 className="font-bold text-amber-900 text-sm">Aadhaar Not Yet Verified</h4>
                        <p className="text-xs text-amber-700 mt-0.5">
                          Link your Aadhaar to double your monthly booking quota to 24 tickets and enable Tatkal booking.
                        </p>
                      </div>
                    </div>

                    {!aadhaarOtpSent ? (
                      <form onSubmit={handleSendAadhaarOtp} className="space-y-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                            Enter 12-Digit Aadhaar Number
                          </label>
                          <input
                            type="text"
                            maxLength={12}
                            placeholder="e.g. 1234 5678 9012"
                            value={aadhaarInput}
                            onChange={e => setAadhaarInput(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-mono font-bold"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#213D77] text-white font-bold rounded text-xs cursor-pointer hover:bg-[#182F5D]"
                        >
                          Send UIDAI OTP
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyAadhaarOtp} className="space-y-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                            Enter 6-Digit OTP sent to your Aadhaar-registered mobile
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter OTP"
                            value={aadhaarOtp}
                            onChange={e => setAadhaarOtp(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-mono font-bold"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-green-700 text-white font-bold rounded text-xs cursor-pointer hover:bg-green-800"
                        >
                          Verify & Complete KYC
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Account Dashboard...</div>}>
      <AccountContent />
    </Suspense>
  );
}
