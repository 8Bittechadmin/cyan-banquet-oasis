
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DateTimeFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  className?: string;
  optional?: boolean;
}

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
  form,
  name,
  label,
  className,
  optional = false
}) => {
  const handleClear = () => {
    form.setValue(name, undefined);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex justify-between items-center">
            <FormLabel>{label}{optional && <span className="text-xs text-muted-foreground ml-1">(Optional)</span>}</FormLabel>
            {field.value && optional && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <FormControl>
            <Input 
              type="datetime-local" 
              {...field} 
              value={field.value ? field.value : ''} 
              onChange={(e) => {
                if (e.target.value === '') {
                  field.onChange(undefined);
                } else {
                  field.onChange(e.target.value);
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
