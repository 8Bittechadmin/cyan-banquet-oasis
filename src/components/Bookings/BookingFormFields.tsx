import React, { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { InputField, SelectField, TextareaField, CheckboxField } from '@/components/Common/FormFields';
import { DateTimeField } from '@/components/Common/FormFields/DateTimeField';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BookingFormValues } from './BookingFormSchema';
import QuickAddClient from './QuickAddClient';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BookingFormFieldsProps {
  form: UseFormReturn<BookingFormValues>;
}

const BookingFormFields: React.FC<BookingFormFieldsProps> = ({ form }) => {
  const [clientOptions, setClientOptions] = useState<{ value: string; label: string; }[]>([]);
  const [venueOptions, setVenueOptions] = useState<{ value: string; label: string; }[]>([]);
  const [depositAmount, setDepositAmount] = useState<number | undefined>(form.getValues('deposit_amount'));
  const [totalAmount, setTotalAmount] = useState<number | undefined>(form.getValues('total_amount'));
  const isMobile = useIsMobile();

  const { data: clients = [], isLoading: isClientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: venues = [], isLoading: isVenuesLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (clients.length > 0) {
      setClientOptions(clients.map(client => ({
        value: client.id,
        label: client.name
      })));
    }
  }, [clients]);

  useEffect(() => {
    if (venues.length > 0) {
      setVenueOptions(venues.map(venue => ({
        value: venue.id,
        label: venue.name
      })));
    }
  }, [venues]);

  const handleClientAdded = (client: { id: string; name: string }) => {
    setClientOptions(prev => [...prev, { value: client.id, label: client.name }]);
    form.setValue('client_id', client.id);
  };

  const handleTotalAmountChange = (value: any) => {
    setTotalAmount(value);
    if (depositAmount && depositAmount > value) {
      setDepositAmount(value);
      form.setValue('deposit_amount', value);
    }
  };

  const handleDepositAmountChange = (value: any) => {
    const total = totalAmount || 0;
    const deposit = value > total ? total : value;
    setDepositAmount(deposit);
  };

  const EVENT_TYPE_OPTIONS = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'corporate', label: 'Corporate Event' },
    { value: 'birthday', label: 'Birthday Party' },
    { value: 'conference', label: 'Conference' },
    { value: 'other', label: 'Other' }
  ];

  const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <CardContent>
      <div className="grid gap-6">
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-4`}>
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
          />
        </div>

        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-4`}>
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="text-sm font-medium" htmlFor="client_id">Client</label>
              <QuickAddClient onClientAdded={handleClientAdded} />
            </div>
            <SelectField
              form={form}
              name="client_id"
              label=""
              options={clientOptions}
              className="mt-0"
            />
          </div>

          <SelectField
            form={form}
            name="venue_id"
            label="Venue"
            options={venueOptions}
          />
        </div>

        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-4`}>
          <DateTimeField
            form={form}
            name="start_date"
            label="Start Date & Time"
            required={true}
          />
          
          <DateTimeField
            form={form}
            name="end_date"
            label="End Date & Time"
            optional={true}
          />
        </div>

        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-3'} gap-4`}>
          <div>
            <label className="text-sm font-medium">Number of Guests</label>
            <input
              type="number"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="0"
              value={form.watch('guest_count') || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value !== '' ? parseInt(value) : undefined;
                form.setValue('guest_count', numValue as any);
              }}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Total Amount</label>
            <input
              type="number"
              step="0.01"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="0.00"
              value={form.watch('total_amount') || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value !== '' ? parseFloat(value) : undefined;
                form.setValue('total_amount', numValue as any);
                handleTotalAmountChange(numValue);
              }}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Deposit Amount</label>
            <input
              type="number"
              step="0.01"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="0.00"
              value={form.watch('deposit_amount') || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value !== '' ? parseFloat(value) : undefined;
                form.setValue('deposit_amount', numValue as any);
                handleDepositAmountChange(numValue);
              }}
            />
          </div>
        </div>

        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-4`}>
          <CheckboxField
            form={form}
            name="deposit_paid"
            label="Deposit Paid"
          />

          <SelectField
            form={form}
            name="status"
            label="Status"
            options={STATUS_OPTIONS}
          />
        </div>

        <TextareaField
          form={form}
          name="notes"
          label="Notes"
          placeholder="Enter any additional notes about this booking"
        />

        {(depositAmount && totalAmount && depositAmount > totalAmount) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Deposit amount cannot be greater than the total amount.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </CardContent>
  );
};

export default BookingFormFields;
