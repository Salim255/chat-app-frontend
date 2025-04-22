export class Message {
  constructor(
    public id: number,
    public content: string,
    public from_user_id: number,
    public to_user_id: number,
    public chat_id: number,
    public status: string,
    public created_at: string,
    public updated_at: string,
  ){}
}
