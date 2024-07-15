export class Account {
  constructor(
    private userId: number,
    public firstName: string,
    public lastName: string,
    private email: string,
    private avatar: string,
    private isStaff: boolean,
    private isActive: boolean

  ){}

}
