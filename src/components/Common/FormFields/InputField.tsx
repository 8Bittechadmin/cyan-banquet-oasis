
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface InputFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  step?: string;
  readOnly?: boolean;
  onValueChange?: (value: any) => void; // Added this prop
}

export const InputField: React.FC<InputFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  className,
  step,
  readOnly,
  onValueChange
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              placeholder={placeholder} 
              type={type} 
              step={step}
              readOnly={readOnly}
              {...field}
              value={field.value || ''}
              onChange={(e) => {
                field.onChange(e);
                if (onValueChange) {
                  onValueChange(e.target.value);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
