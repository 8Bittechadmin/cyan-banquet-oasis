
import { z } from 'zod';

export const BookingFormSchema = z.object({
  event_name: z.string().min(1, 'Event name is required'),
  event_type: z.string().min(1, 'Event type is required'),
  venue_id: z.string().min(1, 'Venue is required'),
  client_id: z.string().min(1, 'Client is required'),
  start_date: z.coerce.date(),
  end_date: z.coerce.date().optional(),
  guest_count: z.number().min(1, 'Guest count is required'),
  total_amount: z.number().optional(),
  deposit_amount: z.number().optional(),
  deposit_paid: z.boolean().default(false),
  notes: z.string().optional(),
  status: z.string().default('pending'),
});

export type BookingFormValues = z.infer<typeof BookingFormSchema>;

export const EVENT_TYPE_OPTIONS = [
  { value: 'Wedding', label: 'Wedding' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Birthday', label: 'Birthday' },
  { value: 'Anniversary', label: 'Anniversary' },
  { value: 'Conference', label: 'Conference' },
  { value: 'Other', label: 'Other' }
];

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' }
];
