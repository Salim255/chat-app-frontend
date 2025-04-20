export type UserInChatDto = {
  user_id: number;
  avatar: string | null;
  last_name: string;
  first_name: string;
  connection_status: string;
  is_admin: boolean;
}

export type  LastMessageDto = MessageDto;

export type MessageDto = {
  id: number;
  created_at: string;
  updated_at: string;
  content: string;
  from_user_id: number;
  to_user_id: number;
  status: string;
  chat_id: number;
}
