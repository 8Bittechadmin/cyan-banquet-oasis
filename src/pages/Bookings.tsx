import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, List, Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Bookings: React.FC = () => {
  const [viewType, setViewType] = useState<'calendar' | 'list'>('calendar');
  const navigate = useNavigate();
  
  // Mock booking data
  const bookings = [
    {
      id: 'B001',
      client: 'Johnson Family',
      event: 'Wedding Reception',
      venue: 'Grand Ballroom',
      date: '2025-04-15',
      time: '18:00 - 22:00',
      guests: 150,
      status: 'confirmed'
    },
    {
      id: 'B002',
      client: 'TechCorp Inc.',
      event: 'Annual Conference',
      venue: 'Conference Hall A',
      date: '2025-04-10',
      time: '09:00 - 17:00',
      guests: 80,
      status: 'pending'
    },
    {
      id: 'B003',
      client: 'Smith Graduation',
      event: 'Graduation Party',
      venue: 'Garden Pavilion',
      date: '2025-04-20',
      time: '14:00 - 18:00',
      guests: 60,
      status: 'confirmed'
    },
    {
      id: 'B004',
      client: 'Martinez Birthday',
      event: 'Birthday Celebration',
      venue: 'Terrace Hall',
      date: '2025-04-08',
      time: '19:00 - 23:00',
      guests: 45,
      status: 'cancelled'
    },
    {
      id: 'B005',
      client: 'City Council',
      event: 'Charity Gala',
      venue: 'Grand Ballroom',
      date: '2025-04-25',
      time: '18:30 - 23:30',
      guests: 200,
      status: 'confirmed'
    },
  ];
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Calendar view placeholder (in a real app this would be a full calendar component)
  const CalendarView = () => (
    <div className="bg-white rounded-md border min-h-[600px] p-6">
      <div className="text-center text-gray-500 pt-40">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">Calendar View</h3>
        <p className="mt-1">Calendar implementation with event visualization would be shown here.</p>
        <p className="text-sm mt-2">Libraries like FullCalendar or React Big Calendar can be integrated here.</p>
      </div>
    </div>
  );
  
  return (
    <AppLayout>
      <PageHeader 
        title="Bookings & Reservations" 
        description="Manage all your event bookings in one place"
        action={{
          label: "New Booking",
          icon: <Plus size={16} />,
          onClick: () => navigate('/bookings/new')
        }}
      />
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <Tabs 
          defaultValue="all" 
          className="w-full max-w-md"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <Button 
            variant={viewType === 'calendar' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewType('calendar')}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Calendar</span>
          </Button>
          <Button 
            variant={viewType === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewType('list')}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">List</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search bookings..." 
            className="w-full pl-9" 
          />
        </div>
        <Button variant="outline" className="flex gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>
      
      {viewType === 'calendar' ? (
        <CalendarView />
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Event</TableHead>
                  <TableHead className="hidden lg:table-cell">Venue</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Time</TableHead>
                  <TableHead className="hidden lg:table-cell">Guests</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map(booking => (
                  <TableRow key={booking.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.client}</TableCell>
                    <TableCell className="hidden md:table-cell">{booking.event}</TableCell>
                    <TableCell className="hidden lg:table-cell">{booking.venue}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell className="hidden sm:table-cell">{booking.time}</TableCell>
                    <TableCell className="hidden lg:table-cell">{booking.guests}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
};

export default Bookings;
