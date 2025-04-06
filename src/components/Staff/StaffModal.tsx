
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import StaffForm from './StaffForm';
import { StaffFormValues } from './StaffFormSchema';

interface StaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({ open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: StaffFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Here would be the API call to add the staff member to your database
      console.log('Staff data submitted:', values);
      
      // Simulate an API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Staff Added',
        description: `${values.name} has been added successfully.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding staff:', error);
      toast({
        title: 'Error',
        description: 'There was a problem adding the staff member.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Enter the details for the new staff member. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <StaffForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StaffModal;
