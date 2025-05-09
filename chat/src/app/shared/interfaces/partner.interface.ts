export type Partner = {
  partner_id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  avatar: string;
  connection_status: string;
  images: string[];
  public_key: string;
};
