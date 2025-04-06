
import { z } from 'zod';

export const TaskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  booking_id: z.string().optional(),
  due_date: z.date().optional(),
  assigned_to: z.string().optional(),
  status: z.string().default('pending'),
});

export type TaskFormValues = z.infer<typeof TaskFormSchema>;

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];
