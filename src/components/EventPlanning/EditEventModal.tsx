
import React, { useState } from 'react';
import FormModal from '@/components/Common/FormModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import CreateEventForm from './CreateEventForm';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react'; 

interface EditEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any | null;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  open,
  onOpenChange,
  event
}) => {
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const updateEvent = useMutation({
    mutationFn: async (values: any) => {
      if (!event) throw new Error('No event selected');
      
      const { data, error } = await supabase
        .from('bookings')
        .update({
          event_name: values.event_name,
          event_type: values.event_type,
          venue_id: values.venue_id,
          client_id: values.client_id,
          start_date: values.start_date,
          end_date: values.end_date,
          guest_count: values.guest_count,
          notes: values.notes || null,
        })
        .eq('id', event.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update event: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const checkRelatedInvoices = async () => {
    if (!event) return false;
    
    const { data, error } = await supabase
      .from('invoices')
      .select('id')
      .eq('booking_id', event.id);
      
    if (error) {
      throw error;
    }
    
    return data && data.length > 0;
  };
  
  const deleteRelatedInvoices = async () => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('booking_id', event.id);
      
    if (error) throw error;
  };

  const deleteEvent = useMutation({
    mutationFn: async () => {
      if (!event) throw new Error('No event selected');
      
      setDeleteError(null);
      
      try {
        // Check for related invoices
        const hasInvoices = await checkRelatedInvoices();
        
        if (hasInvoices) {
          // Delete related invoices first
          await deleteRelatedInvoices();
        }
        
        // Now delete the event/booking
        const { error } = await supabase
          .from('bookings')
          .delete()
          .eq('id', event.id);

        if (error) throw error;
      } catch (error: any) {
        setDeleteError(error.message);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete event: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: any) => {
    updateEvent.mutate(values);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event? This action will also delete any related invoices and cannot be undone.')) {
      deleteEvent.mutate();
    }
  };

  return (
    <FormModal
      title="Edit Event"
      description="Update the event details or delete it."
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="lg"
    >
      {event && (
        <>
          {deleteError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {deleteError}
              </AlertDescription>
            </Alert>
          )}
          
          <CreateEventForm
            onSubmit={handleSubmit}
            isSubmitting={updateEvent.isPending}
            onCancel={() => onOpenChange(false)}
            initialValues={{
              event_name: event.event_name,
              event_type: event.event_type,
              venue_id: event.venue_id,
              client_id: event.client_id,
              start_date: event.start_date,
              end_date: event.end_date,
              guest_count: event.guest_count,
              notes: event.notes || '',
            }}
          />
          <div className="mt-6 border-t pt-4">
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteEvent.isPending}
              className="w-full"
            >
              {deleteEvent.isPending ? 'Deleting...' : 'Delete Event'}
            </Button>
          </div>
        </>
      )}
    </FormModal>
  );
};

export default EditEventModal;
