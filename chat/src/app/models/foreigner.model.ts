export class Foreigner {
  constructor (
    public id: number,
    private created_at: Date,
    private updated_at: Date,
    public first_name: string,
    public last_name: string,
    public avatar: string,
    private is_staff: boolean,
    public images: string []
  ) {}

}
