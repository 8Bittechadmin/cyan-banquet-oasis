
import React from 'react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Clipboard, Check, X, Search, Filter, ChevronRight } from 'lucide-react';

const EventPlanning: React.FC = () => {
  // Mock event data
  const upcomingEvents = [
    {
      id: 'E001',
      name: 'Johnson-Smith Wedding',
      date: '2025-04-15',
      venue: 'Grand Ballroom',
      client: 'Sarah Johnson',
      eventType: 'Wedding',
      progress: 75,
      tasks: {
        total: 24,
        completed: 18
      }
    },
    {
      id: 'E002',
      name: 'TechCorp Annual Conference',
      date: '2025-04-10',
      venue: 'Conference Hall A',
      client: 'TechCorp Inc.',
      eventType: 'Corporate',
      progress: 60,
      tasks: {
        total: 18,
        completed: 11
      }
    },
    {
      id: 'E003',
      name: 'Smith Graduation Party',
      date: '2025-04-20',
      venue: 'Garden Pavilion',
      client: 'John Smith',
      eventType: 'Graduation',
      progress: 40,
      tasks: {
        total: 15,
        completed: 6
      }
    },
    {
      id: 'E004',
      name: 'Martinez Sweet 16',
      date: '2025-04-08',
      venue: 'Terrace Hall',
      client: 'Carlos Martinez',
      eventType: 'Birthday',
      progress: 90,
      tasks: {
        total: 20,
        completed: 18
      }
    }
  ];
  
  // Mock task list for first event
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
          onClick: () => console.log("Create new event")
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
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {upcomingEvents.map(event => (
              <Card key={event.id} className="overflow-hidden hover:border-cyan-500/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">{event.name}</CardTitle>
                    <Badge>{event.eventType}</Badge>
                  </div>
                  <CardDescription className="flex justify-between items-center">
                    <span>{event.date}</span>
                    <span className="font-medium">{event.venue}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Planning Progress</span>
                      <span className="font-medium">{event.progress}%</span>
                    </div>
                    <Progress value={event.progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm flex items-center">
                      <Clipboard className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>
                        <span className="font-medium">{event.tasks.completed}</span>
                        <span className="text-muted-foreground">/{event.tasks.total} tasks complete</span>
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-cyan-600">
                      <span className="mr-1">View</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Johnson-Smith Wedding: Task List</CardTitle>
              <CardDescription>
                Planning progress: 75% complete (18 of 24 tasks completed)
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
    </AppLayout>
  );
};

export default EventPlanning;
