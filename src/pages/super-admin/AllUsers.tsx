import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatCard } from '@/components/dashboard/StatCard';
import { Users as UsersIcon, Search, Filter, UserCheck, Shield, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LOCATIONS } from '@/constants/locations';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'trainer' | 'security';
  status: 'active' | 'inactive' | 'suspended';
  department: string;
  location: string;
  joinDate: string;
  lastLogin: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'admin',
    status: 'active',
    department: 'Administration',
    location: 'PTC',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-15 09:30',
  },
  {
    id: '2',
    name: 'Sarah Thompson',
    email: 'sarah.thompson@company.com',
    role: 'trainer',
    status: 'active',
    department: 'Training',
    location: 'PTC',
    joinDate: '2023-03-20',
    lastLogin: '2024-01-15 14:22',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'trainer',
    status: 'active',
    department: 'Training',
    location: 'VGTAP',
    joinDate: '2023-02-10',
    lastLogin: '2024-01-14 16:45',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@company.com',
    role: 'trainer',
    status: 'active',
    department: 'Training',
    location: 'NCR',
    joinDate: '2023-06-01',
    lastLogin: '2024-01-10 11:15',
  },
  {
    id: '5',
    name: 'James Brown',
    email: 'james.brown@company.com',
    role: 'security',
    status: 'active',
    department: 'Security',
    location: 'PTC',
    joinDate: '2023-01-30',
    lastLogin: '2024-01-15 08:00',
  },
  {
    id: '6',
    name: 'Lisa Davis',
    email: 'lisa.davis@company.com',
    role: 'security',
    status: 'active',
    department: 'Security',
    location: 'BLR',
    joinDate: '2023-04-15',
    lastLogin: '2024-01-15 07:45',
  },
  {
    id: '7',
    name: 'Priya Admin',
    email: 'priya.admin@company.com',
    role: 'admin',
    status: 'active',
    department: 'Administration',
    location: 'VGTAP',
    joinDate: '2023-02-20',
    lastLogin: '2024-01-15 10:15',
  },
  {
    id: '8',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.com',
    role: 'admin',
    status: 'active',
    department: 'Administration',
    location: 'NCR',
    joinDate: '2023-03-10',
    lastLogin: '2024-01-15 11:30',
  }
];

export function AllUsers() {
  const [users] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || user.location === locationFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesLocation;
  });

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-primary text-primary-foreground">Admin</Badge>;
      case 'trainer':
        return <Badge variant="outline">Trainer</Badge>;
      case 'security':
        return <Badge className="bg-warning text-warning-foreground">Security</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">All Users - All Locations</h1>
        <p className="text-muted-foreground">
          View and manage users across all training centers
        </p>
      </div>

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={users.length}
          description="All registered users"
          icon={UsersIcon}
        />
        <StatCard
          title="Active Users"
          value={users.filter(u => u.status === 'active').length}
          description="Currently active"
          icon={UserCheck}
        />
        <StatCard
          title="Trainers"
          value={users.filter(u => u.role === 'trainer').length}
          description="Training staff"
          icon={UsersIcon}
        />
        <StatCard
          title="Administrators"
          value={users.filter(u => u.role === 'admin').length}
          description="Admin users"
          icon={Shield}
        />
      </div>

      {/* Filters and Search */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter & Search Users</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="trainer">Trainer</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {LOCATIONS.map(loc => (
                  <SelectItem key={loc.code} value={loc.code}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {users.length} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{user.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm">{user.joinDate}</TableCell>
                    <TableCell className="text-sm">{user.lastLogin}</TableCell>
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
