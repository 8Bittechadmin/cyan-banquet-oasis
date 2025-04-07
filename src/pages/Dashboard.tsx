
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import EventCard from '@/components/EventCard';
import ProgressBar from '@/components/ProgressBar';
import { 
  Calendar,
  CalendarPlus,
  Clock,
  DollarSign,
  ListChecks,
  MessageSquare,
  Package,
  PlusCircle,
  UserPlus,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ViewCalendarButton, CheckAvailabilityButton, AddTaskButton } from '@/components/Dashboard/ActionButtons';
import { AddTaskModal } from '@/components/Tasks/AddTaskModal';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Fetch dashboard statistics
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch dashboard notifications
  const { data: notifications } = useQuery({
    queryKey: ['dashboardNotifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch tasks
  const { data: tasks, refetch: refetchTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Format tasks for display
      return data.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.status === 'completed'
      }));
    },
    initialData: [] // Default to empty array while loading
  });

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

  // Handle task completion toggle
  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      await supabase
        .from('tasks')
        .update({ status: completed ? 'completed' : 'pending' })
        .eq('id', taskId);
      
      // Refetch tasks to update the UI
      refetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleAddNewBooking = () => {
    navigate('/bookings/new');
  };
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Revenue" 
          value={isLoadingStats ? "Loading..." : `$${dashboardStats?.total_revenue.toLocaleString()}`}
          icon={<DollarSign />} 
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Bookings This Month" 
          value={isLoadingStats ? "Loading..." : `${dashboardStats?.bookings_this_month}`}
          icon={<Calendar />}
          trend={{ value: 4, isPositive: true }}
        />
        <StatCard 
          title="Active Venues" 
          value={isLoadingStats ? "Loading..." : `${dashboardStats?.active_venues}/6`}
          icon={<Package />}
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
                          <div 
                            className={`w-5 h-5 rounded-full mt-0.5 border flex items-center justify-center cursor-pointer ${task.completed ? 'bg-cyan-100 border-cyan-500 text-cyan-500' : 'border-gray-300'}`}
                            onClick={() => toggleTaskCompletion(task.id, !task.completed)}
                          >
                            {task.completed && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                          </div>
                          <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</span>
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
                    <PlusCircle size={14} className="mr-1" /> Add Task
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
