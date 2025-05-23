import { RequestStatus } from "../../active-conversation/services/active-conversation-http.service";
import { LookingFor } from "../../profile-viewer/components/looking-for/looking-for.component";
import { Conversation } from "../models/conversation.model";

export type UserInChatDto = {
  user_id: number;
  photos: string[];
  name: string;
  bio: string;
  looking_for: LookingFor;
  connection_status: string;
  is_admin: boolean;
  birth_date: Date;
  city: string;
  country: string;
  public_key: string | null;

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

export type FetchedConversationsResponse = {
  status: string;
  data: {
    chats: Conversation[]
  }
 }

 export type ConversationResponse = {
   status: RequestStatus;
   data: { chat: Conversation };
 }
