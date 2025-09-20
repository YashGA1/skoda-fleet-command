import { Car, Users, Calendar, Settings, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const mockStats = {
  totalVehicles: 45,
  activeBookings: 12,
  totalUsers: 89,
  maintenanceDue: 3,
};

const mockRecentBookings = [
  {
    id: '1',
    vehicle: 'Skoda Octavia - SK001',
    trainer: 'Sarah Thompson',
    date: '2024-01-15',
    status: 'active',
    duration: '2 hours'
  },
  {
    id: '2',
    vehicle: 'VW Golf - VW003',
    trainer: 'Mike Johnson',
    date: '2024-01-15',
    status: 'pending',
    duration: '3 hours'
  },
  {
    id: '3',
    vehicle: 'Audi A4 - AD002',
    trainer: 'Emma Wilson',
    date: '2024-01-14',
    status: 'completed',
    duration: '1.5 hours'
  },
];

const mockMaintenanceAlerts = [
  {
    id: '1',
    vehicle: 'Skoda Superb - SK005',
    type: 'Service Due',
    dueDate: '2024-01-20',
    priority: 'high'
  },
  {
    id: '2',
    vehicle: 'VW Passat - VW008',
    type: 'Inspection',
    dueDate: '2024-01-25',
    priority: 'medium'
  },
];

export function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Vehicles",
      value: mockStats.totalVehicles,
      description: "Active fleet vehicles",
      icon: Car,
      trend: { value: 8, isPositive: true },
      color: "text-blue-600"
    },
    {
      title: "Active Bookings",
      value: mockStats.activeBookings,
      description: "Current reservations",
      icon: Calendar,
      trend: { value: 12, isPositive: true },
      color: "text-green-600"
    },
    {
      title: "Total Users",
      value: mockStats.totalUsers,
      description: "Registered system users",
      icon: Users,
      trend: { value: 3, isPositive: true },
      color: "text-purple-600"
    },
    {
      title: "Maintenance Due",
      value: mockStats.maintenanceDue,
      description: "Vehicles requiring service",
      icon: AlertTriangle,
      color: "text-orange-600",
      className: "border-warning/30"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="status-active">Active</Badge>;
      case 'pending':
        return <Badge className="status-pending">Pending</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="heading-section">Admin Dashboard</h1>
          <p className="description-section">
            Welcome back, {user?.name}. Here's your fleet overview.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-accent rounded-lg border border-border/50">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
          <Button className="btn-skoda shadow-lg">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.title} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card className="card-elevated hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-accent rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <span>Recent Bookings</span>
            </CardTitle>
            <CardDescription>
              Latest vehicle reservations and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl hover:from-muted/50 hover:to-muted/20 transition-all duration-200 animate-fade-in border border-border/30"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{booking.vehicle}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.trainer} • {booking.duration}
                    </p>
                    <p className="text-xs text-muted-foreground">{booking.date}</p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border/50">
              <Button variant="ghost" className="w-full hover:bg-gradient-accent transition-all">
                View All Bookings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Alerts */}
        <Card className="card-elevated hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-accent rounded-lg">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <span>Maintenance Alerts</span>
            </CardTitle>
            <CardDescription>
              Vehicles requiring attention or scheduled maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockMaintenanceAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl hover:from-muted/50 hover:to-muted/20 transition-all duration-200 animate-fade-in border border-border/30"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{alert.vehicle}</p>
                    <p className="text-sm text-muted-foreground">{alert.type}</p>
                    <p className="text-xs text-muted-foreground">Due: {alert.dueDate}</p>
                  </div>
                  {getPriorityBadge(alert.priority)}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border/50">
              <Button variant="ghost" className="w-full hover:bg-gradient-accent transition-all">
                View All Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-elevated hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-accent rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Common administrative tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start h-auto p-6 hover:bg-gradient-accent hover:border-primary/30 transition-all duration-200 hover-scale">
              <div className="text-left">
                <p className="font-medium">Add Vehicle</p>
                <p className="text-xs text-muted-foreground mt-1">Register new vehicle</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-6 hover:bg-gradient-accent hover:border-primary/30 transition-all duration-200 hover-scale">
              <div className="text-left">
                <p className="font-medium">Create User</p>
                <p className="text-xs text-muted-foreground mt-1">Add new system user</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-6 hover:bg-gradient-accent hover:border-primary/30 transition-all duration-200 hover-scale">
              <div className="text-left">
                <p className="font-medium">Schedule Service</p>
                <p className="text-xs text-muted-foreground mt-1">Plan maintenance</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-6 hover:bg-gradient-accent hover:border-primary/30 transition-all duration-200 hover-scale">
              <div className="text-left">
                <p className="font-medium">Export Data</p>
                <p className="text-xs text-muted-foreground mt-1">Generate reports</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}