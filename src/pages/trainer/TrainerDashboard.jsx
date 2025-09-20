import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Car, Clock, BookOpen, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';

export function TrainerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings } = useBookings();
  
  // Filter bookings for current trainer
  const trainerBookings = bookings.filter(booking => booking.trainerId === user?.id);
  const todaysBookings = trainerBookings.filter(booking => {
    const today = new Date().toISOString().split('T')[0];
    return booking.startDate === today;
  });
  const upcomingBookings = trainerBookings.filter(booking => {
    const today = new Date().toISOString().split('T')[0];
    return booking.startDate > today && booking.status === 'confirmed';
  });

  const stats = [
    {
      title: "Today's Bookings",
      value: todaysBookings.length,
      description: "Active sessions today",
      icon: CalendarDays,
      color: "text-blue-600"
    },
    {
      title: "Upcoming Bookings",
      value: upcomingBookings.length,
      description: "Scheduled sessions",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Total Bookings",
      value: trainerBookings.length,
      description: "All time bookings",
      icon: BookOpen,
      color: "text-purple-600"
    },
    {
      title: "Available Vehicles",
      value: 12,
      description: "Ready for booking",
      icon: Car,
      color: "text-orange-600"
    }
  ];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'completed': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <Button onClick={() => navigate('/trainer/book-vehicle')}>
          <Plus className="mr-2 h-4 w-4" />
          Book Vehicle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>
            Your vehicle bookings for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaysBookings.length > 0 ? (
            <div className="space-y-4">
              {todaysBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Vehicle #{booking.vehicleId}</h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.startTime} - {booking.endTime}
                      </p>
                      <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bookings scheduled for today</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/trainer/book-vehicle')}
              >
                Book a Vehicle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>
            Your confirmed vehicle reservations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Vehicle #{booking.vehicleId}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.startDate).toLocaleDateString()} • {booking.startTime} - {booking.endTime}
                      </p>
                      <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming bookings</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/trainer/book-vehicle')}
              >
                Book a Vehicle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}