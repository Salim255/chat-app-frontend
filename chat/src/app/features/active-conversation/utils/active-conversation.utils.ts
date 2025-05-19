import {
  AuthData,
  ConversationDto,
  EncryptedMessageData,
 } from '../services/active-conversation.service';
import { MessageEncryptionData } from 'src/app/core/services/encryption/message-encrypt-decrypt';
import { Conversation } from '../../conversations/models/conversation.model';
import { CreateMessageDto } from '../active-conversation.page';
import { Message } from '../../messages/model/message.model';
import { CreateConversationPost } from '../services/active-conversation-http.service';
import { UserInChatDto } from '../../conversations/interfaces/conversations.dto';

export function buildMessageEncryptionData(
  content: string,
  authData: AuthData,
  partner:  UserInChatDto | null,
  activeConversation: Conversation | null,
): MessageEncryptionData {
  return {
    messageText: content,
    senderPublicKeyBase64: authData._publicKey,
    encryptedSessionKey: activeConversation?.encrypted_session_base64 ?? null,
    receiverPublicKeyBase64: partner?.public_key ?? null,
    senderPrivateKeyBase64: authData._privateKey,
    senderEmail: authData._email,
  };
}

export function builtEncryptedMessageData(
    encryptedData: EncryptedMessageData,
    authData: AuthData,
    partner: UserInChatDto | null,
  ):CreateConversationPost | null{
    const {
      encryptedMessageBase64,
      encryptedSessionKeyForSenderBase64,
      encryptedSessionKeyForReceiverBase64,
    } = encryptedData;

    if(
      !encryptedSessionKeyForSenderBase64
      || !encryptedSessionKeyForReceiverBase64
      || !partner
    ) return null;

    const payload =  {
      content: encryptedMessageBase64,
      from_user_id: Number(authData.id),
      to_user_id: Number(partner.user_id),
      partner_connection_status: partner.connection_status,
      session_key_sender: encryptedSessionKeyForSenderBase64,
      session_key_receiver: encryptedSessionKeyForReceiverBase64
     }
    return payload;
  }

export function  processConversationResponse(
   response: ConversationDto,
   originalMessage: string,
  ): Conversation {
    const chat = response.data.chat;
    chat.messages[0].content =  originalMessage;
    return chat;
  }

  export function prepareEncryptedMessagePayload(
    original: CreateMessageDto,
    encryptedContent: string
  ): CreateMessageDto {
    return { ...original, content: encryptedContent };
  }

  export function restoreOriginalMessageContent(
    message: Message,
    originalContent: string
  ): Message {
    return { ...message, content: originalContent };
  }

