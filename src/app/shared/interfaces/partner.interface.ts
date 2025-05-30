export type Partner = {
  partner_id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  connection_status: string;
  photos: string[];
  public_key: string;
};
