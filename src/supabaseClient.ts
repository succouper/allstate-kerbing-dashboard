import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Tender {
  id: number;
  name: string;
  location: string;
  builder: string;
  budget: string;
  budget_min: number;
  budget_max: number;
  distance: string;
  distance_km: number;
  category: string;
  closes: string;
  closes_sort: number;
  region: string;
  tender_site: string;
  tender_type: string;
  kerb_relevance: string;
  urgent: boolean;
  gc: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PipelineData {
  id?: string;
  tender_id: number;
  status: string;
  owner: string;
  deadline: string | null;
  notes: string;
  created_at?: string;
  updated_at?: string;
}
