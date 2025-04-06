
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Maximize2, CalendarCheck } from 'lucide-react';
import { Venue } from "@/integrations/supabase/client";

interface VenueDetailsDialogProps {
  venue: Venue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VenueDetailsDialog: React.FC<VenueDetailsDialogProps> = ({
  venue,
  open,
  onOpenChange
}) => {
  if (!venue) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{venue.name}</DialogTitle>
          <DialogDescription>
            Detailed information about this venue
          </DialogDescription>
        </DialogHeader>

        {venue.image_url && (
          <div className="relative h-56 w-full overflow-hidden rounded-lg">
            <img
              src={venue.image_url}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className="flex items-center">
              <Users className="mr-1 h-3 w-3" />
              Capacity: {venue.capacity}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Maximize2 className="mr-1 h-3 w-3" />
              {venue.square_footage} sq ft
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <DollarSign className="mr-1 h-3 w-3" />
              ${venue.hourly_rate}/hour
            </Badge>
            <Badge 
              variant={venue.availability === 'available' ? 'default' : 'secondary'}
              className="flex items-center"
            >
              <CalendarCheck className="mr-1 h-3 w-3" />
              {venue.availability || 'Available'}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-sm text-muted-foreground">
              {venue.description || 'No description available.'}
            </p>
          </div>

          {venue.features && venue.features.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-1">Features</h3>
              <div className="flex flex-wrap gap-1">
                {venue.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Created: {new Date(venue.created_at || '').toLocaleDateString()}
            </span>
            <span>
              Last updated: {new Date(venue.updated_at || '').toLocaleDateString()}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VenueDetailsDialog;
