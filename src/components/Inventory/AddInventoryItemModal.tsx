
import React from 'react';
import FormModal from '@/components/Common/FormModal';
import AddInventoryItemForm from './AddInventoryItemForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AddInventoryItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddInventoryItemModal: React.FC<AddInventoryItemModalProps> = ({
  open,
  onOpenChange
}) => {
  const queryClient = useQueryClient();
  
  const createInventoryItem = useMutation({
    mutationFn: async (values: any) => {
      const { data, error } = await supabase
        .from('inventory')
        .insert({
          name: values.name,
          category: values.category,
          quantity: values.quantity,
          min_quantity: values.min_quantity,
          unit: values.unit || null,
          status: values.status,
          notes: values.notes || null
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Inventory item has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add inventory item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: any) => {
    createInventoryItem.mutate(values);
  };

  return (
    <FormModal
      title="Add Inventory Item"
      description="Enter the details for the new inventory item."
      open={open}
      onOpenChange={onOpenChange}
    >
      <AddInventoryItemForm
        onSubmit={handleSubmit}
        isSubmitting={createInventoryItem.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </FormModal>
  );
};

export default AddInventoryItemModal;
