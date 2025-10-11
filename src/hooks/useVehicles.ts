import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Vehicle {
  id: string;
  location: string;
  brand: string;
  model: string;
  fullName: string;
  regNo: string;
  vinNo: string;
  fuelType: string;
  engine: string;
  gearbox: string;
  modelYear: number;
  insuranceValidDate: string;
  insuranceStatus: 'Valid' | 'Expired';
  pucValidDate: string | null;
  pucStatus: 'Valid' | 'Expired' | 'NA';
  allocatedTrainer: string;
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Decommissioned';
  costIncurred: number;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data based on VGA Training Cars
const mockVehicles: Vehicle[] = [
  {
    id: "vehicle_001",
    location: "Pune",
    brand: "VW",
    model: "Vento",
    fullName: "POLO A05 1.5 HIGHL 77 TDI D7F",
    regNo: "MH14EY0185",
    vinNo: "MEXD1560XFT089626",
    fuelType: "TDI",
    engine: "TDI 1,5",
    gearbox: "DQ200-7F",
    modelYear: 2015,
    insuranceValidDate: "2026-06-30",
    insuranceStatus: "Valid",
    pucValidDate: "2025-09-15",
    pucStatus: "Valid",
    allocatedTrainer: "Mahesh Deshmukh",
    status: "Active",
    costIncurred: 0,
    remarks: "",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "vehicle_002",
    location: "Pune",
    brand: "VW",
    model: "Passat",
    fullName: "PASSAT Sed. HL 130 TDID6F",
    regNo: "MH14GN0436",
    vinNo: "WVWK163CZHA000013",
    fuelType: "TDI",
    engine: "TDI 2,0",
    gearbox: "DQ250-6F",
    modelYear: 2017,
    insuranceValidDate: "2026-06-30",
    insuranceStatus: "Valid",
    pucValidDate: "2025-09-23",
    pucStatus: "Valid",
    allocatedTrainer: "Ranjeet Thorat",
    status: "Active",
    costIncurred: 0,
    remarks: "",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "vehicle_003",
    location: "Pune",
    brand: "VW",
    model: "Tiguan AllSpace",
    fullName: "Tiguan L 2.0 HL GT140TSI D7A",
    regNo: "MH14JH4308",
    vinNo: "WVGZZZ5NZLM088776",
    fuelType: "TFSI",
    engine: "TFSI 2,0",
    gearbox: "DQ381-7A",
    modelYear: 2020,
    insuranceValidDate: "2025-12-09",
    insuranceStatus: "Valid",
    pucValidDate: "2025-09-15",
    pucStatus: "Valid",
    allocatedTrainer: "Ranjeet Thorat",
    status: "Active",
    costIncurred: 7559.48,
    remarks: "Battery required. Under process",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "vehicle_004",
    location: "Pune",
    brand: "VW",
    model: "T Roc",
    fullName: "T-ROC 1.5 GT110 TSID7F",
    regNo: "MH14JH4307",
    vinNo: "WVGZZZA1ZLV079005",
    fuelType: "TSI ACT",
    engine: "TSI ACT 1,5",
    gearbox: "DQ200-7F",
    modelYear: 2020,
    insuranceValidDate: "2025-12-09",
    insuranceStatus: "Valid",
    pucValidDate: "2025-04-21",
    pucStatus: "Expired",
    allocatedTrainer: "Ranjeet Thorat",
    status: "Maintenance",
    costIncurred: 0,
    remarks: "Mechatronics replacement required - vehicle not moving",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "vehicle_005",
    location: "Pune",
    brand: "VW",
    model: "Taigun",
    fullName: "TAIGUN GT PLUS 1.5L TSI 110kW DSG",
    regNo: "MH14JU1691",
    vinNo: "MEXH21CW9NT000126",
    fuelType: "TSI ACT",
    engine: "TSI ACT 1,5",
    gearbox: "DQ200-7F",
    modelYear: 2022,
    insuranceValidDate: "2025-10-09",
    insuranceStatus: "Valid",
    pucValidDate: "2025-09-15",
    pucStatus: "Valid",
    allocatedTrainer: "Ranjeet Thorat",
    status: "Active",
    costIncurred: 0,
    remarks: "",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
  // ... continue with more vehicles as needed
];

export function useVehicles(filterLocation?: string) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter vehicles by location if provided
      const filteredVehicles = filterLocation 
        ? mockVehicles.filter(v => v.location === filterLocation)
        : mockVehicles;
      
      setVehicles(filteredVehicles);
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newVehicle: Vehicle = {
        ...vehicleData,
        id: `vehicle_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setVehicles(prev => [...prev, newVehicle]);
      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });

      return newVehicle;
    } catch (err) {
      console.error('Error adding vehicle:', err);
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === id 
          ? { ...vehicle, ...updates, updatedAt: new Date().toISOString() }
          : vehicle
      ));

      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });
    } catch (err) {
      console.error('Error updating vehicle:', err);
      toast({
        title: "Error",
        description: "Failed to update vehicle",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [filterLocation]);

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
}