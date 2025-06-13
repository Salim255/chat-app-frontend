import { SexOrientation } from "../../account/components/dating-profile/edit-profile/edit-sex-orientation/edit-sex.component";
import { RequestStatus } from "../../active-conversation/services/active-conversation-http.service";
import { LookingFor } from "../../profile-viewer/profile-viewer.page";
import { Conversation } from "../models/conversation.model";

export class UserInChatDto {
  constructor(
    public user_id: number,
    public photos: string[],
    public name: string,
    public bio: string,
    public looking_for: LookingFor[],
    public connection_status: string,
    public is_admin: boolean,
    public birth_date: Date,
    public city: string,
    public country: string,
    public sexual_orientation: SexOrientation,
    public height: number,
    public children: boolean,
    public latitude: number,
    public longitude: number,
    public education: string,
    public public_key: string | null,
    public languages: string [],
    public matched_at: Date | null,
  ){}
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
