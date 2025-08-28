import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface TrainingSchedule {
  id: string;
  vehicleId: string;
  trainerId: string;
  trainingType: string;
  startDate: string;
  endDate: string;
  days: string[];
  status: 'Active' | 'Completed' | 'Cancelled';
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

// Mock training schedules data
const mockSchedules: TrainingSchedule[] = [
  {
    id: "schedule_001",
    vehicleId: "vehicle_001",
    trainerId: "trainer_006",
    trainingType: "Technology",
    startDate: "2024-01-08",
    endDate: "2024-01-12",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    status: "Completed",
    remarks: "",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "schedule_002",
    vehicleId: "vehicle_001",
    trainerId: "trainer_003",
    trainingType: "Advance Transmission",
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    status: "Completed",
    remarks: "",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "schedule_003",
    vehicleId: "vehicle_002",
    trainerId: "trainer_005",
    trainingType: "Diagnostics",
    startDate: "2024-08-28",
    endDate: "2024-09-01",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    status: "Active",
    remarks: "",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "schedule_004",
    vehicleId: "vehicle_002",
    trainerId: "trainer_005",
    trainingType: "HVAC & Convenience",
    startDate: "2024-09-02",
    endDate: "2024-09-06",
    days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    status: "Active",
    remarks: "",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "schedule_005",
    vehicleId: "vehicle_003",
    trainerId: "trainer_003",
    trainingType: "Advance Transmission",
    startDate: "2024-09-09",
    endDate: "2024-09-13",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    status: "Active",
    remarks: "",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

export function useTrainingSchedules() {
  const [schedules, setSchedules] = useState<TrainingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setSchedules(mockSchedules);
      setError(null);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
      toast({
        title: "Error",
        description: "Failed to load training schedules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addSchedule = async (scheduleData: Omit<TrainingSchedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSchedule: TrainingSchedule = {
        ...scheduleData,
        id: `schedule_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSchedules(prev => [...prev, newSchedule]);
      toast({
        title: "Success",
        description: "Training schedule created successfully",
      });

      return newSchedule;
    } catch (err) {
      console.error('Error adding schedule:', err);
      toast({
        title: "Error",
        description: "Failed to create training schedule",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateSchedule = async (id: string, updates: Partial<Omit<TrainingSchedule, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === id 
          ? { ...schedule, ...updates, updatedAt: new Date().toISOString() }
          : schedule
      ));

      toast({
        title: "Success",
        description: "Training schedule updated successfully",
      });
    } catch (err) {
      console.error('Error updating schedule:', err);
      toast({
        title: "Error",
        description: "Failed to update training schedule",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
      toast({
        title: "Success",
        description: "Training schedule deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting schedule:', err);
      toast({
        title: "Error",
        description: "Failed to delete training schedule",
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
  };
}