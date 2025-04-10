
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BookingFormFields from '@/components/Bookings/BookingFormFields';
import { BookingFormSchema, type BookingFormValues } from '@/components/Bookings/BookingFormSchema';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const EditBooking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  
  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      event_name: '',
      event_type: '',
      venue_id: '',
      client_id: '',
      start_date: new Date(),
      guest_count: 1,
      deposit_paid: false,
      status: 'pending',
    },
  });
  
  // Set form values when booking data is loaded
  React.useEffect(() => {
    if (booking) {
      form.reset({
        event_name: booking.event_name,
        event_type: booking.event_type,
        venue_id: booking.venue_id,
        client_id: booking.client_id,
        start_date: booking.start_date ? new Date(booking.start_date) : new Date(),
        end_date: booking.end_date ? new Date(booking.end_date) : undefined,
        guest_count: booking.guest_count,
        total_amount: booking.total_amount,
        deposit_amount: booking.deposit_amount,
        deposit_paid: booking.deposit_paid,
        notes: booking.notes || '',
        status: booking.status,
      });
    }
  }, [booking, form]);

  const updateBooking = useMutation({
    mutationFn: async (values: BookingFormValues) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          event_name: values.event_name,
          event_type: values.event_type,
          venue_id: values.venue_id,
          client_id: values.client_id,
          start_date: values.start_date.toISOString(),
          end_date: values.end_date ? values.end_date.toISOString() : null,
          guest_count: values.guest_count,
          total_amount: values.total_amount || null,
          deposit_amount: values.deposit_amount || null,
          deposit_paid: values.deposit_paid,
          notes: values.notes || null,
          status: values.status,
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Booking updated',
        description: 'The booking has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      navigate('/bookings');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update booking: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const checkRelatedInvoices = async () => {
    if (!id) return false;
    
    const { data, error } = await supabase
      .from('invoices')
      .select('id')
      .eq('booking_id', id);
      
    if (error) {
      throw error;
    }
    
    return data && data.length > 0;
  };
  
  const deleteRelatedInvoices = async () => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('booking_id', id);
      
    if (error) throw error;
  };

  const deleteBooking = useMutation({
    mutationFn: async () => {
      setDeleteError(null);
      
      try {
        // Check for related invoices
        const hasInvoices = await checkRelatedInvoices();
        
        if (hasInvoices) {
          // Delete related invoices first
          await deleteRelatedInvoices();
        }
        
        // Now delete the booking
        const { error } = await supabase
          .from('bookings')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      } catch (error: any) {
        setDeleteError(error.message);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Booking deleted',
        description: 'The booking has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      navigate('/bookings');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete booking: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: BookingFormValues) {
    updateBooking.mutate(values);
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this booking? This action will also delete any related invoices and cannot be undone.')) {
      deleteBooking.mutate();
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full mb-4"></div>
            <p>Loading booking...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!booking) {
    return (
      <AppLayout>
        <div className="text-center p-12">
          <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
          <p className="text-muted-foreground mb-6">The booking you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/bookings')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Edit Booking"
        description="Update the details for this event booking."
      />

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{booking.event_name}</CardTitle>
              <CardDescription>ID: {booking.id}</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {deleteError && (
              <div className="px-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {deleteError}
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            <BookingFormFields form={form} />
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/bookings')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateBooking.isPending}
              >
                {updateBooking.isPending ? 'Updating...' : 'Update Booking'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </AppLayout>
  );
};

export default EditBooking;
