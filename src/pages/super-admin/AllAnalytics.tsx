import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import { Calendar, TrendingUp, Users, Car, Download } from 'lucide-react';
import { LOCATIONS } from '@/constants/locations';

const mockAnalytics = {
  overview: {
    totalBookings: 1245,
    activeTrainers: 51,
    avgDuration: 2.4,
    utilization: 78.5,
  },
  monthlyTrends: [
    { month: 'Jan', bookings: 98, hours: 245 },
    { month: 'Feb', bookings: 112, hours: 268 },
    { month: 'Mar', bookings: 105, hours: 252 },
    { month: 'Apr', bookings: 125, hours: 305 },
    { month: 'May', bookings: 118, hours: 286 },
    { month: 'Jun', bookings: 132, hours: 318 },
  ],
  topVehicles: [
    { id: '1', vehicle: 'Skoda Octavia - SK001', location: 'PTC', bookings: 45, hours: 108 },
    { id: '2', vehicle: 'VW Golf - VW003', location: 'VGTAP', bookings: 42, hours: 98 },
    { id: '3', vehicle: 'Audi A4 - AD002', location: 'NCR', bookings: 38, hours: 89 },
    { id: '4', vehicle: 'Skoda Superb - SK005', location: 'BLR', bookings: 36, hours: 86 },
  ],
};

export function AllAnalytics() {
  const [timeRange, setTimeRange] = useState('6months');
  const [locationFilter, setLocationFilter] = useState('all');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Analytics - All Locations</h1>
          <p className="text-muted-foreground">
            Training fleet performance and usage insights across all centers
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {LOCATIONS.map(loc => (
                <SelectItem key={loc.code} value={loc.code}>
                  {loc.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={mockAnalytics.overview.totalBookings}
          description="Across all locations"
          icon={Calendar}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Active Trainers"
          value={mockAnalytics.overview.activeTrainers}
          description="System-wide"
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Avg Duration"
          value={`${mockAnalytics.overview.avgDuration}h`}
          description="Per booking"
          icon={TrendingUp}
          trend={{ value: 5.3, isPositive: false }}
        />
        <StatCard
          title="Fleet Utilization"
          value={`${mockAnalytics.overview.utilization}%`}
          description="Overall efficiency"
          icon={Car}
          trend={{ value: 3.2, isPositive: true }}
        />
      </div>

      {/* Monthly Usage Trends */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Monthly Usage Trends</span>
          </CardTitle>
          <CardDescription>Booking patterns and usage hours over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalytics.monthlyTrends.map((trend) => (
              <div
                key={trend.month}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium">{trend.month} 2024</p>
                  <p className="text-sm text-muted-foreground">
                    {trend.bookings} bookings • {trend.hours} hours
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{trend.bookings}</div>
                    <div className="text-xs text-muted-foreground">Bookings</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{trend.hours}h</div>
                    <div className="text-xs text-muted-foreground">Hours</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most Used Vehicles */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>Most Used Vehicles</span>
          </CardTitle>
          <CardDescription>Top performing vehicles across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalytics.topVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    #{index + 1}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{vehicle.vehicle}</p>
                    <p className="text-sm text-muted-foreground">
                      Location: {vehicle.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{vehicle.bookings}</div>
                    <div className="text-xs text-muted-foreground">Bookings</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{vehicle.hours}h</div>
                    <div className="text-xs text-muted-foreground">Hours</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Analytics Reports</CardTitle>
          <CardDescription>Generate detailed analytics reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Fleet Utilization</p>
                <p className="text-xs text-muted-foreground">Detailed vehicle usage report</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Trainer Activity</p>
                <p className="text-xs text-muted-foreground">Trainer engagement metrics</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Location Comparison</p>
                <p className="text-xs text-muted-foreground">Cross-location analysis</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
