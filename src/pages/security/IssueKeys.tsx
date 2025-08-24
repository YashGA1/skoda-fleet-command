import { useState } from 'react';
import { Key, Search, Filter, Clock, User, Car, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBookings } from '@/hooks/useBookings';
import { useVehicles } from '@/hooks/useVehicles';
import { useKeyManagement } from '@/hooks/useKeyManagement';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const issueKeySchema = z.object({
  bookingId: z.string().min(1, 'Please select a booking'),
  notes: z.string().optional(),
  expectedReturnTime: z.string().min(1, 'Expected return time is required'),
});

type IssueKeyForm = z.infer<typeof issueKeySchema>;

export function IssueKeys() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
  const { user } = useAuth();
  const { bookings, loading: bookingsLoading } = useBookings();
  const { vehicles } = useVehicles();
  const { keyIssues, issueKey, loading: keyLoading } = useKeyManagement();

  const form = useForm<IssueKeyForm>({
    resolver: zodResolver(issueKeySchema),
    defaultValues: {
      bookingId: '',
      notes: '',
      expectedReturnTime: '',
    },
  });

  // Filter approved bookings that don't have keys issued yet
  const availableBookings = bookings.filter(booking => {
    const hasKeyIssued = keyIssues.some(key => key.bookingId === booking.id);
    return booking.status === 'approved' && !hasKeyIssued;
  });

  // Filter bookings based on search and status
  const filteredBookings = availableBookings.filter(booking => {
    const searchMatch = booking.trainerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       booking.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return searchMatch;
    if (statusFilter === 'high-urgency') return searchMatch && booking.urgency === 'high';
    return searchMatch;
  });

  const getVehicleDetails = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const getUrgencyBadge = (urgency: string) => {
    return urgency === 'high' 
      ? <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />High Priority</Badge>
      : <Badge variant="outline">Normal</Badge>;
  };

  const handleIssueKey = (booking: any) => {
    setSelectedBooking(booking);
    form.setValue('bookingId', booking.id);
    // Set default expected return time to the booking end date
    form.setValue('expectedReturnTime', booking.endDate);
    setIsIssueDialogOpen(true);
  };

  const onSubmit = async (data: IssueKeyForm) => {
    if (!selectedBooking || !user) return;

    try {
      await issueKey({
        bookingId: data.bookingId,
        vehicleId: selectedBooking.vehicleId,
        issuedBy: user.id,
        issuedAt: new Date().toISOString(),
        expectedReturn: data.expectedReturnTime,
      });
      
      setIsIssueDialogOpen(false);
      form.reset();
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error issuing key:', error);
    }
  };

  const stats = {
    pendingIssues: filteredBookings.length,
    highPriority: filteredBookings.filter(b => b.urgency === 'high').length,
    activeKeys: keyIssues.filter(k => k.status === 'issued').length,
    overdueKeys: keyIssues.filter(k => k.status === 'overdue').length,
  };

  if (bookingsLoading || keyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Issue Keys</h1>
          <p className="text-muted-foreground">
            Manage vehicle key distribution to approved trainers
          </p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Dashboard
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingIssues}</div>
            <p className="text-xs text-muted-foreground">Awaiting key issue</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated border-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.highPriority}</div>
            <p className="text-xs text-muted-foreground">Urgent requests</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.activeKeys}</div>
            <p className="text-xs text-muted-foreground">Currently issued</p>
          </CardContent>
        </Card>

        <Card className="card-elevated border-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdueKeys}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by trainer name or purpose..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="high-urgency">High Priority Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pending Key Issues */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Approved Bookings - Ready for Key Issue
          </CardTitle>
          <CardDescription>
            {filteredBookings.length} booking(s) waiting for key distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending key issues found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const vehicle = getVehicleDetails(booking.vehicleId);
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}` : 'Unknown Vehicle'}
                          </h3>
                          {getUrgencyBadge(booking.urgency)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {booking.trainerName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd')}
                          </div>
                        </div>
                        <p className="text-sm">{booking.purpose}</p>
                        {booking.notes && (
                          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            Note: {booking.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => handleIssueKey(booking)}
                        className="bg-gradient-primary hover:bg-primary-hover"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Issue Key
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issue Key Dialog */}
      <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Vehicle Key</DialogTitle>
            <DialogDescription>
              Confirm key issue details for {selectedBooking?.trainerName}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Details</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Trainer:</strong> {selectedBooking?.trainerName}</p>
                  <p><strong>Vehicle:</strong> {selectedBooking && getVehicleDetails(selectedBooking.vehicleId) ? 
                    `${getVehicleDetails(selectedBooking.vehicleId)?.brand} ${getVehicleDetails(selectedBooking.vehicleId)?.model}` : 'Unknown'}</p>
                  <p><strong>Purpose:</strong> {selectedBooking?.purpose}</p>
                  <p><strong>Period:</strong> {selectedBooking && format(new Date(selectedBooking.startDate), 'MMM dd, yyyy')} - {selectedBooking && format(new Date(selectedBooking.endDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="expectedReturnTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Return Date & Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any special instructions or notes..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsIssueDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover">
                  <Key className="h-4 w-4 mr-2" />
                  Issue Key
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}