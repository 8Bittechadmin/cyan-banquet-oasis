
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, AlertTriangle, Archive, Package } from 'lucide-react';
import AddInventoryItemModal from '@/components/Inventory/AddInventoryItemModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Inventory: React.FC = () => {
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: inventoryItems, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
  
  // Categories for quick filtering
  const categories = [
    { name: 'All', value: 'all' },
    { name: 'Furniture', value: 'furniture' },
    { name: 'Linens', value: 'linens' },
    { name: 'AV Equipment', value: 'av-equipment' },
    { name: 'Tableware', value: 'tableware' },
    { name: 'Decor', value: 'decor' }
  ];
  
  // Filter items by category and search query
  const filteredItems = (inventoryItems || []).filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'in-stock': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'out': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'on-order': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'in-stock': return 'In Stock';
      case 'low': return 'Low Stock';
      case 'out': return 'Out of Stock';
      case 'on-order': return 'On Order';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  // Calculate statistics
  const totalItems = inventoryItems?.length || 0;
  const itemsInStock = inventoryItems?.filter(item => item.status === 'in-stock').length || 0;
  const lowStockAlerts = inventoryItems?.filter(item => item.status === 'low').length || 0;
  const outOfStock = inventoryItems?.filter(item => item.status === 'out').length || 0;
  
  return (
    <AppLayout>
      <PageHeader 
        title="Inventory Management" 
        description="Track and manage your event inventory"
        action={{
          label: "Add Item",
          icon: <Plus size={16} />,
          onClick: () => setIsAddItemModalOpen(true)
        }}
      />
      
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">{categories.length - 1} categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Items In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{itemsInStock}</div>
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                <Package className="h-3 w-3 mr-1" /> Available
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{Math.round((itemsInStock / totalItems) * 100) || 0}% of inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{lowStockAlerts}</div>
              <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-600 border-yellow-200">
                <AlertTriangle className="h-3 w-3 mr-1" /> Attention Needed
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Items need restock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{outOfStock}</div>
              <Badge variant="outline" className="ml-2 bg-red-50 text-red-600 border-red-200">
                <Archive className="h-3 w-3 mr-1" /> Order Required
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Items unavailable</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
          
          <TabsContent value={activeCategory} className="m-0">
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-500">Loading inventory items...</div>
                ) : filteredItems.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {searchQuery ? "No items match your search criteria." : "No inventory items found."}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">Min Quantity</TableHead>
                        <TableHead className="hidden lg:table-cell">Unit</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map(item => (
                        <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50">
                          <TableCell className="font-medium">{item.id.substring(0, 8)}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-center hidden sm:table-cell">{item.min_quantity}</TableCell>
                          <TableCell className="hidden lg:table-cell">{item.unit || '-'}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(item.status)}>
                              {getStatusLabel(item.status)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <AddInventoryItemModal
        open={isAddItemModalOpen}
        onOpenChange={setIsAddItemModalOpen}
      />
    </AppLayout>
  );
};

export default Inventory;
