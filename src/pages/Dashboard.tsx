
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
  
  // Use mock data for now
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      // For future implementation, will fetch from Supabase
      return {
        bookings_this_month: 28,
        active_venues: 4,
        total_guests_today: 275
      };
    }
  });

  // Use mock data for notifications
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
  
  // Mock data for events (would come from Supabase in a full implementation)
  const todaysEvents = [
    {
      id: '1',
      title: 'Smith Wedding Reception',
      date: 'Apr 5, 2025',
      time: '14:00 - 22:00',
      venue: 'Grand Ballroom',
      clientName: 'John & Sarah Smith',
      eventType: 'Wedding',
      status: 'ongoing' as const,
      guestCount: 150
    },
    {
      id: '2',
      title: 'Johnson Anniversary Party',
      date: 'Apr 5, 2025',
      time: '18:00 - 23:00',
      venue: 'Garden Terrace',
      clientName: 'Robert Johnson',
      eventType: 'Anniversary',
      status: 'setup' as const,
      guestCount: 75
    },
    {
      id: '3',
      title: 'Corporate Training Seminar',
      date: 'Apr 5, 2025',
      time: '9:00 - 17:00',
      venue: 'Conference Room B',
      clientName: 'Tech Solutions Inc.',
      eventType: 'Corporate',
      status: 'completed' as const,
      guestCount: 50
    }
  ];

  const upcomingEvents = [
    {
      id: '4',
      title: 'Davis Wedding Reception',
      date: 'Apr 6, 2025',
      time: '16:00 - 23:00',
      venue: 'Grand Ballroom',
      clientName: 'Michael & Emma Davis',
      eventType: 'Wedding',
      status: 'pending' as const,
      guestCount: 120
    },
    {
      id: '5',
      title: 'Charity Fundraiser Gala',
      date: 'Apr 7, 2025',
      time: '18:00 - 22:00',
      venue: 'Main Hall',
      clientName: 'City Children Foundation',
      eventType: 'Charity',
      status: 'pending' as const,
      guestCount: 200
    },
    {
      id: '6',
      title: 'Wilson Birthday Party',
      date: 'Apr 8, 2025',
      time: '13:00 - 18:00',
      venue: 'Private Dining Room',
      clientName: 'Jessica Wilson',
      eventType: 'Birthday',
      status: 'pending' as const,
      guestCount: 30
    }
  ];

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
          value={isLoadingStats ? "Loading..." : `${dashboardStats?.bookings_this_month}`}
          icon={<Calendar />}
          trend={{ value: 4, isPositive: true }}
          onClick={handleViewBookings}
        />
        <StatCard 
          title="Active Venues" 
          value={isLoadingStats ? "Loading..." : `${dashboardStats?.active_venues}/6`}
          icon={<Calendar />}
          onClick={() => navigate('/venues')}
        />
        <StatCard 
          title="Total Guests Today" 
          value={isLoadingStats ? "Loading..." : `${dashboardStats?.total_guests_today}`}
          icon={<Users />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Events</CardTitle>
            <CardDescription>All events scheduled for today, April 5, 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysEvents.map(event => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
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
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
            
            <ViewCalendarButton />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Venue Availability</CardTitle>
            <CardDescription>Today's occupancy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Grand Ballroom</span>
                  <span className="text-cyan-600">75% Booked</span>
                </div>
                <ProgressBar percent={75} color="bg-cyan-500" size="md" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Garden Terrace</span>
                  <span className="text-cyan-600">50% Booked</span>
                </div>
                <ProgressBar percent={50} color="bg-cyan-500" size="md" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Conference Room A</span>
                  <span className="text-cyan-600">0% Booked</span>
                </div>
                <ProgressBar percent={0} color="bg-cyan-500" size="md" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Conference Room B</span>
                  <span className="text-cyan-600">100% Booked</span>
                </div>
                <ProgressBar percent={100} color="bg-cyan-500" size="md" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Private Dining Room</span>
                  <span className="text-cyan-600">25% Booked</span>
                </div>
                <ProgressBar percent={25} color="bg-cyan-500" size="md" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Main Hall</span>
                  <span className="text-cyan-600">0% Booked</span>
                </div>
                <ProgressBar percent={0} color="bg-cyan-500" size="md" />
              </div>
            </div>
            
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
