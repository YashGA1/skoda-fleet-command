import { useLocation, Link } from 'react-router-dom';
import {
  BarChart3,
  Car,
  Calendar,
  Users,
  Settings,
  FileText,
  Key,
  ArrowLeftRight,
  BookOpen,
  Shield,
  Home
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext.jsx';

// Navigation items based on user role
const navigationItems = {
  admin: [
    { title: 'Dashboard', url: '/admin', icon: Home, group: 'Overview' },
    { title: 'Analytics', url: '/admin/analytics', icon: BarChart3, group: 'Overview' },
    { title: 'Vehicles', url: '/admin/vehicles', icon: Car, group: 'Management' },
    { title: 'Users', url: '/admin/users', icon: Users, group: 'Management' },
    { title: 'Bookings', url: '/admin/bookings', icon: Calendar, group: 'Management' },
    { title: 'Service Records', url: '/admin/service-records', icon: Settings, group: 'Maintenance' },
    { title: 'Reports', url: '/admin/reports', icon: FileText, group: 'Reports' },
  ],
  trainer: [
    { title: 'Dashboard', url: '/trainer', icon: Home, group: 'Overview' },
    { title: 'Book Vehicle', url: '/trainer/book-vehicle', icon: Car, group: 'Booking' },
    { title: 'My Bookings', url: '/trainer/my-bookings', icon: Calendar, group: 'Booking' },
  ],
  security: [
    { title: 'Dashboard', url: '/security', icon: Home, group: 'Overview' },
    { title: 'Issue Keys', url: '/security/keys', icon: Key, group: 'Operations' },
    { title: 'Vehicle Returns', url: '/security/returns', icon: ArrowLeftRight, group: 'Operations' },
    { title: 'Security Logs', url: '/security/logs', icon: Shield, group: 'Monitoring' },
  ],
};

export function AppSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();

  if (!user) return null;

  const items = navigationItems[user.role];
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {});

  const isActive = (path) => location.pathname === path;

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-lg">
            <Car className="h-6 w-6 text-white" />
          </div>
          {state === "expanded" && (
            <div>
              <h2 className="text-xl font-bold text-sidebar-foreground">Skoda Fleet</h2>
              <p className="text-sm text-sidebar-foreground/70 capitalize font-medium">
                {user.role} Portal
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        {Object.entries(groupedItems).map(([groupName, groupItems]) => (
          <SidebarGroup key={groupName} className="mb-6">
            {state === "expanded" && (
              <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3 px-3">
                {groupName}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {groupItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className={`nav-item rounded-xl transition-all duration-200 ${
                        isActive(item.url) 
                          ? 'bg-gradient-primary text-white shadow-lg hover:shadow-colored' 
                          : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                      }`}
                    >
                      <Link to={item.url} className="flex items-center space-x-3 p-3 min-h-[48px]">
                        <item.icon className={`h-5 w-5 flex-shrink-0 ${
                          isActive(item.url) ? 'text-white' : 'text-sidebar-primary'
                        }`} />
                        {state === "expanded" && (
                          <span className="font-medium text-sm">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}