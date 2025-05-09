import { Gender, InterestedIn } from "../complete-profile.page";

export class Profile {
  constructor(
    private id: number,
    public first_name: string,
    public last_name: string,
    public avatar: string,
    public age: number,
    public gender: Gender,
    public country: string,
    public city: string,
    public interested_in: InterestedIn,
  ) {}
}
