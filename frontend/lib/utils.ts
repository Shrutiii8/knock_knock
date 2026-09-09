import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ClassCode, QuotaCode } from '@/types';
import { IRCTC_CHARGES } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(amount);
}

export function getLocalTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateSafe(dateString: string): Date {
  if (!dateString) return new Date();
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month - 1, day, 12, 0, 0);
    }
  }
  return new Date(dateString);
}

export function addDays(dateString: string, days: number): string {
  if (!dateString) return getLocalTodayDate();
  const base = parseDateSafe(dateString);
  base.setDate(base.getDate() + days);
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = parseDateSafe(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function formatDateShort(dateString: string): string {
  if (!dateString) return '';
  const date = parseDateSafe(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  });
}

export function formatTime(timeString: string): string {
  if (!timeString) return '';
  return timeString;
}

export function generatePNR(): string {
  // Typical Indian Railways PNR: 3-digit zone prefix + 7-digit random number
  const prefix = ['245', '452', '623', '814', '125', '367'][Math.floor(Math.random() * 6)];
  const randomSeven = Math.floor(1000000 + Math.random() * 9000000).toString();
  return `${prefix}${randomSeven}`;
}

export function generateSeatAllocation(classCode: ClassCode, index: number): {
  coach: string;
  berth: number;
  berthType: string;
  status: 'CNF' | 'RAC' | 'WL';
} {
  const coachMap: Record<ClassCode, string[]> = {
    '1A': ['H1'],
    '2A': ['A1', 'A2'],
    '3A': ['B1', 'B2', 'B3', 'B4'],
    '3E': ['M1', 'M2', 'M3'],
    'CC': ['C1', 'C2', 'C3'],
    'EC': ['E1'],
    'SL': ['S1', 'S2', 'S3', 'S4', 'S5'],
    '2S': ['D1', 'D2']
  };

  const berths = ['LB', 'MB', 'UB', 'LB', 'MB', 'UB', 'SL', 'SU'];
  const coaches = coachMap[classCode] || ['B1'];
  const coach = coaches[index % coaches.length];
  const berth = ((index * 7 + 12) % 72) + 1;
  const berthType = berths[(berth - 1) % 8];

  return {
    coach,
    berth,
    berthType,
    status: 'CNF'
  };
}

export function calculateBreakdown(
  baseFarePerPerson: number,
  passengerCount: number,
  classCode: ClassCode,
  quota: QuotaCode,
  hasInsurance: boolean,
  paymentType: 'UPI' | 'CARDS_NETBANKING' = 'UPI'
) {
  const rawBase = baseFarePerPerson * passengerCount;
  const resFee = IRCTC_CHARGES.RESERVATION_FEE * passengerCount;
  const sfCharge = IRCTC_CHARGES.SUPERFAST_CHARGE * passengerCount;

  let tatkalCharge = 0;
  if (quota === 'TQ' || quota === 'PT') {
    tatkalCharge = Math.round(rawBase * IRCTC_CHARGES.TATKAL_CHARGE_PERCENTAGE);
  }

  const isAcClass = ['1A', '2A', '3A', '3E', 'CC', 'EC'].includes(classCode);
  const gst = isAcClass ? Math.round((rawBase + resFee + sfCharge + tatkalCharge) * IRCTC_CHARGES.GST_RATE_AC) : 0;
  const insurance = hasInsurance ? +(IRCTC_CHARGES.TRAVEL_INSURANCE_PER_PASSENGER * passengerCount).toFixed(2) : 0;
  const convenienceFee = paymentType === 'UPI'
    ? IRCTC_CHARGES.CONVENIENCE_FEE_UPI
    : IRCTC_CHARGES.CONVENIENCE_FEE_NETBANKING;

  const total = Math.round(rawBase + resFee + sfCharge + tatkalCharge + gst + insurance + convenienceFee);

  return {
    baseFare: rawBase,
    reservationCharge: resFee,
    superfastCharge: sfCharge,
    tatkalCharge,
    insuranceCharge: insurance,
    gst,
    convenienceFee,
    totalFare: total
  };
}
