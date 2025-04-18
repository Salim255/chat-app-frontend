export class Account {
  constructor(
    private userId: number,
    public firstName: string,
    public lastName: string,
    private email: string,
    public avatar: string,
    private isStaff: boolean,
    private isActive: boolean,
    public images: string[]
  ) {}
}
