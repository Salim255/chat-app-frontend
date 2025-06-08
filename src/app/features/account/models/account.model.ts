import { LookingFor } from "../../profile-viewer/components/looking-for/looking-for.component";

export class Account {
  constructor(
    public id: number,
    public user_id: number,
    public name: string,
    public avatar: null,
    public birth_date: Date,
    public gender:  string,
    public country: string,
    public city: string,
    public interested_in: string,
    public latitude: number,
    public longitude: number,
    public bio: string,
    public min_age: number,
    public max_age: number,
    public education: string,
    public height: number,
    public children: boolean,
    public looking_for: LookingFor [],
    public photos: string[],
    public created_at: Date,
    public updated_at: Date,
  ) {}
}
