export type WorkshopType = 'individual' | 'couple' | 'team';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface Instructor {
  id: string;
  name: string;
  photo_url: string | null;
  bio: string;
  specialties: string[];
  certifications: string[];
  quote?: string;
  created_at?: string;
}

export interface Workshop {
  id: string;
  type: WorkshopType;
  title: string;
  date_time: string; // ISO 8601
  capacity: number;
  seats_taken: number;
  price: number;
  instructor_id: string | null;
  description: string;
  is_active: boolean;
  created_at?: string;
  instructor?: Instructor;
}

export interface Booking {
  id: string;
  workshop_id: string;
  user_name: string;
  email: string;
  phone: string;
  participants: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  health_form_id: string | null;
  confirmation_code: string;
  created_at?: string;
  workshop?: Workshop;
}

export interface HealthDeclaration {
  id: string;
  booking_id: string;
  has_heart_condition: boolean;
  has_hypertension: boolean;
  is_pregnant: boolean;
  has_raynauds: boolean;
  has_open_wounds: boolean;
  other_conditions: string;
  participant_name: string;
  signature: string; // base64 data URL
  signed_at: string;
}

export interface WaitlistEntry {
  id: string;
  workshop_id: string;
  email: string;
  phone: string | null;
  position: number;
  notified: boolean;
  created_at?: string;
}

export interface BookingFormData {
  user_name: string;
  email: string;
  phone: string;
  participants: number;
}

export interface HealthFormData {
  has_heart_condition: boolean;
  has_hypertension: boolean;
  is_pregnant: boolean;
  has_raynauds: boolean;
  has_open_wounds: boolean;
  other_conditions: string;
  participant_name: string;
}
