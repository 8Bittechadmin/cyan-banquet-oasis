
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { 
  InputField, 
  SelectField, 
  TextareaField, 
  CheckboxField,
  DateTimeField
} from '@/components/Common/FormFields';
import { CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BookingFormValues, EVENT_TYPE_OPTIONS, STATUS_OPTIONS } from './BookingFormSchema';

interface BookingFormFieldsProps {
  form: UseFormReturn<BookingFormValues>;
}

const BookingFormFields: React.FC<BookingFormFieldsProps> = ({ form }) => {
  const { data: venues, isLoading: loadingVenues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: clients, isLoading: loadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  const venueOptions = venues?.map(venue => ({ 
    value: venue.id, 
    label: venue.name 
  })) || [];
  
  const clientOptions = clients?.map(client => ({
    value: client.id,
    label: client.name
  })) || [];

  // Handle numeric field updates
  const handleNumberChange = (fieldName: keyof BookingFormValues, value: string) => {
    form.setValue(fieldName as any, Number(value) || 0);
  };

  return (
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          form={form}
          name="event_name"
          label="Event Name"
          placeholder="Enter event name"
        />
        
        <SelectField
          form={form}
          name="event_type"
          label="Event Type"
          options={EVENT_TYPE_OPTIONS}
          placeholder="Select event type"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          form={form}
          name="guest_count"
          label="Guest Count"
          type="number"
          onChange={(e) => handleNumberChange('guest_count', e.target.value)}
        />
        
        <InputField
          form={form}
          name="total_amount"
          label="Total Amount"
          type="number"
          placeholder="0.00"
          onChange={(e) => handleNumberChange('total_amount', e.target.value)}
        />
        
        <InputField
          form={form}
          name="deposit_amount"
          label="Deposit Amount"
          type="number"
          placeholder="0.00"
          onChange={(e) => handleNumberChange('deposit_amount', e.target.value)}
        />
      </div>

      <SelectField
        form={form}
        name="status"
        label="Status"
        options={STATUS_OPTIONS}
        placeholder="Select status"
      />

      <CheckboxField
        form={form}
        name="deposit_paid"
        label="Deposit Paid"
        description="Check if the deposit amount has been paid"
      />

      <TextareaField
        form={form}
        name="notes"
        label="Notes"
        placeholder="Additional notes about this booking"
      />
    </CardContent>
  );
};

export default BookingFormFields;
