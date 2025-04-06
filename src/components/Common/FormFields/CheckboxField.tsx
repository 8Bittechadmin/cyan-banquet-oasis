
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';

interface CheckboxFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  description?: string;
  className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  form,
  name,
  label,
  description,
  className
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${className}`}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              {label}
            </FormLabel>
            {description && (
              <FormDescription>
                {description}
              </FormDescription>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};
