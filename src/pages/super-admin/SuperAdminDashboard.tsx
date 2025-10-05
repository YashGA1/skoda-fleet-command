import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Car, MapPin, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getLocationName } from '@/constants/locations';

export function SuperAdminDashboard() {
  const { user } = useAuth();

  // Mock statistics
  const stats = {
    totalLocations: 4,
    totalAdmins: 4,
    totalUsers: 142,
    totalVehicles: 76,
    activeBookings: 32,
    pendingIssues: 5
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System-wide overview and management
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Training Centers"
          value={stats.totalLocations}
          description="Active locations"
          icon={MapPin}
        />
        <StatCard
          title="Location Admins"
          value={stats.totalAdmins}
          description="Across all centers"
          icon={Shield}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="Trainers & Security"
          icon={Users}
        />
        <StatCard
          title="Fleet Size"
          value={stats.totalVehicles}
          description="Total vehicles"
          icon={Car}
        />
        <StatCard
          title="Active Bookings"
          value={stats.activeBookings}
          description="Currently in use"
          icon={Activity}
        />
        <StatCard
          title="Pending Issues"
          value={stats.pendingIssues}
          description="Require attention"
          icon={AlertCircle}
        />
      </div>

      {/* Location Overview */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Location Status Overview</CardTitle>
          <CardDescription>Quick view of all training centers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['PTC', 'VGTAP', 'NCR', 'BLR'].map((locationCode) => (
              <div key={locationCode} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{getLocationName(locationCode as any)}</h3>
                    <p className="text-sm text-muted-foreground">Location Code: {locationCode}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="font-semibold">{Math.floor(Math.random() * 25) + 10}</p>
                    <p className="text-muted-foreground">Vehicles</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{Math.floor(Math.random() * 15) + 5}</p>
                    <p className="text-muted-foreground">Trainers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{Math.floor(Math.random() * 10) + 3}</p>
                    <p className="text-muted-foreground">Bookings</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Latest actions across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { location: 'PTC', action: 'New admin created', time: '2 hours ago' },
              { location: 'VGTAP', action: 'Vehicle maintenance completed', time: '4 hours ago' },
              { location: 'NCR', action: 'New trainer onboarded', time: '6 hours ago' },
              { location: 'BLR', action: 'Document renewal alert', time: '8 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{getLocationName(activity.location as any)}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
