
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VenueFormSchema, VenueFormValues, AVAILABILITY_OPTIONS } from './VenueFormSchema';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { InputField, SelectField, TextareaField } from '@/components/Common/FormFields';
import { DialogFooter } from '@/components/ui/dialog';

interface VenueFormProps {
  onSubmit: (values: VenueFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  defaultValues?: Partial<VenueFormValues>;
}

const VenueForm: React.FC<VenueFormProps> = ({
  onSubmit,
  isSubmitting,
  onCancel,
  defaultValues = {
    name: '',
    capacity: 1,
    sqFt: 1,
    hourlyRate: 1,
    description: '',
    availability: 'available',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=500&auto=format&fit=crop',
  },
}) => {
  const form = useForm<VenueFormValues>({
    resolver: zodResolver(VenueFormSchema),
    defaultValues: defaultValues as VenueFormValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          form={form}
          name="name"
          label="Venue Name"
          placeholder="Enter venue name"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <InputField
            form={form}
            name="capacity"
            label="Capacity"
            type="number"
            placeholder="Enter capacity"
          />
          
          <InputField
            form={form}
            name="sqFt"
            label="Square Footage"
            type="number"
            placeholder="Enter square footage"
          />
        </div>
        
        <InputField
          form={form}
          name="hourlyRate"
          label="Hourly Rate"
          type="number"
          placeholder="Enter hourly rate"
        />
        
        <TextareaField
          form={form}
          name="description"
          label="Description"
          placeholder="Enter venue description"
        />
        
        <InputField
          form={form}
          name="image"
          label="Image URL"
          placeholder="Enter image URL"
        />
        
        <SelectField
          form={form}
          name="availability"
          label="Availability"
          options={AVAILABILITY_OPTIONS}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Venue'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default VenueForm;
