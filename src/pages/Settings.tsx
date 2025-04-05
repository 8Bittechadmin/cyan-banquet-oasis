
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";

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

const Settings = () => {
  const [currentTab, setCurrentTab] = useState("general");
  
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: "Elegance Banquet Management",
      contactEmail: "contact@elegancebms.com",
      contactPhone: "555-123-4567",
      notificationsEnabled: true,
      autoBackupEnabled: true,
    },
  });

  const emailForm = useForm<z.infer<typeof emailSettingsSchema>>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpServer: "smtp.example.com",
      smtpPort: "587",
      smtpUsername: "notifications@elegancebms.com",
      smtpPassword: "",
      fromEmail: "notifications@elegancebms.com",
      emailSignature: "Elegance Banquet Management Team",
      enableEmailNotifications: true,
    },
  });

  const billingForm = useForm<z.infer<typeof billingSettingsSchema>>({
    resolver: zodResolver(billingSettingsSchema),
    defaultValues: {
      currency: "USD",
      taxRate: "8.5",
      paymentMethods: ["Credit Card", "Bank Transfer", "Cash"],
      invoicePrefix: "EBM-",
      invoiceFooter: "Thank you for your business!",
      termsAndConditions: "Payment is due within 30 days.",
    },
  });

  const onGeneralSubmit = (data: z.infer<typeof generalSettingsSchema>) => {
    console.log("General settings submitted:", data);
    // Here we would save the data to Supabase
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated successfully.",
    });
  };

  const onEmailSubmit = (data: z.infer<typeof emailSettingsSchema>) => {
    console.log("Email settings submitted:", data);
    // Here we would save the data to Supabase
    toast({
      title: "Settings saved",
      description: "Your email settings have been updated successfully.",
    });
  };

  const onBillingSubmit = (data: z.infer<typeof billingSettingsSchema>) => {
    console.log("Billing settings submitted:", data);
    // Here we would save the data to Supabase
    toast({
      title: "Settings saved",
      description: "Your billing settings have been updated successfully.",
    });
  };

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
                  <Button type="submit">Save Changes</Button>
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
                  <Button type="submit">Save Email Settings</Button>
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
                  <Button type="submit">Save Billing Settings</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Users & Permissions</CardTitle>
              <CardDescription>
                Manage user accounts and set permissions for different roles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

// A simple user management component
const UserManagement = () => {
  // This would be populated from Supabase once we implement authentication
  const users = [
    { id: 1, name: "Admin User", email: "admin@example.com", role: "Admin" },
    { id: 2, name: "Staff Member 1", email: "staff1@example.com", role: "Staff" },
    { id: 3, name: "Staff Member 2", email: "staff2@example.com", role: "Staff" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">System Users</h3>
        <Button>Add New User</Button>
      </div>
      
      <div className="border rounded-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-b-0">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === "Admin" 
                      ? "bg-blue-100 text-blue-800" 
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;
