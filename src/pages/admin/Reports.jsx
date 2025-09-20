import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, BarChart3, Calendar, TrendingUp } from 'lucide-react';

const reportTemplates = [
  {
    id: 'vehicle-utilization',
    title: 'Vehicle Utilization Report',
    description: 'Analyze vehicle usage patterns and efficiency metrics',
    type: 'Analytics',
    frequency: 'Monthly',
    lastGenerated: '2024-01-15',
    status: 'ready'
  },
  {
    id: 'booking-summary',
    title: 'Booking Summary Report',
    description: 'Overview of booking trends and trainer activity',
    type: 'Summary',
    frequency: 'Weekly',
    lastGenerated: '2024-01-14',
    status: 'ready'
  },
  {
    id: 'maintenance-costs',
    title: 'Maintenance Costs Report',
    description: 'Track service expenses and budget allocation',
    type: 'Financial',
    frequency: 'Quarterly',
    lastGenerated: '2024-01-01',
    status: 'pending'
  },
  {
    id: 'safety-compliance',
    title: 'Safety Compliance Report',
    description: 'Monitor safety protocols and compliance metrics',
    type: 'Compliance',
    frequency: 'Monthly',
    lastGenerated: '2024-01-10',
    status: 'ready'
  }
];

export function Reports() {
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ready': return 'default';
      case 'pending': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Analytics': return <BarChart3 className="h-4 w-4" />;
      case 'Financial': return <TrendingUp className="h-4 w-4" />;
      case 'Summary': return <FileText className="h-4 w-4" />;
      case 'Compliance': return <Calendar className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and download system reports</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reportTemplates.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                    {getTypeIcon(report.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {report.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(report.status)}>
                  {report.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{report.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Frequency</p>
                    <p className="font-medium">{report.frequency}</p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="text-muted-foreground">Last Generated</p>
                  <p className="font-medium">
                    {new Date(report.lastGenerated).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    Generate Report
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={report.status !== 'ready'}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Archive</CardTitle>
          <CardDescription>
            Access previously generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No archived reports available</p>
            <p className="text-sm">Generated reports will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}