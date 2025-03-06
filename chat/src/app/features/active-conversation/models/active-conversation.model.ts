import { Member } from "src/app/shared/interfaces/member.interface";
import { Message } from "../interfaces/message.interface";



export class Conversation {
  constructor(
    public id: number | null,
    public created_at: string | null,
    public updated_at: string | null,
    public last_message:  Message | null,
    public last_message_id: number | null,
    public no_read_messages: number | null,
    public messages: Message [] | null,
    public users: Member [] | null
  ){}

}
