export interface CustomerProps{
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  responsavel: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}
