import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, UserPlus, MoreHorizontal, Trash, PencilIcon } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { supabase, SystemSettings, UserRole, User } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const generalSettingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyLogo: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(5, "Valid phone number required"),
  address: z.string().optional(),
  notificationsEnabled: z.boolean().default(true),
  autoBackupEnabled: z.boolean().default(true),
});

const emailSettingsSchema = z.object({
  smtpServer: z.string().min(1, "SMTP server is required"),
  smtpPort: z.string().min(1, "SMTP port is required"),
  smtpUsername: z.string().min(1, "SMTP username is required"),
  smtpPassword: z.string().min(1, "SMTP password is required"),
  fromEmail: z.string().email("Invalid email address"),
  emailSignature: z.string().optional(),
  enableEmailNotifications: z.boolean().default(true),
});

const billingSettingsSchema = z.object({
  currency: z.string().min(1, "Currency is required"),
  taxRate: z.string().min(1, "Tax rate is required"),
  paymentMethods: z.array(z.string()).nonempty("At least one payment method is required"),
  invoicePrefix: z.string().optional(),
  invoiceFooter: z.string().optional(),
  termsAndConditions: z.string().optional(),
});

const userRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  accessible_pages: z.array(z.string()),
  permissions: z.object({
    full_access: z.boolean().optional(),
    can_view: z.boolean().optional(),
    can_edit: z.boolean().optional(),
    can_delete: z.boolean().optional(),
  }).optional(),
});

