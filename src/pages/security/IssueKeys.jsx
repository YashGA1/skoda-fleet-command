import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, KeyRound, User, Car, Clock } from 'lucide-react';

const mockVehicles = [
  {
    id: 'V001',
    model: 'Skoda Octavia',
    licensePlate: 'SKO-001',
    status: 'available',
    location: 'Parking Lot A'
  },
  {
    id: 'V002',
    model: 'Volkswagen Golf',
    licensePlate: 'VW-002',
    status: 'in-use',
    location: 'Training Ground',
    assignedTo: 'Sarah Trainer'
  },
  {
    id: 'V003',
    model: 'Audi A4',
    licensePlate: 'AUD-003',
    status: 'available',
    location: 'Parking Lot B'
  },
  {
    id: 'V004',
    model: 'Skoda Superb',
    licensePlate: 'SKO-004',
    status: 'maintenance',
    location: 'Service Bay'
  }
];

const mockTrainers = [
  {
    id: 'T001',
    name: 'Sarah Trainer',
    employeeId: 'EMP002',
    department: 'Training Center',
    status: 'active'
  },
  {
    id: 'T002',
    name: 'Mike Johnson',
    employeeId: 'EMP005',
    department: 'Training Center',
    status: 'active'
  },
  {
    id: 'T003',
    name: 'John Smith',
    employeeId: 'EMP008',
    department: 'Training Center',
    status: 'active'
  }
];

export function IssueKeys() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const availableVehicles = mockVehicles.filter(vehicle => vehicle.status === 'available');
  const filteredVehicles = availableVehicles.filter(vehicle =>
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'available': return 'default';
      case 'in-use': return 'secondary';
      case 'maintenance': return 'destructive';
      default: return 'outline';
    }
  };

  const handleIssueKey = () => {
    if (selectedVehicle && selectedTrainer) {
      // Issue key logic would go here
      console.log('Issuing key for vehicle:', selectedVehicle.id, 'to trainer:', selectedTrainer.id);
      setSelectedVehicle(null);
      setSelectedTrainer(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Key Management</h1>
        <p className="text-muted-foreground">Issue and track vehicle keys</p>
      </div>

      {/* Key Issuing Form */}
      <Card>
        <CardHeader>
          <CardTitle>Issue Vehicle Key</CardTitle>
          <CardDescription>
            Select a vehicle and trainer to issue a key
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Selected Vehicle</h3>
              {selectedVehicle ? (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <Car className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">{selectedVehicle.model}</h4>
                      <p className="text-sm text-muted-foreground">{selectedVehicle.licensePlate}</p>
                      <p className="text-sm text-muted-foreground">{selectedVehicle.location}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setSelectedVehicle(null)}
                  >
                    Change Vehicle
                  </Button>
                </div>
              ) : (
                <div className="p-4 border rounded-lg border-dashed text-center">
                  <Car className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No vehicle selected</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Selected Trainer</h3>
              {selectedTrainer ? (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <User className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">{selectedTrainer.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedTrainer.employeeId}</p>
                      <p className="text-sm text-muted-foreground">{selectedTrainer.department}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setSelectedTrainer(null)}
                  >
                    Change Trainer
                  </Button>
                </div>
              ) : (
                <div className="p-4 border rounded-lg border-dashed text-center">
                  <User className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No trainer selected</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Button 
              onClick={handleIssueKey}
              disabled={!selectedVehicle || !selectedTrainer}
              className="w-full"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Issue Key
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle>Available Vehicles</CardTitle>
          <CardDescription>
            Select a vehicle to issue its key
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedVehicle?.id === vehicle.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Car className="h-5 w-5 text-primary" />
                  <Badge variant={getStatusBadgeVariant(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                </div>
                <h3 className="font-semibold">{vehicle.model}</h3>
                <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                <p className="text-sm text-muted-foreground">{vehicle.location}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Trainers */}
      <Card>
        <CardHeader>
          <CardTitle>Available Trainers</CardTitle>
          <CardDescription>
            Select a trainer to assign the key to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTrainers.map((trainer) => (
              <div 
                key={trainer.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTrainer?.id === trainer.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedTrainer(trainer)}
              >
                <div className="flex items-center justify-between mb-2">
                  <User className="h-5 w-5 text-primary" />
                  <Badge variant="default">
                    {trainer.status}
                  </Badge>
                </div>
                <h3 className="font-semibold">{trainer.name}</h3>
                <p className="text-sm text-muted-foreground">{trainer.employeeId}</p>
                <p className="text-sm text-muted-foreground">{trainer.department}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}