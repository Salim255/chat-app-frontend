import { SexOrientation } from "../../account/components/dating-profile/edit-profile/edit-sex-orientation/edit-sex.component";
import { LookingFor } from "../../profile-viewer/profile-viewer.page";


export class Profile {
  constructor(
    public user_id: number,
    public profile_id : number,
    public match_id: number,
    public name: string,
    public photos: string [],
    public bio: string,
    public looking_for: LookingFor [],
    public birth_date: Date,
    public city: string,
    public country: string,
    public sexual_orientation: SexOrientation,
    public height: number,
    public children: boolean,
    public latitude: number,
    public longitude: number,
    public education: string,
    public connection_status: string,
    public match_status: number,
    public languages: string [],
  ){}
}

