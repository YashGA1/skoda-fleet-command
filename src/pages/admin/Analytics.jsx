import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar, 
  Users, 
  Car, 
  DollarSign,
  Download
} from 'lucide-react';

const mockAnalytics = {
  overview: {
    totalRevenue: 125847,
    totalBookings: 1284,
    avgBookingDuration: 2.4,
    fleetUtilization: 76.8,
  },
  monthlyTrends: [
    { month: 'Jan', bookings: 98, revenue: 9800, utilization: 72 },
    { month: 'Feb', bookings: 125, revenue: 12500, utilization: 78 },
    { month: 'Mar', bookings: 142, revenue: 14200, utilization: 85 },
    { month: 'Apr', bookings: 118, revenue: 11800, utilization: 68 },
    { month: 'May', bookings: 156, revenue: 15600, utilization: 82 },
    { month: 'Jun', bookings: 178, revenue: 17800, utilization: 89 },
  ],
  topVehicles: [
    { model: 'VW Tiguan AllSpace', bookings: 45, revenue: 4500, utilization: 92 },
    { model: 'VW T Roc', bookings: 38, revenue: 3800, utilization: 87 },
    { model: 'VW Taigun', bookings: 32, revenue: 3200, utilization: 78 },
    { model: 'VW Vento', bookings: 28, revenue: 2800, utilization: 65 },
    { model: 'VW Passat', bookings: 25, revenue: 2500, utilization: 58 },
  ],
  customerMetrics: {
    newCustomers: 45,
    returningCustomers: 234,
    avgCustomerLifetime: 8.5,
    satisfactionScore: 4.6,
  },
  peakUsage: [
    { day: 'Monday', hours: '09:00-11:00', percentage: 85 },
    { day: 'Tuesday', hours: '14:00-16:00', percentage: 78 },
    { day: 'Wednesday', hours: '10:00-12:00', percentage: 92 },
    { day: 'Thursday', hours: '15:00-17:00', percentage: 73 },
    { day: 'Friday', hours: '08:00-10:00', percentage: 68 },
  ],
};

export function Analytics() {
  const [timeRange, setTimeRange] = useState('6months');
  const [reportType, setReportType] = useState('overview');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex space-x-2">
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
          title="Total Revenue"
          value={`$${mockAnalytics.overview.totalRevenue.toLocaleString()}`}
          description="Revenue this period"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Total Bookings"
          value={mockAnalytics.overview.totalBookings}
          description="Completed bookings"
          icon={Calendar}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Avg Duration"
          value={`${mockAnalytics.overview.avgBookingDuration}h`}
          description="Per booking"
          icon={Users}
          trend={{ value: 5.1, isPositive: true }}
        />
        <StatCard
          title="Fleet Utilization"
          value={`${mockAnalytics.overview.fleetUtilization}%`}
          description="Overall efficiency"
          icon={Car}
          trend={{ value: 3.2, isPositive: false }}
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Monthly Trends</span>
            </CardTitle>
            <CardDescription>
              Booking and revenue trends over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart visualization would go here
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Top Performing Vehicles</span>
            </CardTitle>
            <CardDescription>
              Vehicle utilization breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.topVehicles.map((vehicle, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{vehicle.model}</p>
                    <p className="text-sm text-muted-foreground">{vehicle.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${vehicle.revenue}</p>
                    <Badge variant={vehicle.utilization > 80 ? 'default' : 'secondary'}>
                      {vehicle.utilization}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}