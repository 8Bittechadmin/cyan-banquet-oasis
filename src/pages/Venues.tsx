
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Plus, Users, Square, Clock } from 'lucide-react';
import VenueModal from '@/components/Venues/VenueModal';
import VenueDetailsDialog from '@/components/Venues/VenueDetailsDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Venues: React.FC = () => {
  const [isAddVenueModalOpen, setIsAddVenueModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });
  
  const handleViewDetails = (venueId: string) => {
    setSelectedVenueId(venueId);
    setIsDetailsDialogOpen(true);
  };
  
  const getAvailabilityColor = (availability: string) => {
    switch(availability) {
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
    <AppLayout>
      <PageHeader 
        title="Venues" 
        description="Manage your banquet halls and event spaces"
        action={{
          label: "Add Venue",
          icon: <Plus size={16} />,
          onClick: () => setIsAddVenueModalOpen(true)
        }}
      />
      
      <Tabs defaultValue="grid" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="calendar">Availability Calendar</TabsTrigger>
          </TabsList>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAvailabilityModalOpen(true)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Check Availability
          </Button>
        </div>
        
        <TabsContent value="grid" className="m-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {venues.map(venue => (
              <Card key={venue.id} className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={venue.image_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=500&auto=format&fit=crop'} 
                    alt={venue.name} 
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{venue.name}</CardTitle>
                    <Badge className={getAvailabilityColor(venue.availability)}>
                      {getAvailabilityLabel(venue.availability)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{venue.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Capacity: {venue.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4 text-gray-500" />
                      <span>{venue.square_footage} sq ft</span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>${venue.hourly_rate}/hour</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewDetails(venue.id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar" className="m-0">
          <div className="bg-white rounded-md border min-h-[600px] p-6">
            <div className="text-center text-gray-500 pt-40">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Venue Availability Calendar</h3>
              <p className="mt-1">Calendar showing venue bookings and availability periods would be shown here.</p>
              <p className="text-sm mt-2">A more comprehensive booking system could be integrated here.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <VenueModal 
        open={isAddVenueModalOpen}
        onOpenChange={setIsAddVenueModalOpen}
      />
      
      {selectedVenueId && (
        <VenueDetailsDialog
          venueId={selectedVenueId}
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        />
      )}
    </AppLayout>
  );
};

export default Venues;
