import { UserInChatDto, MessageDto } from "../interfaces/conversations.dto";
export class Conversation {
  constructor(
    public id: number,
    public type: string,
    public created_at: string,
    public updated_at: string,
    public no_read_messages: number,
    public encrypted_session_base64: string,
    public users: UserInChatDto[],
    public messages: MessageDto[]
  ){}
}
