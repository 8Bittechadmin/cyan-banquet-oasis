
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { InputField, SelectField, TextareaField, DateTimeField } from '@/components/Common/FormFields';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const eventFormSchema = z.object({
  event_name: z.string().min(1, "Event name is required"),
  event_type: z.string().min(1, "Event type is required"),
  venue_id: z.string().min(1, "Venue is required"),
  client_id: z.string().min(1, "Client is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  guest_count: z.coerce.number().min(1, "Guest count must be at least 1"),
  notes: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

type CreateEventFormProps = {
  onSubmit: (values: EventFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  initialValues?: Partial<EventFormValues>;
}

const eventTypes = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'birthday', label: 'Birthday Party' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'conference', label: 'Conference' },
  { value: 'gala', label: 'Charity Gala' },
  { value: 'other', label: 'Other' },
];

export function CreateEventForm({ onSubmit, isSubmitting, onCancel, initialValues }: CreateEventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues || {
      event_name: '',
      event_type: '',
      venue_id: '',
      client_id: '',
      start_date: '',
      end_date: '',
      guest_count: 1,
      notes: '',
    },
  });
  
  // Fetch venues for dropdown with refreshing enabled
  const { data: venues = [], isLoading: loadingVenues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });
  
  // Fetch clients for dropdown with refreshing enabled
  const { data: clients = [], isLoading: loadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    // This ensures the client list is fresh when the form is opened
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  
  const venueOptions = venues.map(venue => ({
    value: venue.id,
    label: venue.name
  }));
  
  const clientOptions = clients.map(client => ({
    value: client.id,
    label: client.name
  }));

  const handleSubmitForm = (values: EventFormValues) => {
    // Make sure guest_count is a number
    onSubmit({
      ...values,
      guest_count: Number(values.guest_count)
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
        <InputField
          form={form}
          name="event_name"
          label="Event Name"
          placeholder="Enter event name"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            form={form}
            name="event_type"
            label="Event Type"
            options={eventTypes}
            placeholder="Select event type"
          />
          
          <InputField
            form={form}
            name="guest_count"
            label="Guest Count"
            placeholder="Enter number of guests"
            type="number"
            onValueChange={(value) => {
              // Ensure it's a number
              form.setValue('guest_count', Number(value) || 1);
            }}
          />
          
          <SelectField
            form={form}
            name="venue_id"
            label="Venue"
            options={venueOptions}
            placeholder={loadingVenues ? "Loading venues..." : "Select venue"}
          />
          
          <SelectField
            form={form}
            name="client_id"
            label="Client"
            options={clientOptions}
            placeholder={loadingClients ? "Loading clients..." : "Select client"}
          />
          
          <DateTimeField
            form={form}
            name="start_date"
            label="Start Date & Time"
          />
          
          <DateTimeField
            form={form}
            name="end_date"
            label="End Date & Time"
          />
        </div>
        
        <TextareaField
          form={form}
          name="notes"
          label="Notes (optional)"
          placeholder="Enter any additional notes about this event"
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (initialValues ? 'Updating...' : 'Creating...') : (initialValues ? 'Update Event' : 'Create Event')}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateEventForm;
