import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../AppSidebar';
import { Search } from '@/components/ui/search';
import { Notifications } from '@/components/ui/notifications';
import { ProfileDropdown } from '@/components/ui/profile-dropdown';
import logo from '../../../public/logo.jpg'

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop header */}
          <header className="hidden lg:flex h-16 items-center justify-between border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-foreground">
               GAIT ANALYSIS
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Search onSearch={(query) => console.log('Search:', query)} />
              <Notifications />
              <ProfileDropdown />
            </div>
          </header>

          {/* Mobile header with trigger */}
          <header className="lg:hidden h-14 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                  <img src={logo} className="text-primary-foreground text-xs font-bold"/>
                </div>
                <span className="font-semibold text-foreground text-sm">Kinova</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Notifications />
              <ProfileDropdown />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};