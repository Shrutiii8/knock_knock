'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function FeedbackPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [remarks, setRemarks] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 && !remarks.trim()) {
      showToast('error', 'Feedback Required', 'Please provide a star rating or remarks before submitting.');
      return;
    }

    setIsSubmitted(true);
    showToast('success', 'Feedback Submitted', 'Thank you for your feedback!');
  };

  const handleCancel = () => {
    if (rating > 0 || remarks.trim()) {
      setRating(0);
      setHoverRating(0);
      setRemarks('');
    } else {
      router.push('/');
    }
  };

  const currentDisplayRating = hoverRating || rating;

  return (
    <div className="w-full bg-[#F4F7FB] py-8 sm:py-12 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Feedback Box Matching User Reference */}
        <div className="bg-white border border-gray-300 shadow-sm overflow-hidden">

          {/* Dark Navy Header Banner */}
          <div className="bg-[#02235E] text-white px-4 sm:px-6 py-2.5 sm:py-3">
            <h1 className="text-sm sm:text-base font-bold tracking-tight">
              Please rate us to improve the ticketing experience
            </h1>
          </div>

          {/* Feedback Form Content */}
          <div className="p-6 sm:p-10">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Thank You for Your Feedback!
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                  Your rating and remarks have been successfully recorded. We use your suggestions to continuously enhance the ticketing experience.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setRating(0);
                      setRemarks('');
                    }}
                    className="px-5 py-1.5 text-xs sm:text-sm font-semibold border border-gray-400 bg-white hover:bg-gray-50 text-gray-800 rounded transition-colors"
                  >
                    Submit Another Feedback
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="px-6 py-1.5 text-xs sm:text-sm font-bold bg-[#FB792B] hover:bg-[#E65100] text-white rounded transition-colors"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 5-Star Rating Row (empty blue-outlined stars matching screenshot) */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 py-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = currentDisplayRating >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-9 sm:h-9 transition-colors ${isFilled
                              ? 'text-[#02235E] fill-[#02235E]'
                              : 'text-[#02235E] fill-transparent stroke-[1.75]'
                            }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Remarks Field */}
                <div className="max-w-2xl mx-auto space-y-1.5">
                  <label htmlFor="remarks" className="block text-xs sm:text-sm font-medium text-gray-800">
                    Remarks
                  </label>
                  <textarea
                    id="remarks"
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter your comments or suggestions..."
                    className="w-full p-3 border border-gray-300 rounded text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#02235E] focus:ring-1 focus:ring-[#02235E] resize-y"
                  />
                </div>

                {/* Centered Action Buttons matching user screenshot */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-1.5 text-xs sm:text-sm font-semibold border border-gray-400 bg-white hover:bg-gray-50 text-gray-800 rounded transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-1.5 text-xs sm:text-sm font-bold bg-[#FB792B] hover:bg-[#E65100] text-white rounded transition-colors shadow-2xs cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
