import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Car, User, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const mockActiveKeys = [
  {
    id: '1',
    vehicleId: 'V001',
    vehicleModel: 'Skoda Octavia',
    licensePlate: 'SKO-001',
    trainerId: 'T001',
    trainerName: 'Sarah Trainer',
    issuedAt: '2024-01-15T09:45:00Z',
    expectedReturn: '2024-01-15T17:00:00Z',
    fuelLevel: 85,
    mileage: 45230
  },
  {
    id: '2',
    vehicleId: 'V005',
    vehicleModel: 'Volkswagen Golf',
    licensePlate: 'VW-005',
    trainerId: 'T003',
    trainerName: 'John Smith',
    issuedAt: '2024-01-15T08:30:00Z',
    expectedReturn: '2024-01-15T16:30:00Z',
    fuelLevel: 70,
    mileage: 62100
  },
  {
    id: '3',
    vehicleId: 'V003',
    vehicleModel: 'Audi A4',
    licensePlate: 'AUD-003',
    trainerId: 'T002',
    trainerName: 'Mike Johnson',
    issuedAt: '2024-01-14T14:00:00Z',
    expectedReturn: '2024-01-14T22:00:00Z',
    fuelLevel: 45,
    mileage: 38750
  }
];

export function VehicleReturns() {
  const [selectedKey, setSelectedKey] = useState(null);
  const [returnData, setReturnData] = useState({
    mileage: '',
    fuelLevel: '',
    condition: '',
    notes: ''
  });

  const isOverdue = (expectedReturn) => {
    return new Date(expectedReturn) < new Date();
  };

  const handleReturnVehicle = () => {
    if (selectedKey) {
      // Process vehicle return logic would go here
      console.log('Processing return for:', selectedKey.id, returnData);
      setSelectedKey(null);
      setReturnData({
        mileage: '',
        fuelLevel: '',
        condition: '',
        notes: ''
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vehicle Returns</h1>
        <p className="text-muted-foreground">Process vehicle returns and key collection</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Keys List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Vehicle Keys</CardTitle>
            <CardDescription>
              Select a vehicle to process its return
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActiveKeys.map((key) => (
                <div 
                  key={key.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedKey?.id === key.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedKey(key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{key.vehicleModel}</span>
                      {isOverdue(key.expectedReturn) && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <Badge variant={isOverdue(key.expectedReturn) ? 'destructive' : 'default'}>
                      {isOverdue(key.expectedReturn) ? 'OVERDUE' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">License Plate</p>
                      <p className="font-medium">{key.licensePlate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trainer</p>
                      <p className="font-medium">{key.trainerName}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                      <p className="text-muted-foreground">Issued</p>
                      <p className="font-medium">{new Date(key.issuedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expected Return</p>
                      <p className={`font-medium ${isOverdue(key.expectedReturn) ? 'text-red-500' : ''}`}>
                        {new Date(key.expectedReturn).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Return Processing Form */}
        <Card>
          <CardHeader>
            <CardTitle>Process Return</CardTitle>
            <CardDescription>
              {selectedKey ? `Processing return for ${selectedKey.vehicleModel}` : 'Select a vehicle to process return'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedKey ? (
              <div className="space-y-4">
                {/* Vehicle Info */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Car className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">{selectedKey.vehicleModel}</h3>
                      <p className="text-sm text-muted-foreground">{selectedKey.licensePlate}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Mileage</p>
                      <p className="font-medium">{selectedKey.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fuel Level</p>
                      <p className="font-medium">{selectedKey.fuelLevel}%</p>
                    </div>
                  </div>
                </div>

                {/* Return Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Return Mileage</label>
                      <Input
                        type="number"
                        placeholder="Enter mileage"
                        value={returnData.mileage}
                        onChange={(e) => setReturnData(prev => ({ ...prev, mileage: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Fuel Level (%)</label>
                      <Input
                        type="number"
                        placeholder="Enter fuel level"
                        value={returnData.fuelLevel}
                        onChange={(e) => setReturnData(prev => ({ ...prev, fuelLevel: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Vehicle Condition</label>
                    <select 
                      className="w-full mt-1 p-2 border rounded-md"
                      value={returnData.condition}
                      onChange={(e) => setReturnData(prev => ({ ...prev, condition: e.target.value }))}
                    >
                      <option value="">Select condition</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="needs-attention">Needs Attention</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      placeholder="Any damage, issues, or observations..."
                      value={returnData.notes}
                      onChange={(e) => setReturnData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleReturnVehicle}
                    className="w-full"
                    disabled={!returnData.mileage || !returnData.fuelLevel || !returnData.condition}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Process Return
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a vehicle from the left to process its return</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}