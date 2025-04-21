export class Match {
  constructor(
    public partner_id: number,
    public first_name: string,
    public last_name: string,
    public avatar: string | null,
    public connection_status: "online" | "offline" | "away",
    public public_key: string,
    public match_id: number,
    public match_status: number,
    public match_created_at: Date,
    public match_updated_at: Date,
  ){}
}
