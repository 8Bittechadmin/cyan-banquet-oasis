import React from 'react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, AlertTriangle } from 'lucide-react';

const Inventory: React.FC = () => {
  // Mock inventory data
  const inventoryItems = [
    {
      id: 'INV001',
      name: 'Round Tables',
      category: 'Furniture',
      total: 50,
      available: 32,
      inUse: 18,
      status: 'available'
    },
    {
      id: 'INV002',
      name: 'Chiavari Chairs',
      category: 'Furniture',
      total: 200,
      available: 120,
      inUse: 80,
      status: 'available'
    },
    {
      id: 'INV003',
      name: 'Table Linens (White)',
      category: 'Linens',
      total: 60,
      available: 15,
      inUse: 45,
      status: 'low'
    },
    {
      id: 'INV004',
      name: 'Wireless Microphones',
      category: 'AV Equipment',
      total: 8,
      available: 2,
      inUse: 6,
      status: 'low'
    },
    {
      id: 'INV005',
      name: 'LED Uplights',
      category: 'Lighting',
      total: 24,
      available: 10,
      inUse: 14,
      status: 'available'
    },
    {
      id: 'INV006',
      name: 'Champagne Flutes',
      category: 'Glassware',
      total: 300,
      available: 0,
      inUse: 300,
      status: 'out'
    }
  ];
  
  // Categories for quick filtering
  const categories = [
    { name: 'All', value: 'all' },
    { name: 'Furniture', value: 'furniture' },
    { name: 'Linens', value: 'linens' },
    { name: 'AV Equipment', value: 'av-equipment' },
    { name: 'Tableware', value: 'tableware' },
    { name: 'Decor', value: 'decor' }
  ];
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'out': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'available': return 'Available';
      case 'low': return 'Low Stock';
      case 'out': return 'Out of Stock';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  return (
    <AppLayout>
      <PageHeader 
        title="Inventory Management" 
        description="Track and manage your event inventory"
        action={{
          label: "Add Item",
          icon: <Plus size={16} />,
          onClick: () => console.log("Add new inventory item")
        }}
      />
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">642</div>
            <p className="text-xs text-muted-foreground mt-1">6 categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Items In Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">218</div>
            <p className="text-xs text-muted-foreground mt-1">34% of inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">8</div>
              <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-600 border-yellow-200">
                <AlertTriangle className="h-3 w-3 mr-1" /> Attention Needed
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Items need restock</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-4">
            {categories.map(category => (
              <TabsTrigger 
                key={category.value} 
                value={category.value}
                className="rounded-full px-3 py-1 text-xs h-auto data-[state=active]:shadow-none"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search inventory..." 
                className="w-full pl-9" 
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
          
          <TabsContent value="all" className="m-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center hidden sm:table-cell">Available</TableHead>
                      <TableHead className="text-center hidden lg:table-cell">In Use</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map(item => (
                      <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50">
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                        <TableCell className="text-center">{item.total}</TableCell>
                        <TableCell className="text-center hidden sm:table-cell">{item.available}</TableCell>
                        <TableCell className="text-center hidden lg:table-cell">{item.inUse}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusLabel(item.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Other tabs content would be similar, filtered by category */}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Inventory;
