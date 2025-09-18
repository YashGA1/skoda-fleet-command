import { useAuth } from '@/contexts/AuthContext.jsx';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar.jsx';
import { AppHeader } from './AppHeader.jsx';

export function AppLayout({ children }) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 bg-muted/20">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}