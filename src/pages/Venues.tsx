
import React from 'react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Plus, Users, Square, Clock } from 'lucide-react';

const Venues: React.FC = () => {
  // Mock venue data
  const venues = [
    {
      id: 'V001',
      name: 'Grand Ballroom',
      capacity: 300,
      sqFt: 4500,
      hourlyRate: 800,
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=500&auto=format&fit=crop',
      description: 'Our largest and most luxurious venue, perfect for weddings and galas.'
    },
    {
      id: 'V002',
      name: 'Garden Pavilion',
      capacity: 150,
      sqFt: 2500,
      hourlyRate: 600,
      availability: 'booked',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=500&auto=format&fit=crop',
      description: 'An elegant outdoor venue with stunning garden views and weather protection.'
    },
    {
      id: 'V003',
      name: 'Executive Conference Room',
      capacity: 50,
      sqFt: 1200,
      hourlyRate: 350,
      availability: 'maintenance',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=500&auto=format&fit=crop',
      description: 'Professional setting with state-of-the-art AV equipment for business meetings.'
    },
    {
      id: 'V004',
      name: 'Terrace Hall',
      capacity: 120,
      sqFt: 1800,
      hourlyRate: 500,
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1606744888344-493238951221?q=80&w=500&auto=format&fit=crop',
      description: 'Beautiful indoor-outdoor space with a retractable roof and city views.'
    },
    {
      id: 'V005',
      name: 'Lakeside Room',
      capacity: 80,
      sqFt: 1500,
      hourlyRate: 450,
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=500&auto=format&fit=crop',
      description: 'Intimate setting with floor-to-ceiling windows overlooking our private lake.'
    },
    {
      id: 'V006',
      name: 'Banquet Hall B',
      capacity: 200,
      sqFt: 3000,
      hourlyRate: 650,
      availability: 'booked',
      image: 'https://images.unsplash.com/photo-1562664377-709f2c337eb2?q=80&w=500&auto=format&fit=crop',
      description: 'Versatile space suitable for medium to large events and conferences.'
    }
  ];
  
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
          onClick: () => console.log("Add new venue")
        }}
      />
      
      <Tabs defaultValue="grid" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="calendar">Availability Calendar</TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm">
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
                    src={venue.image} 
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
                      <span>{venue.sqFt} sq ft</span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>${venue.hourlyRate}/hour</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full">View Details</Button>
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
    </AppLayout>
  );
};

export default Venues;
