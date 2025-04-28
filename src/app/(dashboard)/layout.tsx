import type { ReactNode } from 'react';
import { CandlestickChart, Bot, Settings, Home } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/dashboard-header';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-svh">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <h1 className="text-xl font-semibold">AlgoTradeSim</h1>
          </div>
          <Tabs defaultValue="dashboard" className="flex-1">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="dashboard" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
              </TabsTrigger>
              <TabsTrigger value="paper-trading" asChild>
                <Link href="/paper-trading" className="flex items-center gap-2">
                  <CandlestickChart className="w-4 h-4" />
                  Paper Trading
                </Link>
              </TabsTrigger>
              <TabsTrigger value="automated-trading" asChild>
                <Link href="/automated-trading" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Automated Trading
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Link href="/settings" className="flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </div>
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
    </SidebarProvider>
  );
}