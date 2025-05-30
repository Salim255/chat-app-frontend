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
    public education: string,
    public height: number,
    public children: boolean,
    public photos: string[],
    public created_at: Date,
    public updated_at: Date,
  ) {}
}
