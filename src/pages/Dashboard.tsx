
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import EventCard from '@/components/EventCard';
import ProgressBar from '@/components/ProgressBar';
import { 
  Calendar,
  CalendarPlus,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ViewCalendarButton, CheckAvailabilityButton } from '@/components/Dashboard/ActionButtons';
import { AddTaskModal } from '@/components/Tasks/AddTaskModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const Dashboard = () => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Fetch real dashboard stats from Supabase
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data: statsData, error: statsError } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single();
      
      if (statsError) {
        console.error('Error fetching dashboard stats:', statsError);
        // Return default values if there's an error
        return {
          bookings_this_month: 0,
          active_venues: 0,
          total_guests_today: 0
        };
      }
      
      // If no data exists, let's fetch real counts from the respective tables
      if (!statsData) {
        // Count active venues
        const { data: venuesData, error: venuesError } = await supabase
          .from('venues')
          .select('id')
          .eq('availability', 'available');
        
        // Count bookings this month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('id')
          .gte('start_date', firstDayOfMonth.toISOString())
          .lte('start_date', lastDayOfMonth.toISOString());
        
        // Count guests today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const { data: todayBookings, error: todayBookingsError } = await supabase
          .from('bookings')
          .select('guest_count')
          .gte('start_date', today.toISOString())
          .lt('start_date', tomorrow.toISOString());
        
        const totalGuestsToday = todayBookings?.reduce((total, booking) => 
          total + (booking.guest_count || 0), 0) || 0;
        
        return {
          bookings_this_month: bookingsData?.length || 0,
          active_venues: venuesData?.length || 0,
          total_guests_today: totalGuestsToday
        };
      }
      
      return statsData;
    }
  });

  // Fetch notifications from Supabase
  const { data: notifications } = useQuery({
    queryKey: ['dashboardNotifications'],
    queryFn: async () => {
      const { data } = await supabase.from('dashboard_notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      return data || [];
    }
  });

  // Fetch tasks
  const { data: tasks, refetch: refetchTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      return data || [];
    }
  });

  // Toggle task completion mutation
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string, completed: boolean }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ status: completed ? 'completed' : 'pending' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      refetchTasks();
    },
    onError: (error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle task completion toggle
  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    toggleTaskMutation.mutate({ id: taskId, completed });
  };

  const handleAddNewBooking = () => {
    navigate('/bookings/new');
  };
  
  const handleViewBookings = () => {
    navigate('/bookings');
  };
  
  // Fetch today's events from Supabase
  const { data: todaysEvents = [] } = useQuery({
    queryKey: ['todaysEvents'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          id, 
          event_name, 
          start_date, 
          end_date, 
          guest_count, 
          status, 
          event_type,
          venues(name), 
          clients(name)
        `)
        .gte('start_date', today.toISOString())
        .lt('start_date', tomorrow.toISOString());
      
      if (error) {
        console.error('Error fetching today\'s events:', error);
        return [];
      }
      
      return bookings.map(booking => {
        const startDate = new Date(booking.start_date);
        const endDate = booking.end_date ? new Date(booking.end_date) : null;
        
        const formatTime = (date: Date) => {
          return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          });
        };
        
        const timeRange = endDate 
          ? `${formatTime(startDate)} - ${formatTime(endDate)}` 
          : `${formatTime(startDate)}`;
        
        return {
          id: booking.id,
          title: booking.event_name,
          date: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: timeRange,
          venue: booking.venues?.name || 'Venue not specified',
          clientName: booking.clients?.name || 'Client not specified',
          eventType: booking.event_type,
          status: booking.status as 'pending' | 'confirmed' | 'cancelled' | 'ongoing' | 'setup' | 'completed',
          guestCount: booking.guest_count
        };
      });
    }
  });

  // Fetch upcoming events from Supabase
  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          id, 
          event_name, 
          start_date, 
          end_date, 
          guest_count, 
          status, 
          event_type,
          venues(name), 
          clients(name)
        `)
        .gt('start_date', today.toISOString())
        .lte('start_date', nextWeek.toISOString())
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching upcoming events:', error);
        return [];
      }
      
      return bookings.map(booking => {
        const startDate = new Date(booking.start_date);
        const endDate = booking.end_date ? new Date(booking.end_date) : null;
        
        const formatTime = (date: Date) => {
          return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          });
        };
        
        const timeRange = endDate 
          ? `${formatTime(startDate)} - ${formatTime(endDate)}` 
          : `${formatTime(startDate)}`;
        
        return {
          id: booking.id,
          title: booking.event_name,
          date: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: timeRange,
          venue: booking.venues?.name || 'Venue not specified',
          clientName: booking.clients?.name || 'Client not specified',
          eventType: booking.event_type,
          status: booking.status as 'pending' | 'confirmed' | 'cancelled' | 'ongoing' | 'setup' | 'completed',
          guestCount: booking.guest_count
        };
      });
    }
  });

  // Fetch venue occupancy data from Supabase
  const { data: venueOccupancy = [] } = useQuery({
    queryKey: ['venueOccupancy'],
    queryFn: async () => {
      const { data: venues, error } = await supabase
        .from('venues')
        .select('id, name');
      
      if (error || !venues) {
        console.error('Error fetching venues:', error);
        return [];
      }
      
      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const venuesWithOccupancy = await Promise.all(venues.map(async venue => {
        // For each venue, calculate how many hours it's booked for today
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('start_date, end_date')
          .eq('venue_id', venue.id)
          .gte('start_date', today.toISOString())
          .lt('start_date', tomorrow.toISOString());
        
        if (bookingsError) {
          console.error(`Error fetching bookings for venue ${venue.id}:`, bookingsError);
          return { 
            name: venue.name, 
            percent: 0 
          };
        }
        
        // Calculate total booked time in hours for today (assuming 24h availability)
        let totalBookedMinutes = 0;
        
        bookings?.forEach(booking => {
          const startDate = new Date(booking.start_date);
          const endDate = booking.end_date ? new Date(booking.end_date) : new Date(startDate);
          
          if (endDate > startDate) {
            // If booking spans multiple days, only count hours within today
            const bookingStartInToday = startDate < today ? today : startDate;
            const bookingEndInToday = endDate > tomorrow ? tomorrow : endDate;
            
            // Calculate minutes between bookingStartInToday and bookingEndInToday
            const minutesDiff = (bookingEndInToday.getTime() - bookingStartInToday.getTime()) / (1000 * 60);
            totalBookedMinutes += minutesDiff;
          }
        });
        
        // Calculate percentage of 24 hours (1440 minutes)
        const percentBooked = Math.min(100, Math.round((totalBookedMinutes / 1440) * 100));
        
        return {
          name: venue.name,
          percent: percentBooked
        };
      }));
      
      return venuesWithOccupancy;
    }
  });

  return (
    <AppLayout>
      <PageHeader 
        title="Dashboard" 
        description="Overview of today's events and key metrics."
        action={{
          label: "Add New Booking",
          icon: <CalendarPlus size={16} />,
          onClick: handleAddNewBooking
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Bookings This Month" 
          value={isLoadingStats ? "Loading..." : `${dashboardStats?.bookings_this_month || 0}`}
          icon={<Calendar />}
          trend={{ value: 4, isPositive: true }}
          onClick={handleViewBookings}
        />
        <StatCard 
          title="Active Venues" 
          value={isLoadingStats ? "Loading..." : `${dashboardStats?.active_venues || 0}/6`}
          icon={<Calendar />}
          onClick={() => navigate('/venues')}
        />
        <StatCard 
          title="Total Guests Today" 
          value={isLoadingStats ? "Loading..." : `${dashboardStats?.total_guests_today || 0}`}
          icon={<Users />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Events</CardTitle>
            <CardDescription>All events scheduled for today, {new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</CardDescription>
          </CardHeader>
          <CardContent>
            {todaysEvents.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No events scheduled for today.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaysEvents.map(event => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            )}
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={handleViewBookings}
            >
              View All Bookings
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <Tabs defaultValue="tasks">
              <div className="flex justify-between items-center">
                <CardTitle>Quick Actions</CardTitle>
                <TabsList>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="notifications">Alerts</TabsTrigger>
                </TabsList>
              </div>
            
              <CardContent className="pt-4 px-0">
                <TabsContent value="tasks" className="mt-0 space-y-4">
                  <div className="space-y-3">
                    {tasks && tasks.length > 0 ? (
                      tasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-2">
                          <Checkbox 
                            id={`task-${task.id}`}
                            checked={task.status === 'completed'}
                            onCheckedChange={(checked) => toggleTaskCompletion(task.id, !!checked)}
                          />
                          <label 
                            htmlFor={`task-${task.id}`} 
                            className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}
                          >
                            {task.title}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-sm text-gray-500">
                        No tasks available
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => setIsAddTaskModalOpen(true)}
                  >
                    Add Task
                  </Button>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0">
                  <div className="space-y-3">
                    {notifications && notifications.length > 0 ? (
                      notifications.map((item) => (
                        <div key={item.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                          <h4 className="text-sm font-medium">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                          <span className="text-xs text-gray-400 mt-1">{item.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-sm text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No upcoming events scheduled for the next 7 days.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            )}
            
            <ViewCalendarButton />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Venue Availability</CardTitle>
            <CardDescription>Today's occupancy</CardDescription>
          </CardHeader>
          <CardContent>
            {venueOccupancy.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No venue occupancy data available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {venueOccupancy.map((venue) => (
                  <div key={venue.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{venue.name}</span>
                      <span className="text-cyan-600">{venue.percent}% Booked</span>
                    </div>
                    <ProgressBar percent={venue.percent} color="bg-cyan-500" size="md" />
                  </div>
                ))}
              </div>
            )}
            
            <CheckAvailabilityButton />
          </CardContent>
        </Card>
      </div>
      
      <AddTaskModal 
        open={isAddTaskModalOpen}
        onOpenChange={setIsAddTaskModalOpen}
      />
    </AppLayout>
  );
};

export default Dashboard;
