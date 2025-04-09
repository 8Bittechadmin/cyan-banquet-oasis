
import { z } from 'zod';

export const VenueFormSchema = z.object({
  name: z.string().min(1, 'Venue name is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  square_footage: z.number().min(1, 'Square footage must be at least 1'),
  hourly_rate: z.number().min(0, 'Hourly rate must be at least 0'),
  description: z.string().optional(),
  location: z.string().optional(),
  availability: z.enum(['available', 'booked', 'maintenance']),
  image_url: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
});

export type VenueFormValues = z.infer<typeof VenueFormSchema>;

export const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'booked', label: 'Booked' },
  { value: 'maintenance', label: 'Maintenance' },
];
