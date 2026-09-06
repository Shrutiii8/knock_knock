import { ClassCode, QuotaCode } from '@/types';

export const QUOTAS: { code: QuotaCode; label: string; description: string }[] = [
  { code: 'GN', label: 'GENERAL', description: 'Regular unreserved quota available to all travelers' },
  { code: 'TQ', label: 'TATKAL', description: 'Last minute booking (Opens 10:00 AM for AC, 11:00 AM for Non-AC)' },
  { code: 'PT', label: 'PREMIUM TATKAL', description: 'Dynamic pricing tatkal quota for urgent travel' },
  { code: 'LD', label: 'LADIES', description: 'Reserved coaches for female passengers' },
  { code: 'SS', label: 'LOWER BERTH / SR. CITIZEN', description: 'Exclusive lower berths for senior citizens & women 45+' },
  { code: 'HP', label: 'PERSON WITH DISABILITY (DIVYAANG)', description: 'Concessional quota with dedicated accessible berths' },
  { code: 'DP', label: 'DUTY PASS', description: 'Railway pass holders on official duty' }
];

export const CLASSES: { code: ClassCode; name: string; shortDesc: string }[] = [
  { code: '1A', name: 'AC First Class (1A)', shortDesc: 'Luxury private lockable coupe/cabin with bedding' },
  { code: '2A', name: 'AC 2 Tier (2A)', shortDesc: 'Spacious 2-tier air-conditioned berths with curtains' },
  { code: '3A', name: 'AC 3 Tier (3A)', shortDesc: 'Standard 3-tier air-conditioned sleeper coach' },
  { code: '3E', name: 'AC 3 Economy (3E)', shortDesc: 'Cost-effective 3-tier AC coach with modern amenities' },
  { code: 'EC', name: 'Exec. Chair Car (EC)', shortDesc: 'Premium 2x2 spacious executive seating' },
  { code: 'CC', name: 'AC Chair Car (CC)', shortDesc: '3x2 air-conditioned recliner seating' },
  { code: 'SL', name: 'Sleeper (SL)', shortDesc: 'Non-air-conditioned open window sleeper berths' },
  { code: '2S', name: 'Second Sitting (2S)', shortDesc: 'Non-AC reserved bench seating for daytime travel' }
];

export const BERTH_PREFERENCES = [
  { code: 'NONE', label: 'No Preference' },
  { code: 'LB', label: 'Lower Berth (LB)' },
  { code: 'MB', label: 'Middle Berth (MB)' },
  { code: 'UB', label: 'Upper Berth (UB)' },
  { code: 'SL', label: 'Side Lower (SL)' },
  { code: 'SU', label: 'Side Upper (SU)' },
  { code: 'WS', label: 'Window Seat (WS)' }
];

export const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const DAYS_OF_WEEK_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const IRCTC_CHARGES = {
  CONVENIENCE_FEE_NETBANKING: 17.70,
  CONVENIENCE_FEE_UPI: 11.80,
  TRAVEL_INSURANCE_PER_PASSENGER: 0.45,
  GST_RATE_AC: 0.05,
  SUPERFAST_CHARGE: 45,
  RESERVATION_FEE: 40,
  TATKAL_CHARGE_PERCENTAGE: 0.30
};
