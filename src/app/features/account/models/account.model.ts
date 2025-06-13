import { Gender, InterestedIn } from "../../auth/components/create-profile/create-profile.component";
import { LookingFor } from "../../profile-viewer/profile-viewer.page";
import { SexOrientation } from "../components/dating-profile/edit-profile/edit-sex-orientation/edit-sex.component";

export class Account {
  constructor(
    public id: number,
    public user_id: number,
    public name: string,
    public avatar: null,
    public birth_date: Date,
    public gender:  Gender,
    public country: string,
    public city: string,
    public interested_in: InterestedIn,
    public latitude: number,
    public longitude: number,
    public bio: string,
    public min_age: number,
    public max_age: number,
    public education: string,
    public height: number,
    public children: boolean,
    public looking_for: LookingFor [],
    public sexual_orientation: SexOrientation,
    public max_distance_km: number,
    public photos: string[],
    public created_at: Date,
    public updated_at: Date,
  ) {}
}
