
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VenueFormSchema, VenueFormValues, AVAILABILITY_OPTIONS } from './VenueFormSchema';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { InputField, SelectField, TextareaField } from '@/components/Common/FormFields';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

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
    square_footage: 1,
    hourly_rate: 1,
    description: '',
    location: '',
    availability: 'available',
    image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=500&auto=format&fit=crop',
    features: [],
  },
}) => {
  const form = useForm<VenueFormValues>({
    resolver: zodResolver(VenueFormSchema),
    defaultValues: defaultValues as VenueFormValues,
  });

  return (
    <Form {...form}>
      <div className="flex justify-between items-center mb-4">
        <DialogClose className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
          <X className="h-4 w-4" />
        </DialogClose>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <InputField
          form={form}
          name="name"
          label="Venue Name"
          placeholder="Enter venue name"
        />
        
        <div className="grid grid-cols-2 gap-3">
          <InputField
            form={form}
            name="capacity"
            label="Capacity"
            type="number"
            placeholder="Enter capacity"
          />
          
          <InputField
            form={form}
            name="square_footage"
            label="Square Footage"
            type="number"
            placeholder="Enter square footage"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <InputField
            form={form}
            name="hourly_rate"
            label="Hourly Rate"
            type="number"
            placeholder="Enter hourly rate"
          />
          
          <InputField
            form={form}
            name="location"
            label="Location"
            placeholder="Enter venue location"
          />
        </div>
        
        <TextareaField
          form={form}
          name="description"
          label="Description (Optional)"
          placeholder="Enter venue description"
          required={false}
        />
        
        <InputField
          form={form}
          name="image_url"
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
