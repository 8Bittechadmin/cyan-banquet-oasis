
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, List, Plus, Filter, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import BookingCalendar from '@/components/Bookings/BookingCalendar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Venue {
  id: string;
  name: string;
}

interface Client {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  client_id: string;
  venue_id: string;
  start_date: string;
  end_date: string;
  guest_count: number;
  total_amount: number | null;
  deposit_amount: number | null;
  deposit_paid: boolean;
  created_at: string;
  updated_at: string;
  event_type: string;
  event_name: string;
  status: string;
  notes: string | null;
  client: Client | null;
  venue: Venue | null;
}

const Bookings: React.FC = () => {
  const [viewType, setViewType] = useState<'calendar' | 'list'>('calendar');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const navigate = useNavigate();
  
  const { data: bookingsData = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          client:clients(id, name),
          venue:venues(id, name)
        `)
        .order('start_date');
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      // Transform data to ensure it matches the expected format
      const formattedBookings: Booking[] = (data || []).map(booking => ({
        ...booking,
        // Handle potential null references
        client: booking.client || null,
        venue: booking.venue || null
      }));

      return formattedBookings;
    },
  });
  
  // Filter bookings based on the active tab and search term
  const filteredBookings = bookingsData.filter(booking => {
    // Filter by status
    if (activeTab !== 'all' && booking.status !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.event_name.toLowerCase().includes(searchLower) ||
        booking.event_type.toLowerCase().includes(searchLower) ||
        (booking.client?.name || '').toLowerCase().includes(searchLower) ||
        (booking.venue?.name || '').toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
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
          value={activeTab}
          onValueChange={setActiveTab}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2 h-5 w-5"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button 
          variant="outline" 
          className="flex gap-2"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full mb-4"></div>
            <p>Loading bookings...</p>
          </div>
        </div>
      ) : viewType === 'calendar' ? (
        <BookingCalendar bookings={filteredBookings} />
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBookings.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No bookings found matching the current filters.
              </div>
            ) : (
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
                  {filteredBookings.map(booking => (
                    <TableRow 
                      key={booking.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/bookings/edit/${booking.id}`)}
                    >
                      <TableCell className="font-medium">
                        {booking.id.substring(0, 6)}...
                      </TableCell>
                      <TableCell>
                        {booking.client?.name || 'No client'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {booking.event_name}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {booking.venue?.name || 'No venue'}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.start_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(booking.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {booking.guest_count}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
};

export default Bookings;
