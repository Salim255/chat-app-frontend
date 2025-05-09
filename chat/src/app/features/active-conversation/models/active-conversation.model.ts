import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { Message } from '../../messages/model/message.model';

export class Conversation {
  constructor(
    public id: number | null,
    public created_at: string | null,
    public updated_at: string | null,
    public last_message: Message | null,
    public last_message_id: number | null,
    public no_read_messages: number | null,
    public messages: Message[] | null,
    public users: Partner[] | null,
    public encrypted_session_base64: string | null
  ) {}
}
