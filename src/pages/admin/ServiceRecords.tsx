import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { StatCard } from '@/components/dashboard/StatCard';
import { Plus, Edit, Search, Filter, Wrench, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceRecord {
  id: string;
  vehicleModel: string;
  licensePlate: string;
  serviceType: 'routine' | 'repair' | 'inspection' | 'emergency';
  description: string;
  serviceDate: string;
  nextServiceDate: string;
  cost: number;
  mileageAtService: number;
  technician: string;
  location: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
  createdAt: string;
}

const mockServiceRecords: ServiceRecord[] = [
  {
    id: '1',
    vehicleModel: 'Skoda Octavia',
    licensePlate: 'SK-001-AB',
    serviceType: 'routine',
    description: 'Oil change and filter replacement',
    serviceDate: '2024-01-15',
    nextServiceDate: '2024-04-15',
    cost: 150,
    mileageAtService: 45000,
    technician: 'John Mechanic',
    location: 'Service Center A',
    status: 'completed',
    priority: 'medium',
    notes: 'All systems checked, no additional issues found',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    vehicleModel: 'VW Golf',
    licensePlate: 'VW-003-CD',
    serviceType: 'inspection',
    description: 'Annual safety inspection',
    serviceDate: '2024-01-20',
    nextServiceDate: '2025-01-20',
    cost: 80,
    mileageAtService: 32000,
    technician: 'Mike Inspector',
    location: 'Inspection Station B',
    status: 'scheduled',
    priority: 'high',
    notes: 'Required by law, must be completed before deadline',
    createdAt: '2024-01-18'
  },
  {
    id: '3',
    vehicleModel: 'Audi A4',
    licensePlate: 'AD-002-EF',
    serviceType: 'repair',
    description: 'Brake pad replacement',
    serviceDate: '2024-01-18',
    nextServiceDate: '2024-07-18',
    cost: 320,
    mileageAtService: 78000,
    technician: 'Sarah Brake-Expert',
    location: 'Service Center A',
    status: 'in-progress',
    priority: 'critical',
    notes: 'Emergency repair - brakes showing wear beyond safe limits',
    createdAt: '2024-01-16'
  },
  {
    id: '4',
    vehicleModel: 'Skoda Fabia',
    licensePlate: 'SK-004-GH',
    serviceType: 'routine',
    description: 'Transmission fluid change',
    serviceDate: '2024-01-25',
    nextServiceDate: '2024-07-25',
    cost: 180,
    mileageAtService: 56000,
    technician: 'Tom Transmission',
    location: 'Service Center B',
    status: 'scheduled',
    priority: 'medium',
    notes: 'Preventive maintenance as per schedule',
    createdAt: '2024-01-20'
  },
  {
    id: '5',
    vehicleModel: 'VW Passat',
    licensePlate: 'VW-008-IJ',
    serviceType: 'emergency',
    description: 'Engine coolant leak repair',
    serviceDate: '2024-01-12',
    nextServiceDate: '2024-03-12',
    cost: 450,
    mileageAtService: 89000,
    technician: 'Dave Emergency',
    location: 'Emergency Service',
    status: 'completed',
    priority: 'critical',
    notes: 'Immediate repair required, vehicle was out of service',
    createdAt: '2024-01-12'
  },
  {
    id: '6',
    vehicleModel: 'Skoda Superb',
    licensePlate: 'SK-005-KL',
    serviceType: 'routine',
    description: 'Tire rotation and alignment',
    serviceDate: '2024-01-30',
    nextServiceDate: '2024-04-30',
    cost: 120,
    mileageAtService: 34000,
    technician: 'Lisa Tire-Pro',
    location: 'Service Center A',
    status: 'scheduled',
    priority: 'low',
    notes: 'Regular maintenance to ensure even tire wear',
    createdAt: '2024-01-25'
  }
];

const initialServiceForm: Omit<ServiceRecord, 'id' | 'createdAt'> = {
  vehicleModel: '',
  licensePlate: '',
  serviceType: 'routine',
  description: '',
  serviceDate: '',
  nextServiceDate: '',
  cost: 0,
  mileageAtService: 0,
  technician: '',
  location: '',
  status: 'scheduled',
  priority: 'medium',
  notes: ''
};

export function ServiceRecords() {
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>(mockServiceRecords);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
  const [serviceForm, setServiceForm] = useState<Omit<ServiceRecord, 'id' | 'createdAt'>>(initialServiceForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const filteredRecords = serviceRecords.filter(record => {
    const matchesSearch = 
      record.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.technician.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || record.serviceType === typeFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || record.priority === priorityFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingRecord) {
        setServiceRecords(prev => prev.map(record => 
          record.id === editingRecord.id 
            ? { ...record, ...serviceForm }
            : record
        ));
        toast.success('Service record updated successfully');
      } else {
        const newRecord: ServiceRecord = {
          ...serviceForm,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0]
        };
        setServiceRecords(prev => [...prev, newRecord]);
        toast.success('Service record created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error('Failed to save service record');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: ServiceRecord) => {
    setEditingRecord(record);
    setServiceForm(record);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setServiceForm(initialServiceForm);
    setEditingRecord(null);
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: ServiceRecord['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="border-primary text-primary">Scheduled</Badge>;
      case 'in-progress':
        return <Badge className="bg-warning text-warning-foreground">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: ServiceRecord['priority']) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-warning text-warning-foreground">High</Badge>;
      case 'medium':
        return <Badge variant="outline">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getServiceTypeBadge = (type: ServiceRecord['serviceType']) => {
    switch (type) {
      case 'routine':
        return <Badge className="bg-primary text-primary-foreground">Routine</Badge>;
      case 'repair':
        return <Badge className="bg-warning text-warning-foreground">Repair</Badge>;
      case 'inspection':
        return <Badge variant="outline">Inspection</Badge>;
      case 'emergency':
        return <Badge variant="destructive">Emergency</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const serviceStats = {
    total: serviceRecords.length,
    scheduled: serviceRecords.filter(r => r.status === 'scheduled').length,
    inProgress: serviceRecords.filter(r => r.status === 'in-progress').length,
    totalCost: serviceRecords.reduce((sum, r) => sum + r.cost, 0),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Records</h1>
          <p className="text-muted-foreground">
            Track vehicle maintenance and service history
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-gradient-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Add Service Record
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? 'Edit Service Record' : 'Add New Service Record'}
              </DialogTitle>
              <DialogDescription>
                {editingRecord ? 'Update service record information' : 'Create a new vehicle service record'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Vehicle Model</Label>
                  <Input
                    id="vehicleModel"
                    value={serviceForm.vehicleModel}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, vehicleModel: e.target.value }))}
                    placeholder="Skoda Octavia"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    value={serviceForm.licensePlate}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, licensePlate: e.target.value }))}
                    placeholder="SK-001-AB"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select
                    value={serviceForm.serviceType}
                    onValueChange={(value: ServiceRecord['serviceType']) => 
                      setServiceForm(prev => ({ ...prev, serviceType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine Maintenance</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={serviceForm.priority}
                    onValueChange={(value: ServiceRecord['priority']) => 
                      setServiceForm(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Service Description</Label>
                <Input
                  id="description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Oil change and filter replacement"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceDate">Service Date</Label>
                  <Input
                    id="serviceDate"
                    type="date"
                    value={serviceForm.serviceDate}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, serviceDate: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nextServiceDate">Next Service Date</Label>
                  <Input
                    id="nextServiceDate"
                    type="date"
                    value={serviceForm.nextServiceDate}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, nextServiceDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={serviceForm.cost}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                    placeholder="150"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mileageAtService">Mileage at Service</Label>
                  <Input
                    id="mileageAtService"
                    type="number"
                    value={serviceForm.mileageAtService}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, mileageAtService: parseInt(e.target.value) || 0 }))}
                    placeholder="45000"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technician">Technician</Label>
                  <Input
                    id="technician"
                    value={serviceForm.technician}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, technician: e.target.value }))}
                    placeholder="John Mechanic"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Service Location</Label>
                  <Input
                    id="location"
                    value={serviceForm.location}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Service Center A"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={serviceForm.status}
                  onValueChange={(value: ServiceRecord['status']) => 
                    setServiceForm(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={serviceForm.notes || ''}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about the service..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-gradient-primary hover:bg-primary-hover">
                  {loading ? 'Saving...' : editingRecord ? 'Update Record' : 'Create Record'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Service Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Services"
          value={serviceStats.total}
          description="All service records"
          icon={Wrench}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Scheduled"
          value={serviceStats.scheduled}
          description="Upcoming services"
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="In Progress"
          value={serviceStats.inProgress}
          description="Currently servicing"
          icon={AlertTriangle}
        />
        <StatCard
          title="Total Cost"
          value={`$${serviceStats.totalCost.toLocaleString()}`}
          description="Service expenses"
          icon={CheckCircle}
          trend={{ value: 15, isPositive: false }}
        />
      </div>

      {/* Filters and Search */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter & Search Records</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by vehicle, license plate, description, or technician..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Service Records Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Service History</CardTitle>
          <CardDescription>
            Showing {filteredRecords.length} of {serviceRecords.length} service records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{record.vehicleModel}</div>
                        <div className="text-sm text-muted-foreground">{record.licensePlate}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getServiceTypeBadge(record.serviceType)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{record.description}</div>
                        <div className="text-sm text-muted-foreground">
                          By {record.technician} at {record.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{record.serviceDate}</div>
                        <div className="text-sm text-muted-foreground">
                          {record.mileageAtService.toLocaleString()} km
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${record.cost}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{getPriorityBadge(record.priority)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(record)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}