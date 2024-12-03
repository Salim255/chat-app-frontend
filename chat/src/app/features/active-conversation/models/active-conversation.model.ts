export class Conversation {
  constructor(
    public id: number,
    public created_at: string,
    public updated_at: string,
    public messages: any [],
    public users: any []
  ){}

}
