import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Booking {
  id: string;
  vehicleId: string;
  trainerId: string;
  trainerName: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'cancelled';
  urgency: 'normal' | 'high';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: 'booking_001',
    vehicleId: 'vehicle_001',
    trainerId: '2',
    trainerName: 'Sarah Trainer',
    startDate: '2025-01-08T09:00:00Z',
    endDate: '2025-01-08T17:00:00Z',
    purpose: 'DSG Transmission Training',
    status: 'active',
    urgency: 'normal',
    notes: 'Focus on DQ200 dual clutch system',
    createdAt: '2025-01-07T10:00:00Z',
    updatedAt: '2025-01-07T10:00:00Z'
  },
  {
    id: 'booking_002',
    vehicleId: 'vehicle_002',
    trainerId: '2',
    trainerName: 'Sarah Trainer',
    startDate: '2025-01-09T14:00:00Z',
    endDate: '2025-01-09T18:00:00Z',
    purpose: 'Advanced TDI Engine Diagnostics',
    status: 'approved',
    urgency: 'high',
    notes: 'Training session for new diagnostic procedures',
    createdAt: '2025-01-06T15:30:00Z',
    updatedAt: '2025-01-07T09:15:00Z'
  },
  {
    id: 'booking_003',
    vehicleId: 'vehicle_003',
    trainerId: '2',
    trainerName: 'Sarah Trainer',
    startDate: '2025-01-10T10:00:00Z',
    endDate: '2025-01-10T16:00:00Z',
    purpose: 'Tiguan AllSpace Feature Training',
    status: 'pending',
    urgency: 'normal',
    notes: 'Complete vehicle systems overview',
    createdAt: '2025-01-05T11:00:00Z',
    updatedAt: '2025-01-05T11:00:00Z'
  },
  {
    id: 'booking_004',
    vehicleId: 'vehicle_005',
    trainerId: '2',
    trainerName: 'Sarah Trainer',
    startDate: '2025-01-04T09:00:00Z',
    endDate: '2025-01-04T17:00:00Z',
    purpose: 'Taigun Technology Workshop',
    status: 'completed',
    urgency: 'normal',
    notes: 'Successfully completed all training modules',
    createdAt: '2025-01-03T14:00:00Z',
    updatedAt: '2025-01-04T17:30:00Z'
  },
  {
    id: 'booking_005',
    vehicleId: 'vehicle_001',
    trainerId: '2',
    trainerName: 'Sarah Trainer',
    startDate: '2025-01-12T08:00:00Z',
    endDate: '2025-01-12T12:00:00Z',
    purpose: 'Emergency Brake System Testing',
    status: 'active',
    urgency: 'high',
    notes: 'Critical safety system validation required',
    createdAt: '2025-01-06T16:45:00Z',
    updatedAt: '2025-01-08T08:00:00Z'
  }
];

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setBookings(mockBookings);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newBooking: Booking = {
        ...bookingData,
        id: `booking_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setBookings(prev => [...prev, newBooking]);
      toast({
        title: "Success",
        description: "Booking created successfully",
      });

      return newBooking;
    } catch (err) {
      console.error('Error creating booking:', err);
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status'], notes?: string) => {
    try {
      setBookings(prev => prev.map(booking => 
        booking.id === id 
          ? { 
              ...booking, 
              status, 
              ...(notes && { notes }),
              updatedAt: new Date().toISOString() 
            }
          : booking
      ));

      toast({
        title: "Success",
        description: `Booking ${status} successfully`,
      });
    } catch (err) {
      console.error('Error updating booking:', err);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      setBookings(prev => prev.filter(booking => booking.id !== id));
      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      });
    } catch (err) {
      console.error('Error deleting booking:', err);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBookingStatus,
    deleteBooking,
  };
}