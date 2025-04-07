
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Maximize2, CalendarCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface VenueDetailsDialogProps {
  venueId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VenueDetailsDialog: React.FC<VenueDetailsDialogProps> = ({
  venueId,
  open,
  onOpenChange
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data: venue, isLoading } = useQuery({
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
    enabled: open && !!venueId,
  });
  
  // Mock multiple images for the slider (in a real app, these would come from the venue)
  const mockImages = [
    venue?.image_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=500&auto=format&fit=crop',
  ];
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === mockImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? mockImages.length - 1 : prevIndex - 1
    );
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="py-8 text-center">Loading venue details...</div>
        </DialogContent>
      </Dialog>
    );
  }

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

        <div className="relative h-56 w-full overflow-hidden rounded-lg">
          {/* Image slider */}
          <div className="w-full h-full">
            <img
              src={mockImages[currentImageIndex]}
              alt={`${venue.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Navigation buttons */}
          <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Image indicator dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {mockImages.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

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
              {venue.availability === 'available' ? 'Available' : venue.availability}
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
