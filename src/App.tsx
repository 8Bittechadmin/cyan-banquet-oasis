
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import LoginAdmin from "./pages/LoginAdmin";
import LoginStaff from "./pages/LoginStaff";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import BookingForm from "./pages/BookingForm";
import Inventory from "./pages/Inventory";
import Venues from "./pages/Venues";
import EventPlanning from "./pages/EventPlanning";
import Catering from "./pages/Catering";
import Staff from "./pages/Staff";
import Billing from "./pages/Billing";
import ClientManagement from "./pages/ClientManagement";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/login-staff" element={<LoginStaff />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/new" element={<BookingForm />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/event-planning" element={<EventPlanning />} />
          <Route path="/catering" element={<Catering />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
