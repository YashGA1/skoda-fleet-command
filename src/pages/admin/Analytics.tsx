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
    { model: 'Skoda Octavia', bookings: 45, revenue: 4500, utilization: 92 },
    { model: 'VW Golf', bookings: 38, revenue: 3800, utilization: 87 },
    { model: 'Audi A4', bookings: 32, revenue: 3200, utilization: 78 },
    { model: 'Skoda Fabia', bookings: 28, revenue: 2800, utilization: 65 },
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

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trends */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Monthly Trends</span>
            </CardTitle>
            <CardDescription>Bookings and revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.monthlyTrends.map((trend, index) => (
                <div key={trend.month} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium">{trend.month}</div>
                    <Badge variant="outline">{trend.bookings} bookings</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${trend.revenue}</div>
                    <div className="text-xs text-muted-foreground">{trend.utilization}% utilization</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Vehicles */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Top Performing Vehicles</span>
            </CardTitle>
            <CardDescription>Most booked vehicles by performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.topVehicles.map((vehicle, index) => (
                <div key={vehicle.model} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{vehicle.model}</div>
                      <div className="text-xs text-muted-foreground">{vehicle.bookings} bookings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${vehicle.revenue}</div>
                    <div className="text-xs text-muted-foreground">{vehicle.utilization}% utilization</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer & Usage Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Metrics */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Customer Analytics</span>
            </CardTitle>
            <CardDescription>Customer acquisition and retention metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">{mockAnalytics.customerMetrics.newCustomers}</div>
                <div className="text-sm text-muted-foreground">New Customers</div>
                <div className="flex items-center text-xs text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% vs last month
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">{mockAnalytics.customerMetrics.returningCustomers}</div>
                <div className="text-sm text-muted-foreground">Returning Customers</div>
                <div className="flex items-center text-xs text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% vs last month
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">{mockAnalytics.customerMetrics.avgCustomerLifetime}</div>
                <div className="text-sm text-muted-foreground">Avg Customer Lifetime (months)</div>
                <div className="flex items-center text-xs text-destructive">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2% vs last month
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">{mockAnalytics.customerMetrics.satisfactionScore}/5</div>
                <div className="text-sm text-muted-foreground">Satisfaction Score</div>
                <div className="flex items-center text-xs text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3% vs last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Usage Times */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Peak Usage Analysis</span>
            </CardTitle>
            <CardDescription>Busiest times and demand patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.peakUsage.map((peak) => (
                <div key={peak.day} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{peak.day}</div>
                    <div className="text-xs text-muted-foreground">{peak.hours}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${peak.percentage}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium">{peak.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Analytics Actions</CardTitle>
          <CardDescription>Generate detailed reports and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Revenue Report</p>
                <p className="text-xs text-muted-foreground">Detailed financial analysis</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Usage Statistics</p>
                <p className="text-xs text-muted-foreground">Fleet utilization metrics</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Customer Analysis</p>
                <p className="text-xs text-muted-foreground">Behavior and satisfaction</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Custom Report</p>
                <p className="text-xs text-muted-foreground">Build your own analysis</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}