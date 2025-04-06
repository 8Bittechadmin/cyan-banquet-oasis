import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Search, Plus, Filter, Check, Clock, User } from 'lucide-react';
import StaffModal from '@/components/Staff/StaffModal';

const Staff: React.FC = () => {
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  
  // Mock staff data
  const staffMembers = [
    {
      id: 'S001',
      name: 'James Wilson',
      position: 'Event Manager',
      department: 'Operations',
      contact: 'james.w@example.com',
      status: 'available'
    },
    {
      id: 'S002',
      name: 'Sarah Miller',
      position: 'Catering Manager',
      department: 'Catering',
      contact: 'sarah.m@example.com',
      status: 'on-duty'
    },
    {
      id: 'S003',
      name: 'Michael Rodriguez',
      position: 'Head Chef',
      department: 'Culinary',
      contact: 'michael.r@example.com',
      status: 'on-duty'
    },
    {
      id: 'S004',
      name: 'Emily Johnson',
      position: 'Server',
      department: 'Service',
      contact: 'emily.j@example.com',
      status: 'unavailable'
    },
    {
      id: 'S005',
      name: 'Thomas Lee',
      position: 'Bartender',
      department: 'Service',
      contact: 'thomas.l@example.com',
      status: 'available'
    },
    {
      id: 'S006',
      name: 'Jessica Smith',
      position: 'Server',
      department: 'Service',
      contact: 'jessica.s@example.com',
      status: 'unavailable'
    },
    {
      id: 'S007',
      name: 'Robert Brown',
      position: 'AV Technician',
      department: 'Technical',
      contact: 'robert.b@example.com',
      status: 'available'
    }
  ];
  
  // Current event staff assignments
  const staffAssignments = [
    {
      eventName: 'Johnson-Smith Wedding',
      date: '2025-04-15',
      time: '16:00 - 23:00',
      venue: 'Grand Ballroom',
      staff: [
        { id: 'S001', name: 'James Wilson', position: 'Event Manager', status: 'confirmed' },
        { id: 'S002', name: 'Sarah Miller', position: 'Catering Manager', status: 'confirmed' },
        { id: 'S003', name: 'Michael Rodriguez', position: 'Head Chef', status: 'confirmed' },
        { id: 'S005', name: 'Thomas Lee', position: 'Bartender', status: 'confirmed' },
        { id: 'S004', name: 'Emily Johnson', position: 'Server', status: 'tentative' },
        { id: 'S006', name: 'Jessica Smith', position: 'Server', status: 'tentative' },
      ]
    },
    {
      eventName: 'TechCorp Conference',
      date: '2025-04-10',
      time: '08:00 - 17:00',
      venue: 'Conference Hall A',
      staff: [
        { id: 'S001', name: 'James Wilson', position: 'Event Manager', status: 'confirmed' },
        { id: 'S007', name: 'Robert Brown', position: 'AV Technician', status: 'confirmed' },
        { id: 'S002', name: 'Sarah Miller', position: 'Catering Manager', status: 'pending' },
      ]
    }
  ];
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'on-duty': return 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200';
      case 'unavailable': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'confirmed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'tentative': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const getStatusLabel = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return (
    <AppLayout>
      <PageHeader 
        title="Staff Management" 
        description="Manage staff and event assignments"
        action={{
          label: "Add Staff",
          icon: <Plus size={16} />,
          onClick: () => setIsAddStaffModalOpen(true)
        }}
      />
      
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">Across 5 departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground mt-1">66% of total staff</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Duty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground mt-1">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Shifts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">In next 24 hours</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="directory" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="directory">Staff Directory</TabsTrigger>
          <TabsTrigger value="assignments">Event Assignments</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="directory" className="space-y-4 m-0">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search staff..." 
                className="w-full pl-9" 
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>View and manage staff</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Position</TableHead>
                    <TableHead className="hidden lg:table-cell">Department</TableHead>
                    <TableHead className="hidden xl:table-cell">Contact</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.map((staff) => (
                    <TableRow key={staff.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">{staff.id}</TableCell>
                      <TableCell>{staff.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{staff.position}</TableCell>
                      <TableCell className="hidden lg:table-cell">{staff.department}</TableCell>
                      <TableCell className="hidden xl:table-cell">{staff.contact}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(staff.status)}>
                          {getStatusLabel(staff.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-6 m-0">
          {staffAssignments.map((event, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle>{event.eventName}</CardTitle>
                    <CardDescription>
                      {event.date} • {event.time} • {event.venue}
                    </CardDescription>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Assign Staff
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {event.staff.map((member) => (
                    <div 
                      key={member.id} 
                      className="flex items-center p-3 rounded-lg border gap-3 hover:border-cyan-500 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{member.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{member.position}</p>
                      </div>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status === 'confirmed' ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : member.status === 'tentative' ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : null}
                        {getStatusLabel(member.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="schedule" className="m-0">
          <div className="bg-white rounded-md border min-h-[500px] p-6">
            <div className="text-center text-gray-500 pt-40">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Staff Schedule Calendar</h3>
              <p className="mt-1">Weekly and monthly staff schedules would be displayed here.</p>
              <p className="text-sm mt-2">Including shift management, time off requests, etc.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <StaffModal 
        open={isAddStaffModalOpen}
        onOpenChange={setIsAddStaffModalOpen}
      />
    </AppLayout>
  );
};

export default Staff;
