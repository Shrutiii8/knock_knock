'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HolidayPackage {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  image: string;
  href: string;
}

const HOLIDAY_PACKAGES: HolidayPackage[] = [
  {
    id: 'maharajas-express',
    title: "Maharajas' Express",
    titleHi: 'महाराजा एक्सप्रेस',
    description:
      "Redefining Royalty, Luxury and Comfort, Maharajas' express takes you on a sojourn to the era of bygone stately splendour of princely states. Sylvan furnishings, elegant ambience",
    descriptionHi:
      'शाही ठाठ-बाट, विलासिता और आराम को पुनर्परिभाषित करते हुए, महाराजा एक्सप्रेस आपको रियासतों के बीते हुए भव्य युग की यात्रा पर ले जाती है। सुंदर साज-सज्जा और सुरुचिपूर्ण माहौल।',
    image: '/images/maharajas_express.jpg',
    href: '/brctc-trains#maharajas-express'
  },
  {
    id: 'international-packages',
    title: 'International Packages',
    titleHi: 'अंतर्राष्ट्रीय टूर पैकेज',
    description:
      'Best deals in International Holiday packages, handpicked by BRCTC, for Thailand, Dubai, Sri Lanka, Hong Kong, China, Macau, Bhutan, Nepal, U.K., Europe, USA, Australia etc. The',
    descriptionHi:
      'बीआरसीटीसी द्वारा चयनित सर्वोत्तम अंतर्राष्ट्रीय अवकाश पैकेज - थाईलैंड, दुबई, श्रीलंका, हांगकांग, चीन, मकाऊ, भूटान, नेपाल, यूके, यूरोप, यूएसए, ऑस्ट्रेलिया आदि के लिए।',
    image: '/images/international_packages.jpg',
    href: '#international'
  },
  {
    id: 'domestic-air-packages',
    title: 'Domestic Air Packages',
    titleHi: 'घरेलू हवाई पैकेज',
    description:
      'Be it the spiritual devotee seeking blessings of Tirupati, Shirdi or Mata Vaishno Devi or the leisure traveller wanting to relish the Blue mountains of North East, Sand-dunes of',
    descriptionHi:
      'चाहे तिरुपति, शिरडी या माता वैष्णो देवी का आशीर्वाद पाने वाले श्रद्धालु हों या उत्तर पूर्व के नीले पहाड़ों और रेत के टीलों का आनंद लेने वाले पर्यटक हों।',
    image: '/images/domestic_air_packages.jpg',
    href: '#domestic'
  },
  {
    id: 'bharat-gaurav-tourist-train',
    title: 'Bharat Gaurav Tourist Train',
    titleHi: 'भारत गौरव पर्यटक ट्रेन',
    description:
      "BRCTC operates Bharat Gaurav Tourist Train having AC III-Tier accommodation on train specially designed to promote domestic tourism in India. This train runs on various theme based circuits covering pilgrimage and heritage destinations in its itinerary on a 5 days to 20 days trip and showcase India's rich cultural heritage.",
    descriptionHi:
      'बीआरसीटीसी भारत में घरेलू पर्यटन को बढ़ावा देने के लिए विशेष रूप से डिज़ाइन की गई एसी तृतीय श्रेणी आवास वाली भारत गौरव पर्यटक ट्रेन का संचालन करता है। यह ट्रेन 5 से 20 दिनों की यात्रा में तीर्थ और विरासत स्थलों को कवर करने वाले विभिन्न थीम आधारित सर्किटों पर चलती है और भारत की समृद्ध सांस्कृतिक विरासत को प्रदर्शित करती है।',
    image: '/images/bharat_gaurav_train.jpg',
    href: '/brctc-trains#bharat-gaurav'
  },
  {
    id: 'rail-tour-packages',
    title: 'Rail Tour Packages',
    titleHi: 'रेल टूर पैकेज',
    description:
      'BRCTC offers Exclusive Rail tour packages with confirmed train tickets, sight-seeing and meals for enchanting Nilgiri Mountains, Darjeeling, Kullu Manali, Kashmir, Gangtok or divine tours of Mata Vaishno Devi, Rameswaram, Madurai, Shirdi, Tirupati etc. Holiday packages/ Land packages to these destinations are also available.',
    descriptionHi:
      'बीआरसीटीसी मंत्रमुग्ध कर देने वाले नीलगिरी पर्वत, दार्जिलिंग, कुल्लू मनाली, कश्मीर, गंगटोक या माता वैष्णो देवी, रामेश्वरम, मदुरै, शिरडी, तिरुपति आदि के दिव्य दर्शन के लिए कन्फर्म ट्रेन टिकट, दर्शनीय स्थल भ्रमण और भोजन के साथ विशेष रेल टूर पैकेज प्रदान करता है। इन गंतव्यों के लिए हॉलिडे पैकेज/लैंड पैकेज भी उपलब्ध हैं।',
    image: '/images/rail_tour_packages.jpg',
    href: '#rail-tour-packages'
  }
];

export default function HolidaysSection() {
  const { language } = useLanguage();
  const isHindi = language === 'HI';

  return (
    <section id="holidays" className="py-12 select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        
        {/* Centered Heading */}
        <h2 className="text-3xl sm:text-[32px] font-black text-gray-900 tracking-wider text-center uppercase mb-10">
          {isHindi ? 'अवकाश एवं पर्यटन (HOLIDAYS)' : 'HOLIDAYS'}
        </h2>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {HOLIDAY_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              {/* Image Container with 4:3 Aspect Ratio */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2.5">
                    {isHindi ? pkg.titleHi : pkg.title}
                  </h3>
                  <p className="text-[13px] text-gray-600 leading-relaxed font-normal">
                    {isHindi ? pkg.descriptionHi : pkg.description}
                  </p>
                </div>

                {/* Read More link matching screenshot */}
                <Link
                  href={pkg.href}
                  className="inline-flex items-center gap-1.5 font-bold text-gray-900 hover:text-[#005DAA] transition-colors mt-4 text-sm group/btn"
                >
                  <span>{isHindi ? 'और पढ़ें' : 'Read More'}</span>
                  <span className="font-bold text-base transition-transform duration-200 group-hover/btn:translate-x-1">➔</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

