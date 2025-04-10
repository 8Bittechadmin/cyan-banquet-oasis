
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, className }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Close sidebar on mobile when component mounts
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Mobile header with menu button */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 bg-white border-b border-border">
          <h1 className="text-lg font-bold text-primary">Banquet Management</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Sidebar - absolute on mobile, fixed on desktop */}
      <div 
        className={cn(
          "transition-all duration-300 z-30",
          isMobile ? (
            sidebarOpen 
              ? "fixed inset-0 bg-black bg-opacity-50" 
              : "hidden"
          ) : "w-64 flex-shrink-0"
        )}
        onClick={isMobile ? () => setSidebarOpen(false) : undefined}
      >
        <div 
          className={cn(
            "h-full transition-all duration-300",
            isMobile ? (
              sidebarOpen 
                ? "w-64 translate-x-0" 
                : "w-0 -translate-x-full"
            ) : "w-full"
          )}
          onClick={e => e.stopPropagation()}
        >
          <Sidebar />
        </div>
      </div>
      
      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-auto p-4 md:p-6",
        className
      )}>
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
