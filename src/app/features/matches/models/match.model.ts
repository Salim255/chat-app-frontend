import { LookingFor } from "../../profile-viewer/components/looking-for/looking-for.component";

export class Match {
  constructor(
    public partner_id: number,
    public name: string,
    public country: string,
    public city: string,
    public connection_status: "online" | "offline" | "away",
    public public_key: string,
    public birth_date: Date,
    public match_id: number,
    public profile_id: number,
    public photos: string [],
    public bio: string,
    public looking_for: LookingFor,
    public match_status: number,
    public match_created_at: Date,
    public match_updated_at: Date,
  ){}
}














