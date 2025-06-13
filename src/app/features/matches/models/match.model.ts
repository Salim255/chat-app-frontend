import { SexOrientation } from "../../account/components/dating-profile/edit-profile/edit-sex-orientation/edit-sex.component";
import { Gender } from "../../auth/components/create-profile/create-profile.component";
import { LookingFor } from "../../profile-viewer/profile-viewer.page";


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
    public looking_for: LookingFor[],
    public sexual_orientation: SexOrientation,
    public height: number,
    public children: boolean,
    public max_distance_km: number,
    public latitude: number,
    public longitude: number,
    public education: string,
    public gender: Gender,
    public languages: string [],
    public match_status: number,
    public match_created_at: Date,
    public match_updated_at: Date,
  ){}
}














