
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientFormSchema, ClientFormValues, CLIENT_TYPE_OPTIONS } from './ClientFormSchema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { InputField, TextareaField, SelectField } from '@/components/Common/FormFields';
import { DialogFooter } from '@/components/ui/dialog';

interface ClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({ open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      type: 'individual',
    }
  });

  const handleSubmit = async (values: ClientFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Here would be the API call to add the client to your database
      console.log('Client data submitted:', values);
      
      // Simulate an API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Client Added',
        description: `${values.name} has been added successfully.`,
      });
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: 'Error',
        description: 'There was a problem adding the client.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter the client details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <InputField
              form={form}
              name="name"
              label="Client Name"
              placeholder="Enter client name or company"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField
                form={form}
                name="contact_person"
                label="Contact Person"
                placeholder="Primary contact"
              />
              
              <SelectField
                form={form}
                name="type"
                label="Client Type"
                options={CLIENT_TYPE_OPTIONS}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <InputField
                form={form}
                name="email"
                label="Email"
                placeholder="Contact email"
              />
              
              <InputField
                form={form}
                name="phone"
                label="Phone"
                placeholder="Contact phone"
              />
            </div>
            
            <InputField
              form={form}
              name="address"
              label="Address"
              placeholder="Full address"
            />
            
            <TextareaField
              form={form}
              name="notes"
              label="Notes"
              placeholder="Additional notes about this client"
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Client'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientModal;
