export type Member =  {
  id: number;
  created_at: Date;
  updated_at: Date;
  first_name: string;
  last_name: string;
  avatar: string;
  connection_status: string,
  is_staff: boolean;
  images: string []
}
