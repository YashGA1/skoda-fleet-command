import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useBookings } from '@/hooks/useBookings';
import { useVehicles } from '@/hooks/useVehicles';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Car, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export function VehicleReturn() {
  const { user } = useAuth();
  const { bookings, updateBookingStatus } = useBookings();
  const { vehicles } = useVehicles();
  const { toast } = useToast();
  
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [returnData, setReturnData] = useState({
    mileage: '',
    fuelLevel: '',
    condition: 'Good',
    damageReport: '',
    notes: ''
  });

  // Get active bookings for current trainer
  const activeBookings = bookings.filter(
    booking => 
      booking.trainerId === user?.id && 
      booking.status === 'active'
  );

  const getVehicleDetails = (booking: any) => {
    const vehicle = vehicles.find(v => v.id === booking.vehicleId);
    return vehicle || null;
  };

  const handleReturn = async () => {
    if (!selectedBooking) return;

    try {
      // Update booking status
      await updateBookingStatus(
        selectedBooking.id, 
        'completed',
        `Vehicle returned. ${returnData.notes ? `Notes: ${returnData.notes}` : ''}`
      );

      toast({
        title: "Vehicle Returned Successfully",
        description: `${selectedBooking.vehicle} has been marked as returned.`,
      });

      // Reset form
      setSelectedBooking(null);
      setReturnData({
        mileage: '',
        fuelLevel: '',
        condition: 'Good',
        damageReport: '',
        notes: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process vehicle return. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'Good':
        return 'success';
      case 'Minor Issues':
        return 'secondary';
      case 'Damage':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Vehicle Return</h1>
        <p className="text-muted-foreground">
          Return your assigned vehicles and report any issues or damages.
        </p>
      </div>

      {!selectedBooking ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Vehicle Assignments</CardTitle>
              <CardDescription>
                Select a vehicle to return from your active bookings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeBookings.map((booking) => {
                    const vehicle = getVehicleDetails(booking);
                    if (!vehicle) return null;

                    return (
                      <Card key={booking.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{vehicle.brand} {vehicle.model}</h3>
                              <Badge variant="outline">{vehicle.modelYear}</Badge>
                            </div>
                            
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4" />
                                <span>{vehicle.regNo}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{booking.startDate} to {booking.endDate}</span>
                              </div>
                            </div>

                            <Button 
                              className="w-full"
                              onClick={() => setSelectedBooking({ ...booking, vehicle: `${vehicle.brand} ${vehicle.model}` })}
                            >
                              Return Vehicle
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active vehicle assignments found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Return Vehicle</CardTitle>
              <CardDescription>
                {selectedBooking.vehicle} • Booking #{selectedBooking.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mileage">Current Mileage (km)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="Enter current mileage"
                    value={returnData.mileage}
                    onChange={(e) => setReturnData({...returnData, mileage: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="fuelLevel">Fuel Level (%)</Label>
                  <Input
                    id="fuelLevel"
                    type="number"
                    placeholder="Enter fuel level percentage"
                    min="0"
                    max="100"
                    value={returnData.fuelLevel}
                    onChange={(e) => setReturnData({...returnData, fuelLevel: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="condition">Vehicle Condition</Label>
                <select
                  id="condition"
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={returnData.condition}
                  onChange={(e) => setReturnData({...returnData, condition: e.target.value})}
                >
                  <option value="Good">Good - No issues</option>
                  <option value="Minor Issues">Minor Issues - Small problems</option>
                  <option value="Damage">Damage - Requires attention</option>
                </select>
              </div>

              {returnData.condition !== 'Good' && (
                <div>
                  <Label htmlFor="damageReport">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Damage/Issue Report
                    </div>
                  </Label>
                  <Textarea
                    id="damageReport"
                    placeholder="Please describe any damages, issues, or concerns with the vehicle..."
                    className="min-h-[120px]"
                    value={returnData.damageReport}
                    onChange={(e) => setReturnData({...returnData, damageReport: e.target.value})}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional comments about the vehicle usage..."
                  value={returnData.notes}
                  onChange={(e) => setReturnData({...returnData, notes: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Vehicle Condition: </p>
                  <Badge variant={getConditionBadge(returnData.condition) as any}>
                    {returnData.condition}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBooking(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReturn}
                  disabled={!returnData.mileage || !returnData.fuelLevel}
                >
                  Complete Return
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}