import { z } from 'zod';

export const searchSchema = z.object({
  from: z.string().min(2, 'Please select departure station'),
  to: z.string().min(2, 'Please select destination station'),
  date: z.string().min(1, 'Please select date of journey'),
  quota: z.enum(['GN', 'TQ', 'PT', 'LD', 'SS', 'HP', 'DP']).default('GN'),
  classCode: z.string().optional(),
  acOnly: z.boolean().default(false),
  disabledConcession: z.boolean().default(false)
}).refine(data => data.from.toUpperCase() !== data.to.toUpperCase(), {
  message: 'Source and destination stations cannot be the same',
  path: ['to']
});

export const loginSchema = z.object({
  username: z.string().min(3, 'Username / Email / Mobile is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  captcha: z.string().min(4, 'Enter the captcha characters')
});

export const registerSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters').regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password required'),
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  gender: z.enum(['M', 'F', 'T'], { message: 'Please select gender' }),
  dob: z.string().min(1, 'Date of birth is required'),
  occupation: z.string().min(2, 'Occupation is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  state: z.string().min(2, 'State is required')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const passengerRowSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(40, 'Name must be under 40 characters'),
  age: z.coerce.number().min(1, 'Age must be 1 or higher').max(125, 'Invalid age'),
  gender: z.enum(['M', 'F', 'T'], { message: 'Select gender' }),
  berthPreference: z.enum(['NONE', 'LB', 'MB', 'UB', 'SL', 'SU', 'WS']),
  foodPreference: z.enum(['NONE', 'VEG', 'NON_VEG']).optional()
});

export const bookingFormSchema = z.object({
  passengers: z.array(passengerRowSchema).min(1, 'Add at least one passenger').max(6, 'Maximum 6 passengers per ticket'),
  contactMobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number for SMS ticket updates'),
  contactEmail: z.string().email('Enter valid email for electronic reservation slip (ERS)'),
  travelInsurance: z.boolean().default(true),
  autoUpgrade: z.boolean().default(true),
  gstin: z.string().optional()
});

export const pnrLookupSchema = z.object({
  pnr: z.string().regex(/^\d{10}$/, 'PNR must be exactly 10 digits')
});
