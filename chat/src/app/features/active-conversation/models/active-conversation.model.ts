import { Message } from "../interfaces/message.interface";

export type User =  {
  avatar: string;
  user_id: number;
  last_name: string;
  first_name: string;
  connection_status: string;
}

export class Conversation {
  constructor(
    public id: number | null,
    public created_at: string | null,
    public updated_at: string | null,
    public messages: Message [] | null,
    public users: User [] | null
  ){}

}
