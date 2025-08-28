// VGA Training Cars Database Schema
export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: VehicleRow;
        Insert: VehicleInsert;
        Update: VehicleUpdate;
      };
      trainers: {
        Row: TrainerRow;
        Insert: TrainerInsert;
        Update: TrainerUpdate;
      };
      training_schedules: {
        Row: TrainingScheduleRow;
        Insert: TrainingScheduleInsert;
        Update: TrainingScheduleUpdate;
      };
      training_requirements: {
        Row: TrainingRequirementRow;
        Insert: TrainingRequirementInsert;
        Update: TrainingRequirementUpdate;
      };
      parts_orders: {
        Row: PartsOrderRow;
        Insert: PartsOrderInsert;
        Update: PartsOrderUpdate;
      };
      locations: {
        Row: LocationRow;
        Insert: LocationInsert;
        Update: LocationUpdate;
      };
      brands: {
        Row: BrandRow;
        Insert: BrandInsert;
        Update: BrandUpdate;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Vehicle Types
export interface VehicleRow {
  id: string;
  location: string;
  brand: string;
  model: string;
  full_name: string;
  reg_no: string;
  vin_no: string;
  fuel_type: string;
  engine: string;
  gearbox: string;
  model_year: number;
  insurance_valid_date: string;
  insurance_status: 'Valid' | 'Expired';
  puc_valid_date: string | null;
  puc_status: 'Valid' | 'Expired' | 'NA';
  allocated_trainer: string;
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Decommissioned';
  cost_incurred: number;
  remarks: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleInsert {
  location: string;
  brand: string;
  model: string;
  full_name: string;
  reg_no: string;
  vin_no: string;
  fuel_type: string;
  engine: string;
  gearbox: string;
  model_year: number;
  insurance_valid_date: string;
  insurance_status: 'Valid' | 'Expired';
  puc_valid_date?: string | null;
  puc_status: 'Valid' | 'Expired' | 'NA';
  allocated_trainer: string;
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Decommissioned';
  cost_incurred?: number;
  remarks?: string;
}

export interface VehicleUpdate {
  location?: string;
  brand?: string;
  model?: string;
  full_name?: string;
  reg_no?: string;
  vin_no?: string;
  fuel_type?: string;
  engine?: string;
  gearbox?: string;
  model_year?: number;
  insurance_valid_date?: string;
  insurance_status?: 'Valid' | 'Expired';
  puc_valid_date?: string | null;
  puc_status?: 'Valid' | 'Expired' | 'NA';
  allocated_trainer?: string;
  status?: 'Active' | 'Inactive' | 'Maintenance' | 'Decommissioned';
  cost_incurred?: number;
  remarks?: string;
}

// Trainer Types
export interface TrainerRow {
  id: string;
  name: string;
  location: string;
  specializations: string[];
  created_at: string;
  updated_at: string;
}

export interface TrainerInsert {
  name: string;
  location: string;
  specializations: string[];
}

export interface TrainerUpdate {
  name?: string;
  location?: string;
  specializations?: string[];
}

// Training Schedule Types
export interface TrainingScheduleRow {
  id: string;
  vehicle_id: string;
  trainer_id: string;
  training_type: string;
  start_date: string;
  end_date: string;
  days: string[];
  status: 'Active' | 'Completed' | 'Cancelled';
  remarks: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingScheduleInsert {
  vehicle_id: string;
  trainer_id: string;
  training_type: string;
  start_date: string;
  end_date: string;
  days: string[];
  status: 'Active' | 'Completed' | 'Cancelled';
  remarks?: string;
}

export interface TrainingScheduleUpdate {
  vehicle_id?: string;
  trainer_id?: string;
  training_type?: string;
  start_date?: string;
  end_date?: string;
  days?: string[];
  status?: 'Active' | 'Completed' | 'Cancelled';
  remarks?: string;
}

// Training Requirements Types
export interface TrainingRequirementRow {
  id: string;
  brand: string;
  level: number;
  name: string;
  code: string;
  priority?: string;
  cars_required: number;
  mandatory: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainingRequirementInsert {
  brand: string;
  level: number;
  name: string;
  code: string;
  priority?: string;
  cars_required: number;
  mandatory: boolean;
}

export interface TrainingRequirementUpdate {
  brand?: string;
  level?: number;
  name?: string;
  code?: string;
  priority?: string;
  cars_required?: number;
  mandatory?: boolean;
}

// Parts Order Types
export interface PartsOrderRow {
  id: string;
  order_type: 'Technical' | 'Body';
  order_date: string;
  location: string;
  vehicle_id: string | null;
  part_name: string;
  quantity: number;
  part_cost: number;
  total_cost: number;
  status: 'Ordered' | 'Received' | 'Installed' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

export interface PartsOrderInsert {
  order_type: 'Technical' | 'Body';
  order_date: string;
  location: string;
  vehicle_id?: string | null;
  part_name: string;
  quantity: number;
  part_cost: number;
  total_cost: number;
  status: 'Ordered' | 'Received' | 'Installed' | 'Cancelled';
}

export interface PartsOrderUpdate {
  order_type?: 'Technical' | 'Body';
  order_date?: string;
  location?: string;
  vehicle_id?: string | null;
  part_name?: string;
  quantity?: number;
  part_cost?: number;
  total_cost?: number;
  status?: 'Ordered' | 'Received' | 'Installed' | 'Cancelled';
}

// Location Types
export interface LocationRow {
  id: string;
  name: string;
  full_name: string;
  address: string;
  country: string;
  contact_person: string;
  total_vehicles: number;
  total_trainers: number;
  created_at: string;
  updated_at: string;
}

export interface LocationInsert {
  name: string;
  full_name: string;
  address: string;
  country: string;
  contact_person: string;
  total_vehicles?: number;
  total_trainers?: number;
}

export interface LocationUpdate {
  name?: string;
  full_name?: string;
  address?: string;
  country?: string;
  contact_person?: string;
  total_vehicles?: number;
  total_trainers?: number;
}

// Brand Types
export interface BrandRow {
  id: string;
  name: string;
  full_name: string;
  parent_company: string;
  country: string;
  established: number;
  created_at: string;
  updated_at: string;
}

export interface BrandInsert {
  name: string;
  full_name: string;
  parent_company: string;
  country: string;
  established: number;
}

export interface BrandUpdate {
  name?: string;
  full_name?: string;
  parent_company?: string;
  country?: string;
  established?: number;
}