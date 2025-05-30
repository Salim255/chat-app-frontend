import { LookingFor } from "../../profile-viewer/components/looking-for/looking-for.component";

export class Profile {
  constructor(
    public user_id: number,
    public profile_id : number,
    public match_id: number,
    public name: string,
    public bio: string,
    public looking_for: LookingFor,
    public birth_date: Date,
    public city: string,
    public country: string,
    public avatar: string,
    public photos: string [],
    public connection_status: string,
    public match_status: number,
  ){}
}
