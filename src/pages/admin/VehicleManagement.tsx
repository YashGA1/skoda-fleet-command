import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Search, Filter, CheckCircle, Clock, AlertTriangle, Calendar, Plus } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import { StatCard } from '@/components/dashboard/StatCard';

export function VehicleManagement() {
  const { vehicles, loading, updateVehicle } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const stats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === "Active").length,
    maintenance: vehicles.filter(v => v.status === "Maintenance").length,
    inactive: vehicles.filter(v => v.status === "Inactive").length,
    decommissioned: vehicles.filter(v => v.status === "Decommissioned").length,
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vinNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = brandFilter === 'all' || vehicle.brand === brandFilter;
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || vehicle.location === locationFilter;
    
    return matchesSearch && matchesBrand && matchesStatus && matchesLocation;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Maintenance":
        return "secondary";
      case "Inactive":
        return "destructive";
      case "Decommissioned":
        return "outline";
      default:
        return "default";
    }
  };

  const getComplianceBadge = (date: string | null, label: string) => {
    if (!date) return <Badge variant="outline">N/A</Badge>;
    
    const dateObj = new Date(date);
    const today = new Date();
    const diffTime = dateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (diffDays <= 30) {
      return <Badge className="bg-orange-100 text-orange-800">Expiring Soon</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
    }
  };

  const uniqueBrands = [...new Set(vehicles.map(v => v.brand))];
  const uniqueLocations = [...new Set(vehicles.map(v => v.location))];

  if (loading) {
    return <div className="flex justify-center py-8">Loading vehicles...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Management</h1>
          <p className="text-muted-foreground">
            Manage your VGA training fleet and track compliance
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Car className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Vehicles"
          value={stats.total}
          icon={Car}
          description="All vehicles in fleet"
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={CheckCircle}
          description="Currently active"
        />
        <StatCard
          title="Maintenance"
          value={stats.maintenance}
          icon={Clock}
          description="Under maintenance"
        />
        <StatCard
          title="Inactive"
          value={stats.inactive}
          icon={AlertTriangle}
          description="Currently inactive"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {uniqueBrands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Decommissioned">Decommissioned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Vehicles</CardTitle>
          <CardDescription>
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Engine/Fuel</TableHead>
                  <TableHead>Insurance</TableHead>
                  <TableHead>PUC</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                      <div className="text-sm text-muted-foreground">{vehicle.modelYear}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{vehicle.fullName}</div>
                        <div className="text-muted-foreground">{vehicle.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{vehicle.regNo}</div>
                      <div className="text-sm text-muted-foreground">{vehicle.vinNo}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(vehicle.status) as any}>
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{vehicle.fuelType}</div>
                        <div className="text-muted-foreground">{vehicle.engine}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getComplianceBadge(vehicle.insuranceValidDate, "Insurance")}
                      <div className="text-xs text-muted-foreground mt-1">
                        {vehicle.insuranceValidDate ? new Date(vehicle.insuranceValidDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getComplianceBadge(vehicle.pucValidDate, "PUC")}
                      <div className="text-xs text-muted-foreground mt-1">
                        {vehicle.pucValidDate ? new Date(vehicle.pucValidDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {vehicle.allocatedTrainer || 'Unassigned'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={vehicle.status}
                        onValueChange={(value: "Active" | "Inactive" | "Maintenance") => updateVehicle(vehicle.id, { status: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
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