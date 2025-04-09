import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Square, Clock, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface VenueDetailsDialogProps {
  venueId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VenueDetailsDialog: React.FC<VenueDetailsDialogProps> = ({ venueId, open, onOpenChange }) => {
  const { data: venue, isLoading, error } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', venueId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: open, // Only fetch when the dialog is open
  });

  if (error) {
    console.error('Error loading venue details:', error);
    toast({
      title: 'Error loading venue details',
      description: 'There was a problem loading the venue details. Please try again later.',
      variant: 'destructive',
    });
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'booked': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getAvailabilityLabel = (availability: string) => {
    return availability.charAt(0).toUpperCase() + availability.slice(1);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {/* This trigger is not visible, it's just needed for the dialog to open */}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{venue?.name || 'Loading...'}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <AlertDialogDescription>Loading venue details...</AlertDialogDescription>
          ) : venue ? (
            <>
              <AlertDialogDescription>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>Capacity: {venue.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4 text-gray-500" />
                    <span>{venue.square_footage} sq ft</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>${venue.hourly_rate}/hour</span>
                  </div>
                  {venue.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{venue.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Badge className={getAvailabilityColor(venue.availability || 'available')}>
                      {getAvailabilityLabel(venue.availability || 'available')}
                    </Badge>
                  </div>
                  {venue.description && (
                    <div>
                      <p className="text-muted-foreground">{venue.description}</p>
                    </div>
                  )}
                </div>
              </AlertDialogDescription>
            </>
          ) : (
            <AlertDialogDescription>Failed to load venue details.</AlertDialogDescription>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Okay</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VenueDetailsDialog;
