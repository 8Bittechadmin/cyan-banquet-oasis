
import React from 'react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  FileText, 
  MessageSquare, 
  FileSpreadsheet, 
  Star, 
  Filter 
} from 'lucide-react';

const ClientManagement: React.FC = () => {
  // Mock clients data
  const clients = [
    {
      id: 'C001',
      name: 'Sarah Johnson',
      type: 'Individual',
      email: 'sarah.j@example.com',
      phone: '(555) 123-4567',
      events: 2,
      lastEvent: '2025-03-15',
      status: 'active'
    },
    {
      id: 'C002',
      name: 'TechCorp Inc.',
      type: 'Corporate',
      email: 'events@techcorp.com',
      phone: '(555) 987-6543',
      events: 5,
      lastEvent: '2025-03-10',
      status: 'active'
    },
    {
      id: 'C003',
      name: 'John Smith',
      type: 'Individual',
      email: 'john.s@example.com',
      phone: '(555) 234-5678',
      events: 1,
      lastEvent: '2025-03-20',
      status: 'inactive'
    },
    {
      id: 'C004',
      name: 'Carlos Martinez',
      type: 'Individual',
      email: 'carlos.m@example.com',
      phone: '(555) 345-6789',
      events: 3,
      lastEvent: '2025-04-08',
      status: 'active'
    },
    {
      id: 'C005',
      name: 'City Council',
      type: 'Government',
      email: 'events@citygov.org',
      phone: '(555) 456-7890',
      events: 8,
      lastEvent: '2025-04-25',
      status: 'active'
    },
  ];
  
  // Mock client details (first client)
  const clientDetails = {
    id: 'C001',
    name: 'Sarah Johnson',
    type: 'Individual',
    email: 'sarah.j@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, ST 12345',
    notes: 'Prefers vegan catering options. Likes white floral arrangements.',
    status: 'active', // Added the status field that was missing
    events: [
      { id: 'E001', name: 'Wedding Reception', date: '2025-04-15', venue: 'Grand Ballroom', status: 'upcoming' },
      { id: 'E002', name: 'Engagement Party', date: '2024-10-20', venue: 'Garden Pavilion', status: 'completed' }
    ],
    communications: [
      { date: '2025-03-01', type: 'Email', subject: 'Wedding Menu Options', status: 'replied' },
      { date: '2025-02-15', type: 'Phone', subject: 'Initial Consultation', status: 'completed' },
      { date: '2025-02-10', type: 'Email', subject: 'Venue Inquiry', status: 'replied' }
    ]
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'upcoming': return 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200';
      case 'completed': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'replied': return 'bg-green-100 text-green-800 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  return (
    <AppLayout>
      <PageHeader 
        title="Client Management" 
        description="Manage client relationships and information"
        action={{
          label: "Add Client",
          icon: <Plus size={16} />,
          onClick: () => console.log("Add new client")
        }}
      />
      
      <Tabs defaultValue="directory" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="directory">Client Directory</TabsTrigger>
          <TabsTrigger value="details">Client Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="directory" className="space-y-4 m-0">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search clients..." 
                className="w-full pl-9" 
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead className="hidden xl:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Events</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.type}</TableCell>
                      <TableCell className="hidden lg:table-cell">{client.email}</TableCell>
                      <TableCell className="hidden xl:table-cell">{client.phone}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.events}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6 m-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle>{clientDetails.name}</CardTitle>
                    <Badge className={getStatusColor(clientDetails.status)}>
                      {clientDetails.status.charAt(0).toUpperCase() + clientDetails.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{clientDetails.id} • {clientDetails.type} Client</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" /> Email
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium mb-4">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-muted-foreground">{clientDetails.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-muted-foreground">{clientDetails.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-muted-foreground">{clientDetails.address}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-4">Client Notes</h3>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  {clientDetails.notes}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Event History</CardTitle>
                <CardDescription>Past and upcoming events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientDetails.events.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 last:pb-0 last:border-b-0 border-b border-gray-100">
                      <div className="bg-gray-100 rounded-md w-10 h-10 flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">{event.name}</h4>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{event.date} • {event.venue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" /> Schedule New Event
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Communication History</CardTitle>
                <CardDescription>Recent interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientDetails.communications.map((comm, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 last:pb-0 last:border-b-0 border-b border-gray-100">
                      <div className="bg-gray-100 rounded-md w-10 h-10 flex items-center justify-center shrink-0">
                        {comm.type === 'Email' ? (
                          <Mail className="h-5 w-5 text-gray-600" />
                        ) : (
                          <Phone className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{comm.subject}</h4>
                          <span className="text-xs text-muted-foreground">{comm.date}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">via {comm.type}</span>
                          <Badge variant="outline" className={getStatusColor(comm.status)}>
                            {comm.status.charAt(0).toUpperCase() + comm.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" /> New Message
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Client Preferences</CardTitle>
              <CardDescription>Saved preferences and special requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    Menu Preferences
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Vegan options required</li>
                    <li>• Prefers cocktail reception</li>
                    <li>• Wine pairing service</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    Venue Preferences
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Natural lighting preferred</li>
                    <li>• Outdoor access</li>
                    <li>• Accessibility requirements</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    Special Requests
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• White floral arrangements</li>
                    <li>• Specific lighting setup</li>
                    <li>• Late checkout requested</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default ClientManagement;
