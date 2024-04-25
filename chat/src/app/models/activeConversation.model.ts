export class ActiveConversation {
  constructor(
    private id: number,
    private created_at: string,
    private updated_at: string,
    private messages: any [],
    private users: any []
  ){}

}
