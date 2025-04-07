
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Clipboard, Check, X, Search, Filter, ChevronRight, Edit, Trash } from 'lucide-react';
import CreateEventModal from '@/components/EventPlanning/CreateEventModal';
import EditEventModal from '@/components/EventPlanning/EditEventModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const EventPlanning: React.FC = () => {
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch real events from the database
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id, 
          event_name, 
          event_type,
          start_date, 
          end_date, 
          guest_count,
          notes,
          status,
          venue_id, 
          client_id,
          venues:venue_id (name),
          clients:client_id (name)
        `)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venues?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate progress for display purposes - this is just a visualization
  const calculateProgress = (event: any) => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    // If event is in the past, it's 100% complete
    if (now > endDate) return 100;
    
    // If event is in the future, calculate based on planning timeline
    // Assuming planning starts 30 days before the event
    const planningStart = new Date(startDate);
    planningStart.setDate(planningStart.getDate() - 30);
    
    if (now < planningStart) return 10; // Just started planning
    
    // Calculate progress based on position in planning timeline
    const totalPlanningTime = endDate.getTime() - planningStart.getTime();
    const elapsedPlanningTime = now.getTime() - planningStart.getTime();
    
    const progress = Math.min(Math.floor((elapsedPlanningTime / totalPlanningTime) * 100), 95);
    return Math.max(10, progress); // Ensure progress is at least 10%
  };
  
  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setIsEditEventModalOpen(true);
  };

  // Mock task list for demonstration
  const sampleEventTasks = [
    { id: 1, title: 'Confirm final guest count', status: 'completed', dueDate: '2025-04-05', assignedTo: 'Jane Davis' },
    { id: 2, title: 'Arrange floral centerpieces', status: 'completed', dueDate: '2025-04-10', assignedTo: 'Mark Wilson' },
    { id: 3, title: 'Final menu tasting', status: 'completed', dueDate: '2025-04-08', assignedTo: 'Chef Rodriguez' },
    { id: 4, title: 'Coordinate with DJ for music selection', status: 'pending', dueDate: '2025-04-12', assignedTo: 'Jane Davis' },
    { id: 5, title: 'Room setup diagram approval', status: 'pending', dueDate: '2025-04-13', assignedTo: 'Mark Wilson' },
    { id: 6, title: 'Confirm AV requirements', status: 'completed', dueDate: '2025-04-09', assignedTo: 'Tech Team' }
  ];
  
  // Event template types
  const eventTemplates = [
    { name: 'Wedding Reception', tasks: 24, timeframe: '3-6 months' },
    { name: 'Corporate Conference', tasks: 18, timeframe: '1-3 months' },
    { name: 'Birthday Celebration', tasks: 15, timeframe: '2-4 weeks' },
    { name: 'Graduation Party', tasks: 16, timeframe: '1-2 months' },
    { name: 'Charity Gala', tasks: 22, timeframe: '2-4 months' }
  ];
  
  return (
    <AppLayout>
      <PageHeader 
        title="Event Planning" 
        description="Plan and organize your upcoming events"
        action={{
          label: "Create Event",
          icon: <Calendar size={16} />,
          onClick: () => setIsCreateEventModalOpen(true)
        }}
      />
      
      <Tabs defaultValue="upcoming" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="templates">Event Templates</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-6 m-0">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input 
                placeholder="Search events..." 
                className="w-full pl-9 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
          
          {isLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p>Loading events...</p>
              </CardContent>
            </Card>
          ) : filteredEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {filteredEvents.map(event => (
                <Card key={event.id} className="overflow-hidden hover:border-cyan-500/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{event.event_name}</CardTitle>
                      <Badge>{event.event_type}</Badge>
                    </div>
                    <CardDescription className="flex justify-between items-center">
                      <span>{new Date(event.start_date).toLocaleDateString()}</span>
                      <span className="font-medium">{event.venues?.name || 'No venue'}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-0">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Planning Progress</span>
                        <span className="font-medium">{calculateProgress(event)}%</span>
                      </div>
                      <Progress value={calculateProgress(event)} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm flex items-center">
                        <Clipboard className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Client: {event.clients?.name || 'No client'}
                        </span>
                      </div>
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event);
                          }}
                        >
                          <Edit className="h-4 w-4 text-cyan-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-cyan-600"
                          onClick={() => handleEditEvent(event)}
                        >
                          <span className="mr-1">View</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p>No events found. Create a new event to get started.</p>
                <Button 
                  className="mt-4"
                  onClick={() => setIsCreateEventModalOpen(true)}
                >
                  Create Event
                </Button>
              </CardContent>
            </Card>
          )}
          
          {filteredEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{filteredEvents[0].event_name}: Task List</CardTitle>
                <CardDescription>
                  Planning progress: {calculateProgress(filteredEvents[0])}% complete
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Status</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead className="hidden md:table-cell">Due Date</TableHead>
                      <TableHead className="hidden sm:table-cell">Assigned To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleEventTasks.map(task => (
                      <TableRow key={task.id}>
                        <TableCell>
                          {task.status === 'completed' ? (
                            <div className="bg-green-100 text-green-600 p-1 rounded-full w-6 h-6 flex items-center justify-center">
                              <Check className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="bg-gray-100 text-gray-600 p-1 rounded-full w-6 h-6 flex items-center justify-center">
                              <X className="h-4 w-4" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                          {task.title}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{task.dueDate}</TableCell>
                        <TableCell className="hidden sm:table-cell">{task.assignedTo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="m-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventTemplates.map((template, index) => (
              <Card key={index} className="hover:border-cyan-500/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>Planning Template</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-4">
                    <div>
                      <span className="font-medium">{template.tasks}</span>
                      <span className="text-muted-foreground ml-1">tasks</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Timeframe: </span>
                      <span className="font-medium">{template.timeframe}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Use Template</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="vendors" className="m-0">
          <div className="bg-white rounded-md border min-h-[400px] p-6">
            <div className="text-center text-gray-500 pt-40">
              <h3 className="mt-4 text-lg font-medium">Vendor Management</h3>
              <p className="mt-1">Vendor listings and management would be shown here.</p>
              <p className="text-sm mt-2">Including photographers, DJs, decorators, etc.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <CreateEventModal
        open={isCreateEventModalOpen}
        onOpenChange={setIsCreateEventModalOpen}
      />

      <EditEventModal
        open={isEditEventModalOpen}
        onOpenChange={setIsEditEventModalOpen}
        event={selectedEvent}
      />
    </AppLayout>
  );
};

export default EventPlanning;
