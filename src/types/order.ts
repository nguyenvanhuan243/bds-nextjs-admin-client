export interface Order {
  id: number;
  order_status: string | null;
  order_link: string | null;
  phone_number: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_id: number | null;
  fullname: string;
  address: string | null;
} 