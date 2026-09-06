'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  EyeOff, 
  RefreshCw, 
  XCircle, 
  Plus, 
  Minus, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface FAQItem {
  id: number;
  question: string;
  questionHi: string;
  answer: string;
  answerHi: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 1,
    question: 'What is the BRCTC Ticketing Website?',
    questionHi: 'बीआरसीटीसी टिकटिंग वेबसाइट क्या है?',
    answer: 'BRCTC is the official internet ticketing platform of Bharat Railways facilitating digital passenger reservations, tatkal bookings, train schedules, meal bookings, and PNR status tracking across India.',
    answerHi: 'बीआरसीटीसी भारत रेलवे का आधिकारिक इंटरनेट टिकटिंग प्लेटफॉर्म है जो पूरे भारत में डिजिटल यात्री आरक्षण, तत्काल बुकिंग, ट्रेन समय-सारणी, भोजन बुकिंग और पीएनआर स्थिति की सुविधा प्रदान करता है।'
  },
  {
    id: 2,
    question: 'Why do I need to register on BRCTC?',
    questionHi: 'मुझे बीआरसीटीसी पर पंजीकरण करने की आवश्यकता क्यों है?',
    answer: 'Registration is required by Ministry of Railways guidelines to issue verified electronic reservations, track ticket cancellation refunds, provide SMS/email travel alerts, and protect anti-fraud quotas.',
    answerHi: 'सत्यापित इलेक्ट्रॉनिक आरक्षण जारी करने, टिकट रद्दीकरण रिफंड ट्रैक करने, एसएमएस/ईमेल अलर्ट प्रदान करने और टिकट सुरक्षा के लिए पंजीकरण अनिवार्य है।'
  },
  {
    id: 3,
    question: 'How can I register on BRCTC?',
    questionHi: 'मैं बीआरसीटीसी पर कैसे पंजीकरण कर सकता हूँ?',
    answer: 'Simply complete the individual registration form on this page with a unique username, valid mobile number, and active email address. Verification OTPs are sent for instantaneous account activation.',
    answerHi: 'इस पृष्ठ पर दिए गए फॉर्म में एक अद्वितीय उपयोगकर्ता नाम, वैध मोबाइल नंबर और सक्रिय ईमेल पता भरें। तुरंत खाता सक्रियण के लिए ओटीपी भेजा जाता है।'
  },
  {
    id: 4,
    question: 'Are there any charges for registering on BRCTC?',
    questionHi: 'क्या बीआरसीटीसी पर पंजीकरण के लिए कोई शुल्क है?',
    answer: 'No, individual passenger registration on BRCTC is completely free of cost. There are no annual maintenance or account creation fees.',
    answerHi: 'नहीं, बीआरसीटीसी पर व्यक्तिगत यात्री पंजीकरण पूरी तरह से निःशुल्क है। कोई वार्षिक या खाता निर्माण शुल्क नहीं है।'
  },
  {
    id: 5,
    question: 'What information do I need to provide for registration?',
    questionHi: 'पंजीकरण के लिए मुझे कौन सी जानकारी प्रदान करनी होगी?',
    answer: 'You need to provide a unique Username, Full Name, secure Password, active personal Email ID, and 10-digit Indian Mobile Number (without ISD code). Aadhaar linking is optional and can be done post-registration.',
    answerHi: 'आपको एक अद्वितीय उपयोगकर्ता नाम, पूरा नाम, सुरक्षित पासवर्ड, सक्रिय ईमेल आईडी और 10-अंकीय भारतीय मोबाइल नंबर प्रदान करना होगा।'
  },
  {
    id: 6,
    question: 'How do I activate my BRCTC account after registration?',
    questionHi: 'पंजीकरण के बाद मैं अपना बीआरसीटीसी खाता कैसे सक्रिय करूँ?',
    answer: 'Upon clicking submit, your account is immediately verified and activated. You can immediately log in to book train tickets across all classes.',
    answerHi: 'सबमिट पर क्लिक करते ही आपका खाता सक्रिय हो जाता है और आप तुरंत सभी श्रेणियों में ट्रेन टिकट बुक करने के लिए लॉग इन कर सकते हैं।'
  },
  {
    id: 7,
    question: "What should I do if I don't receive the activation link or OTP?",
    questionHi: 'यदि मुझे सक्रियण लिंक या ओटीपी प्राप्त नहीं होता है तो मुझे क्या करना चाहिए?',
    answer: 'Please check your email spam/junk folder. If you still do not receive it, click "Resend OTP" or verify that your 10-digit mobile number does not contain ISD code or leading zeros.',
    answerHi: 'कृपया अपना स्पैम फ़ोल्डर जांचें या "पुनः ओटीपी भेजें" पर क्लिक करें और सुनिश्चित करें कि मोबाइल नंबर में देश कोड शामिल नहीं है।'
  },
  {
    id: 8,
    question: 'Can I register multiple accounts with the same email or mobile number?',
    questionHi: 'क्या मैं एक ही ईमेल या मोबाइल नंबर से कई खाते पंजीकृत कर सकता हूँ?',
    answer: 'No, as per Indian Railway security regulations, an email address and mobile number can only be linked to one unique BRCTC passenger profile.',
    answerHi: 'नहीं, रेलवे सुरक्षा नियमों के अनुसार एक ईमेल और मोबाइल नंबर केवल एक अद्वितीय बीआरसीटीसी प्रोफ़ाइल से ही जोड़ा जा सकता है।'
  },
  {
    id: 9,
    question: 'What should I do if I forget my BRCTC password?',
    questionHi: 'यदि मैं अपना बीआरसीटीसी पासवर्ड भूल जाऊं तो मुझे क्या करना चाहिए?',
    answer: 'Click on the "Forgot Password" link on the Login screen, enter your registered username or email, and follow the SMS OTP prompt to reset your password securely.',
    answerHi: 'लॉगिन स्क्रीन पर "पासवर्ड भूल गए" लिंक पर क्लिक करें और सुरक्षित रूप से नया पासवर्ड सेट करें।'
  },
  {
    id: 10,
    question: 'Can I update my personal details after registration?',
    questionHi: 'क्या मैं पंजीकरण के बाद अपना व्यक्तिगत विवरण अपडेट कर सकता हूँ?',
    answer: 'Yes, after logging in, navigate to "My Account" > "Profile" to update your address, add frequent passengers to your Master List, or link your Aadhaar.',
    answerHi: 'हाँ, लॉगिन करने के बाद "मेरा खाता" > "प्रोफ़ाइल" में जाकर आप अपना पता अपडेट कर सकते हैं या आधार लिंक कर सकते हैं।'
  }
];

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, openLoginModal } = useAuth();
  const { language } = useLanguage();
  const isHindi = language === 'HI';

  // Form State
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91 - India');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('M');
  const [dob, setDob] = useState('');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setStateName] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('amfU');

  // Visibilities
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({
    username: 'User Name is required.' // Matches initial error appearance in screenshot
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({
    username: true
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Accordion State: holds open item ID (or multiple)
  const [openFAQId, setOpenFAQId] = useState<number | null>(null);

  // Generate random captcha
  const generateCaptcha = () => {
    const chars = 'abcdefghkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(res);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = isHindi ? 'उपयोगकर्ता नाम आवश्यक है।' : 'User Name is required.';
    } else if (username.length < 3) {
      newErrors.username = isHindi ? 'उपयोगकर्ता नाम में कम से कम 3 अक्षर होने चाहिए।' : 'User Name must be at least 3 characters.';
    }

    if (!fullName.trim()) {
      newErrors.fullName = isHindi ? 'पूरा नाम आवश्यक है।' : 'Full Name is required.';
    }

    if (!password) {
      newErrors.password = isHindi ? 'पासवर्ड आवश्यक है।' : 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = isHindi ? 'पासवर्ड में कम से कम 6 अक्षर होने चाहिए।' : 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = isHindi ? 'पासवर्ड की पुष्टि आवश्यक है।' : 'Confirm Password is required.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = isHindi ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.';
    }

    if (!email.trim()) {
      newErrors.email = isHindi ? 'ईमेल आईडी आवश्यक है।' : 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = isHindi ? 'अमान्य ईमेल आईडी।' : 'Invalid email address.';
    }

    if (!mobile.trim()) {
      newErrors.mobile = isHindi ? 'मोबाइल नंबर आवश्यक है।' : 'Mobile Number is required.';
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      newErrors.mobile = isHindi ? 'कृपया वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' : 'Please enter valid 10-digit mobile number.';
    }

    if (!dob) {
      newErrors.dob = isHindi ? 'जन्म तिथि आवश्यक है।' : 'Date of Birth is required.';
    }

    if (!occupation.trim()) {
      newErrors.occupation = isHindi ? 'व्यवसाय आवश्यक है।' : 'Occupation is required.';
    }

    if (!address.trim()) {
      newErrors.address = isHindi ? 'पता आवश्यक है।' : 'Address is required.';
    }

    if (!city.trim()) {
      newErrors.city = isHindi ? 'शहर आवश्यक है।' : 'City is required.';
    }

    if (!pincode.trim()) {
      newErrors.pincode = isHindi ? 'पिनकोड आवश्यक है।' : 'Pincode is required.';
    }

    if (!state.trim()) {
      newErrors.state = isHindi ? 'राज्य आवश्यक है।' : 'State is required.';
    }

    if (!captchaInput.trim()) {
      newErrors.captcha = isHindi ? 'कैप्चा कोड आवश्यक है।' : 'Captcha is required.';
    } else if (captchaInput.trim().toLowerCase() !== captchaCode.toLowerCase()) {
      newErrors.captcha = isHindi ? 'कैप्चा कोड मेल नहीं खाता।' : 'Captcha does not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUsernameChange = (val: string) => {
    setUsername(val);
    setTouched(prev => ({ ...prev, username: true }));
    if (!val.trim()) {
      setErrors(prev => ({
        ...prev,
        username: isHindi ? 'उपयोगकर्ता नाम आवश्यक है।' : 'User Name is required.'
      }));
    } else {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.username;
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const valid = validate();
    if (!valid) return;

    const success = await registerUser({
      username: username.trim(),
      fullName: fullName.trim(),
      password: password,
      email: email.trim(),
      mobile: mobile.trim(),
      gender: gender,
      dob: dob,
      occupation: occupation.trim(),
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      state: state.trim()
    });

    if (success) {
      setRegistrationSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }
  };

  const toggleFAQ = (id: number) => {
    setOpenFAQId(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-white min-h-screen py-8 text-gray-900 select-none">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: REGISTRATION FORM ================= */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4">
            
            {/* Header: Title + SIGN IN Link on Right */}
            <div className="flex items-center justify-between pb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                {isHindi ? 'अपना बीआरसीटीसी खाता बनाएं' : 'Create Your BRCTC account'}
              </h1>
              <button
                type="button"
                onClick={() => openLoginModal()}
                className="text-xs sm:text-sm font-bold text-[#FB792B] hover:text-[#E65100] uppercase tracking-wider hover:underline transition-colors cursor-pointer"
              >
                {isHindi ? 'साइन इन करें' : 'SIGN IN'}
              </button>
            </div>

            {/* Instruction / Guidelines Box */}
            <div className="border border-gray-300 rounded p-4 text-[12px] text-gray-800 leading-relaxed space-y-1.5 bg-white">
              <p>
                1. {isHindi 
                  ? 'प्रोफ़ाइल में जंक / नकली मान भरने पर बीआरसीटीसी खाता निष्क्रिय किया जा सकता है।'
                  : 'Garbage / Junk values in profile may lead to deactivation of BRCTC account.'}
              </p>
              <p>
                2. {isHindi 
                  ? 'गैर-सत्यापित उपयोगकर्ताओं के लिए अग्रिम आरक्षण अवधि (ARP) और तत्काल टिकट बुकिंग उपयोगकर्ता पंजीकरण के 4 दिन बाद ही अनुमत है (पंजीकरण के दिन को छोड़कर)। उपयोगकर्ता तत्काल बुकिंग के लिए अपनी प्रोफ़ाइल को आधार से प्रमाणित कर सकते हैं।'
                  : 'Opening Advance Reservation Period(ARP) ticket and Opening Tatkal ticket booking for unauthenticated users is allowed only after 4 days from date of User Registration (excluding the day of registration ). User may authenticate their user profile with Aadhaar to book Opening Advance Reservation Period(ARP) ticket and Opening Tatkal ticket.'}
              </p>
            </div>

            {registrationSuccess ? (
              <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <h2 className="text-lg font-bold text-green-800">
                  {isHindi ? 'पंजीकरण सफलतापूर्वक पूर्ण हुआ!' : 'Registration Completed Successfully!'}
                </h2>
                <p className="text-xs text-green-700">
                  {isHindi 
                    ? 'आपका खाता सक्रिय हो गया है। आपको मुख्य पृष्ठ पर पुनर्निर्देशित किया जा रहा है...'
                    : 'Your account is active. Redirecting you to the home page to start booking tickets...'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                
                {/* 1. User Name */}
                <div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => handleUsernameChange(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, username: true }))}
                    placeholder={isHindi ? 'उपयोगकर्ता नाम (User Name)' : 'User Name'}
                    className={`w-full px-3.5 py-2.5 border rounded text-xs sm:text-sm text-gray-800 outline-hidden transition-colors ${
                      touched.username && errors.username 
                        ? 'border-[#213D77] ring-1 ring-[#213D77]' 
                        : 'border-gray-300 hover:border-gray-400 focus:border-[#213D77]'
                    }`}
                  />
                  
                  {/* Exact red error box matching screenshot */}
                  {touched.username && errors.username && (
                    <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-150">
                      <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                      <span>{errors.username}</span>
                    </div>
                  )}
                </div>

                {/* 2. Full Name */}
                <div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder={isHindi ? 'पूरा नाम (Full Name)' : 'Full Name'}
                    className="w-full px-3.5 py-2.5 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden transition-colors"
                  />
                  {isSubmitted && errors.fullName && (
                    <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold">
                      <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>

                {/* 3. Password */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={isHindi ? 'पासवर्ड (Password)' : 'Password'}
                    className="w-full px-3.5 py-2.5 pr-10 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {isSubmitted && errors.password && (
                    <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold">
                      <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                {/* 4. Confirm Password */}
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder={isHindi ? 'पासवर्ड की पुष्टि करें (Confirm Password)' : 'Confirm Password'}
                    className="w-full px-3.5 py-2.5 pr-10 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {isSubmitted && errors.confirmPassword && (
                    <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold">
                      <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>

                {/* Light Blue Info Banner 1: Email Alert */}
                <div className="bg-[#E1F5FE] text-[#0277BD] text-xs font-medium py-3 px-4 rounded border border-[#B3E5FC]/40">
                  {isHindi 
                    ? 'अमान्य ईमेल आईडी से बीआरसीटीसी खाता निष्क्रिय हो सकता है।'
                    : 'Invalid email ID may lead to deactivation of BRCTC account.'}
                </div>

                {/* 5. Email */}
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={isHindi ? 'ईमेल (Email)' : 'Email'}
                    className="w-full px-3.5 py-2.5 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden transition-colors"
                  />
                  {isSubmitted && errors.email && (
                    <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold">
                      <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* 6. Country Code Dropdown */}
                <div>
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden bg-white cursor-pointer"
                  >
                    <option value="+91 - India">+91 - India</option>
                    <option value="+1 - USA">+1 - USA</option>
                    <option value="+44 - UK">+44 - UK</option>
                    <option value="+971 - UAE">+971 - UAE</option>
                    <option value="+65 - Singapore">+65 - Singapore</option>
                    <option value="+61 - Australia">+61 - Australia</option>
                  </select>
                </div>

                {/* Light Blue Info Banner 2: Mobile Alert */}
                <div className="bg-[#E1F5FE] text-[#0277BD] text-xs font-medium py-3 px-4 rounded border border-[#B3E5FC]/40">
                  {isHindi 
                    ? 'कृपया आईएसडी कोड के बिना 10-अंकीय मोबाइल नंबर दर्ज करें'
                    : 'Please submit Mobile Number without ISD Code'}
                </div>

                {/* 7. Mobile */}
                <div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder={isHindi ? 'मोबाइल नंबर (Mobile)' : 'Mobile'}
                    className="w-full px-3.5 py-2.5 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden transition-colors"
                  />
                  {isSubmitted && errors.mobile && (
                    <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold">
                      <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                      <span>{errors.mobile}</span>
                    </div>
                  )}
                </div>

                {/* 7.5. Gender & DOB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Gender */}
                  <div>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden bg-white cursor-pointer"
                    >
                      <option value="M">{isHindi ? 'पुरुष (Male)' : 'Male'}</option>
                      <option value="F">{isHindi ? 'महिला (Female)' : 'Female'}</option>
                      <option value="T">{isHindi ? 'ट्रांसजेंडर (Transgender)' : 'Transgender'}</option>
                    </select>
                  </div>

                  {/* DOB */}
                  <div>
                    <input
                      type="date"
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden transition-colors bg-white"
                    />
                    {isSubmitted && errors.dob && (
                      <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold">
                        <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                        <span>{errors.dob}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 7.6. Occupation */}
                <div>
                  <input
                    type="text"
                    value={occupation}
                    onChange={e => setOccupation(e.target.value)}
                    placeholder={isHindi ? 'व्यवसाय (Occupation)' : 'Occupation'}
                    className="w-full px-3.5 py-2.5 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden transition-colors"
                  />
                  {isSubmitted && errors.occupation && (
                    <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold">
                      <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                      <span>{errors.occupation}</span>
                    </div>
                  )}
                </div>

                {/* Residential Address Header */}
                <h3 className="text-sm font-bold text-[#213D77] mt-4 mb-2">
                  {isHindi ? 'आवासीय पता' : 'Residential Address'}
                </h3>

                {/* 7.7. Address */}
                <div>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder={isHindi ? 'पूरा पता (Flat/Door/Block, Street)' : 'Full Address (Flat/Door/Block, Street)'}
                    className="w-full px-3.5 py-2.5 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden transition-colors"
                  />
                  {isSubmitted && errors.address && (
                    <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold">
                      <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                      <span>{errors.address}</span>
                    </div>
                  )}
                </div>

                {/* 7.8. City, State, Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* City */}
                  <div>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder={isHindi ? 'शहर (City)' : 'City'}
                      className="w-full px-3.5 py-2.5 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden transition-colors"
                    />
                    {isSubmitted && errors.city && (
                      <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold">
                        <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                        <span>{errors.city}</span>
                      </div>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <input
                      type="text"
                      value={state}
                      onChange={e => setStateName(e.target.value)}
                      placeholder={isHindi ? 'राज्य (State)' : 'State'}
                      className="w-full px-3.5 py-2.5 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden transition-colors"
                    />
                    {isSubmitted && errors.state && (
                      <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold">
                        <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                        <span>{errors.state}</span>
                      </div>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder={isHindi ? 'पिनकोड (Pincode)' : 'Pincode'}
                      className="w-full px-3.5 py-2.5 border border-gray-300 hover:border-gray-400 focus:border-[#213D77] rounded text-xs sm:text-sm text-gray-800 outline-hidden transition-colors"
                    />
                    {isSubmitted && errors.pincode && (
                      <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold">
                        <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                        <span>{errors.pincode}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 8. Captcha Component matching Screenshot 2 */}
                <div className="space-y-0 max-w-sm pt-2">
                  {/* Captcha Display Banner: Dark Navy #213D77 with tracking and Refresh */}
                  <div className="bg-[#213D77] text-white px-4 py-2.5 rounded-t flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-mono font-bold tracking-[0.35em] select-none pl-1">
                      {captchaCode}
                    </span>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-1 hover:bg-white/10 rounded transition-colors text-white cursor-pointer"
                      title="Refresh Captcha"
                      aria-label="Refresh Captcha"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Captcha Input directly underneath */}
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)}
                    placeholder={isHindi ? 'कैप्चा दर्ज करें (Enter Captcha)' : 'Enter Captcha'}
                    className="w-full px-3.5 py-2.5 border border-t-0 border-gray-300 rounded-b text-xs sm:text-sm text-gray-800 outline-hidden focus:border-[#213D77]"
                  />
                  {isSubmitted && errors.captcha && (
                    <div className="mt-1.5 border border-[#FFCDD2] bg-[#FFEBEE] text-[#D32F2F] px-3 py-2 rounded flex items-center gap-2 text-xs font-semibold">
                      <XCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
                      <span>{errors.captcha}</span>
                    </div>
                  )}
                </div>

                {/* 9. Submit Button matching Screenshot 2 */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-10 py-2.5 bg-[#FB792B] hover:bg-[#E65100] text-white font-bold text-sm rounded shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    {isHindi ? 'सबमिट करें' : 'Submit'}
                  </button>
                </div>

              </form>
            )}

          </div>


          {/* ================= RIGHT COLUMN: HELP & FAQ CARD ================= */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="bg-[#FDFBF7] border border-[#E8DFD0] rounded-xl p-5 sm:p-7 shadow-xs">
              
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {isHindi ? 'सहायता एवं अक्सर पूछे जाने वाले प्रश्न' : 'Help & FAQ'}
                </h2>
                <h3 className="text-xs sm:text-sm font-bold text-gray-800 mt-2">
                  {isHindi 
                    ? 'क्या आपके पास बीआरसीटीसी टिकटिंग वेबसाइट पर पंजीकरण के बारे में प्रश्न हैं?'
                    : 'Have Questions About Registering on the BRCTC Ticketing Website?'}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 mt-1.5 leading-relaxed">
                  {isHindi
                    ? 'यहाँ, आपको पंजीकरण प्रक्रिया में मार्गदर्शन करने के लिए अक्सर पूछे जाने वाले प्रश्नों (एफएक्यू) के उत्तर मिलेंगे।'
                    : "Here, you'll find answers to some frequently asked questions (FAQs) to help guide you through the registration process."}
                </p>
              </div>

              {/* 10 Accordion Items */}
              <div className="space-y-1.5">
                {FAQ_LIST.map(item => {
                  const isOpen = openFAQId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="bg-[#EAE0D0] hover:bg-[#E5DAC8] transition-colors rounded-sm overflow-hidden border border-[#DFD5C4]"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFAQ(item.id)}
                        className="w-full p-3.5 flex items-center justify-between text-left gap-2 cursor-pointer"
                      >
                        <span className="text-[11px] sm:text-xs font-semibold text-gray-900 leading-snug">
                          {isHindi ? item.questionHi : item.question}
                        </span>
                        <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center text-gray-700">
                          {isOpen ? <Minus className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>
                      </button>

                      {/* Accordion Expanded Content */}
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 pt-0 text-[11px] text-gray-700 leading-relaxed border-t border-[#DFD5C4]/60 bg-[#F4EFE6] animate-in fade-in duration-150">
                          <p className="pt-2">
                            {isHindi ? item.answerHi : item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
