
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { PlusCircle, X } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { InputField } from '@/components/Common/FormFields';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  client_type: z.string().default('individual'),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface QuickAddClientProps {
  onClientAdded: (client: { id: string; name: string }) => void;
}

const QuickAddClient: React.FC<QuickAddClientProps> = ({ onClientAdded }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      client_type: 'individual',
    },
  });

  const createClient = useMutation({
    mutationFn: async (values: ClientFormValues) => {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: values.name,
          email: values.email || null,
          phone: values.phone || null,
          client_type: 'individual',
        })
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Client has been created.',
      });
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      onClientAdded({ id: data.id, name: data.name });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to create client: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: ClientFormValues) {
    createClient.mutate(values);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => setOpen(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Quick Add
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Quickly add a new client to the system. You can add more details later.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                form={form}
                name="name"
                label="Client Name"
                placeholder="Enter client name"
              />
              
              <InputField
                form={form}
                name="email"
                label="Email"
                placeholder="Email address (optional)"
                type="email"
              />
              
              <InputField
                form={form}
                name="phone"
                label="Phone"
                placeholder="Phone number (optional)"
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createClient.isPending}
                >
                  {createClient.isPending ? 'Adding...' : 'Add Client'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickAddClient;
