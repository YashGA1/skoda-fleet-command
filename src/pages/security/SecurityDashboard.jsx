import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KeyRound, Car, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const mockKeyRequests = [
  {
    id: '1',
    trainerId: 'T001',
    trainerName: 'Sarah Trainer',
    vehicleId: 'V001',
    vehicleModel: 'Skoda Octavia',
    requestTime: '2024-01-15T09:30:00Z',
    status: 'pending',
    purpose: 'Driver training session'
  },
  {
    id: '2',
    trainerId: 'T002',
    trainerName: 'Mike Johnson',
    vehicleId: 'V003',
    vehicleModel: 'Audi A4',
    requestTime: '2024-01-15T10:15:00Z',
    status: 'approved',
    purpose: 'Highway driving practice'
  }
];

const mockActiveKeys = [
  {
    id: '1',
    vehicleId: 'V001',
    vehicleModel: 'Skoda Octavia',
    trainerId: 'T001',
    trainerName: 'Sarah Trainer',
    issuedAt: '2024-01-15T09:45:00Z',
    expectedReturn: '2024-01-15T17:00:00Z'
  },
  {
    id: '2',
    vehicleId: 'V005',
    vehicleModel: 'Volkswagen Golf',
    trainerId: 'T003',
    trainerName: 'John Smith',
    issuedAt: '2024-01-15T08:30:00Z',
    expectedReturn: '2024-01-15T16:30:00Z'
  }
];

export function SecurityDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    {
      title: "Pending Requests",
      value: mockKeyRequests.filter(req => req.status === 'pending').length,
      description: "Awaiting approval",
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Active Keys",
      value: mockActiveKeys.length,
      description: "Currently issued",
      icon: KeyRound,
      color: "text-blue-600"
    },
    {
      title: "Available Vehicles",
      value: 8,
      description: "Ready for use",
      icon: Car,
      color: "text-green-600"
    },
    {
      title: "Total Trainers",
      value: 15,
      description: "Authorized users",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const isOverdue = (expectedReturn) => {
    return new Date(expectedReturn) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <Button onClick={() => navigate('/security/issue-keys')}>
          <KeyRound className="mr-2 h-4 w-4" />
          Manage Keys
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

      {/* Pending Key Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Key Requests</CardTitle>
          <CardDescription>
            Vehicle key requests awaiting approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockKeyRequests.filter(req => req.status === 'pending').length > 0 ? (
            <div className="space-y-4">
              {mockKeyRequests.filter(req => req.status === 'pending').map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                      <KeyRound className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{request.trainerName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Requesting {request.vehicleModel} ({request.vehicleId})
                      </p>
                      <p className="text-sm text-muted-foreground">{request.purpose}</p>
                      <p className="text-xs text-muted-foreground">
                        Requested: {new Date(request.requestTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <KeyRound className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending key requests</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Keys */}
      <Card>
        <CardHeader>
          <CardTitle>Currently Issued Keys</CardTitle>
          <CardDescription>
            Vehicle keys currently in use
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockActiveKeys.length > 0 ? (
            <div className="space-y-4">
              {mockActiveKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{key.vehicleModel} ({key.vehicleId})</h3>
                        {isOverdue(key.expectedReturn) && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Trainer: {key.trainerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Issued: {new Date(key.issuedAt).toLocaleString()}
                      </p>
                      <p className={`text-xs ${isOverdue(key.expectedReturn) ? 'text-red-500' : 'text-muted-foreground'}`}>
                        Expected return: {new Date(key.expectedReturn).toLocaleString()}
                        {isOverdue(key.expectedReturn) && ' (OVERDUE)'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Return Key
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No keys currently issued</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}