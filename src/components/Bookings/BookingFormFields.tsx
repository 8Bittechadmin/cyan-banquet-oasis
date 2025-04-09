
import React, { useState, useEffect } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { InputField, SelectField, TextareaField, CheckboxField } from '@/components/Common/FormFields';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BookingFormValues } from './BookingFormSchema';
import QuickAddClient from './QuickAddClient';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DialogClose } from '@/components/ui/dialog';

interface BookingFormFieldsProps {
  form: UseFormReturn<BookingFormValues>;
}

const BookingFormFields: React.FC<BookingFormFieldsProps> = ({ form }) => {
  const [clientOptions, setClientOptions] = useState<{ value: string; label: string; }[]>([]);
  const [venueOptions, setVenueOptions] = useState<{ value: string; label: string; }[]>([]);
  const [depositAmount, setDepositAmount] = useState<number | undefined>(form.getValues('deposit_amount'));
  const [totalAmount, setTotalAmount] = useState<number | undefined>(form.getValues('total_amount'));
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Query to get all clients
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

  // Query to get all venues
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

  // Format options for select fields
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

  // Handle client addition
  const handleClientAdded = (client: { id: string; name: string }) => {
    // Add the new client to the options
    setClientOptions(prev => [...prev, { value: client.id, label: client.name }]);
    
    // Set the form value to the new client
    form.setValue('client_id', client.id);
  };

  // Handle number inputs for financial fields
  const handleTotalAmountChange = (value: any) => {
    setTotalAmount(value);
    
    // If deposit amount is greater than the new total, adjust it
    if (depositAmount && depositAmount > value) {
      setDepositAmount(value);
      form.setValue('deposit_amount', value);
    }
  };

  const handleDepositAmountChange = (value: any) => {
    // Ensure deposit doesn't exceed total
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

  // Custom date selection handlers
  const handleStartDateSelect = (date: Date) => {
    const startDate = new Date(date);
    startDate.setHours(9, 0, 0, 0); // Set default time to 9:00 AM
    form.setValue('start_date', startDate);
  };

  const handleEndDateSelect = (date: Date) => {
    const endDate = new Date(date);
    endDate.setHours(17, 0, 0, 0); // Set default time to 5:00 PM
    form.setValue('end_date', endDate);
  };

  return (
    <CardContent>
      <div className="flex justify-end mb-2">
        <DialogClose className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
          <X className="h-4 w-4" />
        </DialogClose>
      </div>
      
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date Picker */}
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {form.watch('start_date') ? (
                    format(new Date(form.watch('start_date')), 'PPP')
                  ) : (
                    <span>Select start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch('start_date') ? new Date(form.watch('start_date')) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleStartDateSelect(date);
                      setStartDateOpen(false);
                    }
                  }}
                  initialFocus
                />
                <div className="p-3 border-t border-border flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={() => setStartDateOpen(false)}
                  >
                    OK
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Picker (Optional) */}
          <div>
            <div className="flex items-center gap-1">
              <label className="text-sm font-medium">End Date</label>
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </div>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {form.watch('end_date') ? (
                    format(new Date(form.watch('end_date')), 'PPP')
                  ) : (
                    <span>Select end date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch('end_date') ? new Date(form.watch('end_date')) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleEndDateSelect(date);
                      setEndDateOpen(false);
                    }
                  }}
                  initialFocus
                />
                <div className="p-3 border-t border-border flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={() => setEndDateOpen(false)}
                  >
                    OK
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
