
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import VenueForm from './VenueForm';
import { VenueFormValues } from './VenueFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface VenueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VenueModal: React.FC<VenueModalProps> = ({ open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (values: VenueFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Insert the venue into the database
      const { data, error } = await supabase
        .from('venues')
        .insert({
          name: values.name,
          description: values.description,
          capacity: values.capacity,
          square_footage: values.square_footage,
          hourly_rate: values.hourly_rate,
          availability: values.availability,
          image_url: values.image_url,
          features: values.features
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Venue Added',
        description: `${values.name} has been added successfully.`,
      });
      
      // Invalidate the venues query to refetch data
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding venue:', error);
      toast({
        title: 'Error',
        description: 'There was a problem adding the venue.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Venue</DialogTitle>
          <DialogDescription>
            Enter the details for the new venue. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <VenueForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VenueModal;