const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Settings = () => {
  const [currentTab, setCurrentTab] = useState("general");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: "",
      contactEmail: "",
      contactPhone: "",
      primaryColor: "#4f46e5",
      secondaryColor: "#10b981",
      notificationsEnabled: true,
      autoBackupEnabled: true,
    },
  });

  const emailForm = useForm<z.infer<typeof emailSettingsSchema>>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpServer: "",
      smtpPort: "",
      smtpUsername: "",
      smtpPassword: "",
      fromEmail: "",
      emailSignature: "",
      enableEmailNotifications: true,
    },
  });

  const billingForm = useForm<z.infer<typeof billingSettingsSchema>>({
    resolver: zodResolver(billingSettingsSchema),
    defaultValues: {
      currency: "USD",
      taxRate: "",
      paymentMethods: ["Credit Card"],
      invoicePrefix: "",
      invoiceFooter: "",
      termsAndConditions: "",
    },
  });

  const addRoleForm = useForm<z.infer<typeof userRoleSchema>>({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      name: "",
      accessible_pages: [],
      permissions: {
        full_access: false,
        can_view: true,
        can_edit: false,
        can_delete: false,
      },
    },
  });

  const addUserForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "",
      password: "",
    },
  });

  const { data: generalSettings, isLoading: loadingGeneral } = useQuery({
    queryKey: ['settings', 'general'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', 'general')
        .single();
        
      if (error) throw error;
      return data as SystemSettings;
    },
  });

  const { data: emailSettings, isLoading: loadingEmail } = useQuery({
    queryKey: ['settings', 'email'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', 'email')
        .single();
        
      if (error) throw error;
      return data as SystemSettings;
    },
  });

  const { data: billingSettings, isLoading: loadingBilling } = useQuery({
    queryKey: ['settings', 'billing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', 'billing')
        .single();
        
      if (error) throw error;
      return data as SystemSettings;
    },
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
        
      if (error) throw error;
      return (data || []) as User[];
    },
  });

  const { data: roles, isLoading: loadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
        
      if (error) throw error;
      return (data || []) as UserRole[];
    },
  });

  const updateGeneralSettings = useMutation({
    mutationFn: async (data: z.infer<typeof generalSettingsSchema>) => {
      const { error } = await supabase
        .from('system_settings')
        .update({ settings: data })
        .eq('category', 'general');
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'general'] });
      toast({
        title: "Settings saved",
        description: "Your general settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save settings: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateEmailSettings = useMutation({
    mutationFn: async (data: z.infer<typeof emailSettingsSchema>) => {
      const { error } = await supabase
        .from('system_settings')
        .update({ settings: data })
        .eq('category', 'email');
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'email'] });
      toast({
        title: "Settings saved",
        description: "Your email settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save settings: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateBillingSettings = useMutation({
    mutationFn: async (data: z.infer<typeof billingSettingsSchema>) => {
      const { error } = await supabase
        .from('system_settings')
        .update({ settings: data })
        .eq('category', 'billing');
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'billing'] });
      toast({
        title: "Settings saved",
        description: "Your billing settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save settings: " + error.message,
        variant: "destructive",
      });
    },
  });

  const addRole = useMutation({
    mutationFn: async (data: z.infer<typeof userRoleSchema>) => {
      if (!data.name) {
        throw new Error("Role name is required");
      }
      
      const roleData = {
        name: data.name,
        accessible_pages: data.accessible_pages || [],
        permissions: data.permissions || {}
      };

      const { error, data: newRole } = await supabase
        .from('user_roles')
        .insert([roleData])
        .select();
      
      if (error) throw error;
      return newRole;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsAddRoleModalOpen(false);
      addRoleForm.reset();
      toast({
        title: "Role added",
        description: "The new role has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add role: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsDeleteRoleModalOpen(false);
      setCurrentRoleId(null);
      toast({
        title: "Role deleted",
        description: "The role has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete role: " + error.message,
        variant: "destructive",
      });
    },
  });

  const addUser = useMutation({
    mutationFn: async (data: z.infer<typeof userSchema>) => {
      const userData = {
        username: data.username,
        email: data.email,
        role: data.role,
        password: data.password
      };

      const { error, data: newUser } = await supabase
        .from('users')
        .insert([userData])
        .select();
      
      if (error) throw error;
      return newUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsAddUserModalOpen(false);
      addUserForm.reset();
      toast({
        title: "User added",
        description: "The new user has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add user: " + error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (generalSettings?.settings) {
      generalForm.reset(generalSettings.settings);
    }
  }, [generalSettings, generalForm]);

  useEffect(() => {
    if (emailSettings?.settings) {
      emailForm.reset(emailSettings.settings);
    }
  }, [emailSettings, emailForm]);

  useEffect(() => {
    if (billingSettings?.settings) {
      billingForm.reset(billingSettings.settings);
    }
  }, [billingSettings, billingForm]);

  const onGeneralSubmit = (data: z.infer<typeof generalSettingsSchema>) => {
    updateGeneralSettings.mutate(data);
  };

  const onEmailSubmit = (data: z.infer<typeof emailSettingsSchema>) => {
    updateEmailSettings.mutate(data);
  };

  const onBillingSubmit = (data: z.infer<typeof billingSettingsSchema>) => {
    updateBillingSettings.mutate(data);
  };

  const onAddRoleSubmit = (data: z.infer<typeof userRoleSchema>) => {
    addRole.mutate(data);
  };

  const onAddUserSubmit = (data: z.infer<typeof userSchema>) => {
    addUser.mutate(data);
  };

  const handleDeleteRole = () => {
    if (currentRoleId) {
      deleteRole.mutate(currentRoleId);
    }
  };

  const confirmDeleteRole = (id: string) => {
    setCurrentRoleId(id);
    setIsDeleteRoleModalOpen(true);
  };

  const availablePages = [
    'dashboard', 'bookings', 'inventory', 'venues', 'event-planning', 
    'catering', 'staff', 'billing', 'clients', 'reports', 'settings'
  ];

  return (
    <AppLayout>
      <PageHeader 
        title="System Settings" 
        description="Configure your Banquet Management System settings."
      />
      
      <Tabs defaultValue="general" className="w-full" onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-3xl mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="users">Users & Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure the core settings for your Banquet Management System.
              </CardDescription>
            </CardHeader>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={generalForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={generalForm.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="color" 
                              className="w-16 h-10 p-1"
                              {...field} 
                              value={field.value || '#4f46e5'}
                            />
                            <Input 
                              className="flex-1" 
                              {...field} 
                              value={field.value || '#4f46e5'}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="color" 
                              className="w-16 h-10 p-1"
                              {...field}
                              value={field.value || '#10b981'} 
                            />
                            <Input 
                              className="flex-1" 
                              {...field}
                              value={field.value || '#10b981'} 
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={generalForm.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={generalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value || ''} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col space-y-4">
                    <FormField
                      control={generalForm.control}
                      name="notificationsEnabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              System Notifications
                            </FormLabel>
                            <FormDescription>
                              Enable or disable system notifications for all users
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="autoBackupEnabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Automatic Backups
                            </FormLabel>
                            <FormDescription>
                              Enable or disable daily automatic backups of your data
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={updateGeneralSettings.isPending}
                  >
                    {updateGeneralSettings.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email notifications and templates for your system.
              </CardDescription>
            </CardHeader>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpServer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Server</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={emailForm.control}
                    name="fromEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={emailForm.control}
                    name="emailSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Signature</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormDescription>
                          This signature will be added to the end of all outgoing emails
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={emailForm.control}
                    name="enableEmailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Notifications
                          </FormLabel>
                          <FormDescription>
                            Enable or disable all email notifications from the system
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={updateEmailSettings.isPending}
                  >
                    {updateEmailSettings.isPending ? "Saving..." : "Save Email Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
              <CardDescription>
                Configure billing and invoice settings for your system.
              </CardDescription>
            </CardHeader>
            <Form {...billingForm}>
              <form onSubmit={billingForm.handleSubmit(onBillingSubmit)}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={billingForm.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={billingForm.control}
                      name="taxRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Tax Rate (%)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={billingForm.control}
                    name="invoicePrefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number Prefix</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={billingForm.control}
                    name="invoiceFooter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Footer</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={billingForm.control}
                    name="termsAndConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terms and Conditions</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={updateBillingSettings.isPending}
                  >
                    {updateBillingSettings.isPending ? "Saving..." : "Save Billing Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="space-y-6">
            <Card className="max-w-3xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Roles</CardTitle>
                  <CardDescription>
                    Manage roles and permissions for different types of users
                  </CardDescription>
                </div>
                <Dialog open={isAddRoleModalOpen} onOpenChange={setIsAddRoleModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Role</DialogTitle>
                      <DialogDescription>
                        Create a new role with specific access permissions
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...addRoleForm}>
                      <form onSubmit={addRoleForm.handleSubmit(onAddRoleSubmit)} className="space-y-4">
                        <FormField
                          control={addRoleForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormItem className="space-y-2">
                          <FormLabel>Access to Pages</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {availablePages.map((page) => (
                              <FormField
                                key={page}
                                control={addRoleForm.control}
                                name="accessible_pages"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(page)}
                                        onCheckedChange={(checked) => {
                                          const updatedPages = checked
                                            ? [...field.value || [], page]
                                            : field.value?.filter((p) => p !== page) || [];
                                          
                                          field.onChange(updatedPages);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="capitalize">
                                      {page.replace("-", " ")}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </FormItem>
                        
                        <FormField
                          control={addRoleForm.control}
                          name="permissions.full_access"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <FormLabel className="text-base">Full Access</FormLabel>
                                <FormDescription>
                                  User can perform all actions in the system
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={addRoleForm.control}
                          name="permissions.can_view"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <FormLabel className="text-base">View Access</FormLabel>
                                <FormDescription>
                                  User can view records and information
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={addRoleForm.control}
                          name="permissions.can_edit"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <FormLabel className="text-base">Edit Access</FormLabel>
                                <FormDescription>
                                  User can edit and update records
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={addRoleForm.control}
                          name="permissions.can_delete"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <FormLabel className="text-base">Delete Access</FormLabel>
                                <FormDescription>
                                  User can delete records from the system
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit" disabled={addRole.isPending}>
                            {addRole.isPending ? "Adding..." : "Add Role"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loadingRoles ? (
                  <div className="text-center py-4">Loading roles...</div>
                ) : (
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Name</th>
                          <th className="text-left p-3">Access</th>
                          <th className="text-right p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roles && roles.length > 0 ? (
                          roles.map((role) => (
                            <tr key={role.id} className="border-b last:border-b-0">
                              <td className="p-3 font-medium">{role.name}</td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1">
                                  {role.accessible_pages && role.accessible_pages.slice(0, 3).map((page) => (
                                    <Badge key={page} variant="outline">
                                      {page.replace("-", " ")}
                                    </Badge>
                                  ))}
                                  {role.accessible_pages && role.accessible_pages.length > 3 && (
                                    <Badge variant="outline">
                                      +{role.accessible_pages.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <PencilIcon className="h-4 w-4 mr-2" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => confirmDeleteRole(role.id)}
                                    >
                                      <Trash className="h-4 w-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="p-4 text-center text-muted-foreground">
                              No roles found. Create your first role by clicking the "Add Role" button.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="max-w-3xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>System Users</CardTitle>
                  <CardDescription>
                    Manage user accounts and assign roles
                  </CardDescription>
                </div>
                <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account for the system
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...addUserForm}>
                      <form onSubmit={addUserForm.handleSubmit(onAddUserSubmit)} className="space-y-4">
                        <FormField
                          control={addUserForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={addUserForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={addUserForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                >
                                  <option value="">Select a role</option>
                                  {roles && roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                      {role.name}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={addUserForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormDescription>
                                Must be at least 6 characters
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit" disabled={addUser.isPending}>
                            {addUser.isPending ? "Adding..." : "Add User"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="text-center py-4">Loading users...</div>
                ) : (
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Username</th>
                          <th className="text-left p-3">Email</th>
                          <th className="text-left p-3">Role</th>
                          <th className="text-right p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users && users.length > 0 ? (
                          users.map((user) => (
                            <tr key={user.id} className="border-b last:border-b-0">
                              <td className="p-3">{user.username}</td>
                              <td className="p-3">{user.email || '-'}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  user.role === "Admin" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : user.role === "Manager"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-muted-foreground">
                              No users found. Create your first user by clicking the "Add User" button.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <AlertDialog 
        open={isDeleteRoleModalOpen}
        onOpenChange={setIsDeleteRoleModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRole} 
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteRole.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Settings;
