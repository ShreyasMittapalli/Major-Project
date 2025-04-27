'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, User } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
      <SidebarTrigger className="sm:hidden" />
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* Future search bar can go here */}
      </div>
      <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8">
        <User className="h-4 w-4" />
        <span className="sr-only">User menu</span>
      </Button>
    </header>
  );
}
