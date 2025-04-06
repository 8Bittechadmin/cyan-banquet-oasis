import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, Mail, Phone, Building, Calendar } from 'lucide-react';
import ClientModal from '@/components/Clients/ClientModal';

const ClientManagement: React.FC = () => {
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // Mock client data
  const clients = [
    {
      id: 'C001',
      name: 'Johnson Family',
      type: 'individual',
      contact: 'Robert Johnson',
      email: 'robert@example.com',
      phone: '(555) 123-4567',
      events: 3,
      status: 'active'
    },
    {
      id: 'C002',
      name: 'TechCorp Inc.',
      type: 'corporate',
      contact: 'Sarah Miller',
      email: 'sarah@techcorp.com',
      phone: '(555) 987-6543',
      events: 5,
      status: 'active'
    },
    {
      id: 'C003',
      name: 'Smith Wedding',
      type: 'individual',
      contact: 'John Smith',
      email: 'john@example.com',
      phone: '(555) 456-7890',
      events: 1,
      status: 'inactive'
    },
    {
      id: 'C004',
      name: 'City Council',
      type: 'government',
      contact: 'Mayor Wilson',
      email: 'mayor@citycouncil.gov',
      phone: '(555) 789-0123',
      events: 2,
      status: 'active'
    },
    {
      id: 'C005',
      name: 'Children\'s Hospital',
      type: 'non-profit',
      contact: 'Dr. Emily Chen',
      email: 'emily@childrenshospital.org',
      phone: '(555) 234-5678',
      events: 4,
      status: 'active'
    },
  ];
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'individual': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'corporate': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'non-profit': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'government': return 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  return (
    <AppLayout>
      <PageHeader 
        title="Client Management" 
        description="Manage and view all your clients"
        action={{
          label: "Add Client",
          icon: <Plus size={16} />,
          onClick: () => setIsAddClientModalOpen(true)
        }}
      />
      
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <p className="text-xs text-muted-foreground mt-1">86% of total clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">+14% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Events per Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4</div>
            <p className="text-xs text-muted-foreground mt-1">Based on active clients</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Clients</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="corporate">Corporate</TabsTrigger>
          <TabsTrigger value="non-profit">Non-Profit</TabsTrigger>
        </TabsList>
        
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
        </div>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Client Directory</CardTitle>
            <CardDescription>View and manage your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden xl:table-cell">Phone</TableHead>
                  <TableHead className="hidden sm:table-cell">Events</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{client.id}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(client.type)}>
                        {client.type.charAt(0).toUpperCase() + client.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{client.contact}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-500" />
                        <span>{client.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-500" />
                        <span>{client.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span>{client.events}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>
      
      <ClientModal
        open={isAddClientModalOpen}
        onOpenChange={setIsAddClientModalOpen}
      />
    </AppLayout>
  );
};

export default ClientManagement;
