
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

interface VenueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VenueModal: React.FC<VenueModalProps> = ({ open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: VenueFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Here would be the API call to add the venue to your database
      console.log('Venue data submitted:', values);
      
      // Simulate an API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Venue Added',
        description: `${values.name} has been added successfully.`,
      });
      
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
