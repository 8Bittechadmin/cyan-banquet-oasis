
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DateTimeFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  className?: string;
  optional?: boolean;
  required?: boolean;
}

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
  form,
  name,
  label,
  className,
  optional = false,
  required = false
}) => {
  const isMobile = useIsMobile();
  
  const handleClear = () => {
    form.setValue(name, '');
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex justify-between items-center">
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
              {optional && <span className="text-xs text-muted-foreground ml-1">(Optional)</span>}
            </FormLabel>
            {field.value && (
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
                field.onChange(e.target.value);
              }}
              className={isMobile ? "text-sm" : ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
