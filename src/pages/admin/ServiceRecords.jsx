import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Wrench, Calendar } from 'lucide-react';

const mockServiceRecords = [
  {
    id: '1',
    vehicleId: 'V001',
    vehicleModel: 'Skoda Octavia',
    serviceType: 'Regular Maintenance',
    date: '2024-01-10',
    mileage: 45000,
    description: 'Oil change, brake inspection, tire rotation',
    cost: 350,
    technician: 'John Smith',
    status: 'completed'
  },
  {
    id: '2',
    vehicleId: 'V002',
    vehicleModel: 'Volkswagen Golf',
    serviceType: 'Repair',
    date: '2024-01-08',
    mileage: 62000,
    description: 'Air conditioning repair, coolant replacement',
    cost: 450,
    technician: 'Sarah Johnson',
    status: 'completed'
  },
  {
    id: '3',
    vehicleId: 'V003',
    vehicleModel: 'Audi A4',
    serviceType: 'Inspection',
    date: '2024-01-12',
    mileage: 38000,
    description: 'Annual safety inspection',
    cost: 120,
    technician: 'Mike Wilson',
    status: 'scheduled'
  }
];

export default function ServiceRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [records] = useState(mockServiceRecords);

  const filteredRecords = records.filter(record =>
    record.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.technician.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed': return 'default';
      case 'scheduled': return 'secondary';
      case 'in-progress': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Records</h1>
          <p className="text-muted-foreground">Track vehicle maintenance and repairs</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Service Record
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service History</CardTitle>
          <CardDescription>
            View and manage vehicle service records
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search service records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{record.vehicleModel}</h3>
                      <Badge variant="outline">{record.vehicleId}</Badge>
                      <Badge variant={getStatusBadgeVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-primary">{record.serviceType}</p>
                    <p className="text-sm text-muted-foreground">{record.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                      <span>Mileage: {record.mileage.toLocaleString()} km</span>
                      <span>Technician: {record.technician}</span>
                      <span className="font-semibold text-foreground">${record.cost}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}