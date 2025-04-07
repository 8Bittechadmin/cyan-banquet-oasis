import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Calendar, ChevronRight, Plus, FileText, Utensils } from 'lucide-react';
import CreateMenuItemModal from '@/components/Catering/CreateMenuItemModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Catering: React.FC = () => {
  const [isCreateMenuModalOpen, setIsCreateMenuModalOpen] = useState(false);
  
  // Mock menu categories
  const menuCategories = [
    { name: 'Breakfast', count: 12 },
    { name: 'Lunch', count: 18 },
    { name: 'Dinner', count: 24 },
    { name: 'Reception', count: 15 },
    { name: 'Buffet', count: 20 },
    { name: 'Plated', count: 16 },
    { name: 'Desserts', count: 14 },
    { name: 'Beverages', count: 10 }
  ];
  
  // Mock popular menu items
  const popularMenuItems = [
    { name: 'Beef Wellington', category: 'Dinner', price: 42, dietaryInfo: ['Contains Gluten', 'Contains Dairy'] },
    { name: 'Vegetable Risotto', category: 'Dinner', price: 28, dietaryInfo: ['Vegetarian', 'Gluten-Free Option'] },
    { name: 'Smoked Salmon Canapé', category: 'Reception', price: 14, dietaryInfo: ['Contains Fish'] },
    { name: 'Chocolate Lava Cake', category: 'Desserts', price: 12, dietaryInfo: ['Vegetarian', 'Contains Dairy', 'Contains Gluten'] },
    { name: 'Garden Salad', category: 'Lunch', price: 10, dietaryInfo: ['Vegan', 'Gluten-Free'] }
  ];
  
  // Mock upcoming catering orders
  const upcomingOrders = [
    {
      id: 'CO001',
      eventName: 'Johnson-Smith Wedding',
      date: '2025-04-15',
      menuType: 'Plated Dinner',
      guestCount: 150,
      status: 'confirmed',
      specialRequests: 'Vegetarian options for 25 guests'
    },
    {
      id: 'CO002',
      eventName: 'TechCorp Conference',
      date: '2025-04-10',
      menuType: 'Buffet Lunch',
      guestCount: 80,
      status: 'pending',
      specialRequests: 'Gluten-free options required'
    },
    {
      id: 'CO003',
      eventName: 'Martinez Birthday',
      date: '2025-04-08',
      menuType: 'Reception + Dessert',
      guestCount: 45,
      status: 'confirmed',
      specialRequests: 'Nut-free desserts'
    }
  ];
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <AppLayout>
      <PageHeader 
        title="Catering Management" 
        description="Manage menus and catering orders"
        action={{
          label: "Create Menu",
          icon: <FileText size={16} />,
          onClick: () => setIsCreateMenuModalOpen(true)
        }}
      />
      
      <Tabs defaultValue="menus" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="menus">Menus</TabsTrigger>
          <TabsTrigger value="orders">Catering Orders</TabsTrigger>
          <TabsTrigger value="dietary">Dietary Options</TabsTrigger>
        </TabsList>
        
        <TabsContent value="menus" className="space-y-6 m-0">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Menu Categories</CardTitle>
                <CardDescription>Browse menu options by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {menuCategories.map((category, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="justify-start h-auto py-3"
                    >
                      <Utensils className="h-4 w-4 mr-2 text-cyan-600" />
                      <div className="flex flex-col items-start">
                        <span>{category.name}</span>
                        <span className="text-xs text-muted-foreground">{category.count} items</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Add New Category
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Popular Menu Items</CardTitle>
                <CardDescription>Most requested catering selections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularMenuItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start pb-3 last:pb-0 last:border-0 border-b border-gray-100">
                      <div>
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {item.dietaryInfo.map((info, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{info}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">${item.price}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View All Menu Items</Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <div>
                  <CardTitle>Seasonal Specials</CardTitle>
                  <CardDescription>Limited time menu offerings</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> 
                  Add Special
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-md p-8 text-center">
                <h3 className="text-lg font-medium mb-1">Spring Collection</h3>
                <p className="text-muted-foreground mb-4">Available April - June</p>
                <Button>Browse Spring Menus</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Catering Orders</CardTitle>
              <CardDescription>Events requiring catering services</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden lg:table-cell">Menu Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.eventName}</TableCell>
                      <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                      <TableCell className="hidden lg:table-cell">{order.menuType}</TableCell>
                      <TableCell className="hidden sm:table-cell">{order.guestCount}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <span className="sr-only">View details</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" /> View Calendar
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Order
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="dietary" className="m-0">
          <div className="bg-white rounded-md border min-h-[400px] p-6">
            <div className="text-center text-gray-500 pt-40">
              <h3 className="mt-4 text-lg font-medium">Dietary Requirements Management</h3>
              <p className="mt-1">Track and manage special dietary requirements and allergen information.</p>
              <p className="text-sm mt-2">This section would include allergen matrices and special menu options.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <CreateMenuItemModal
        open={isCreateMenuModalOpen}
        onOpenChange={setIsCreateMenuModalOpen}
      />
    </AppLayout>
  );
};

export default Catering;
