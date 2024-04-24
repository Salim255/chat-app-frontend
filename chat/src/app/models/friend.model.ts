export class Friend {
  constructor(
    public id: number,
    private created_at: Date,
    private updated_at: Date,
    public first_name: string,
    public last_name: string,
    private email: string,
    private avatar: string,
    private is_staff: boolean,
    private is_active: boolean
  ){}

}
