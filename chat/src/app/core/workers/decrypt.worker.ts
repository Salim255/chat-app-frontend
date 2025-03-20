import { Conversation } from "src/app/features/active-conversation/models/active-conversation.model";
import { MessageDecryptionData, MessageEncryptDecrypt } from "../services/encryption/message-encrypt-decrypt-";
import { Message } from "src/app/features/active-conversation/interfaces/message.interface";


//import { DecryptionActionType } from "src/app/features/conversations/services/conversations.service";

/// <reference lib="webworker" />

export type ReceivedMessage = Message & { encrypted_session_base64: string };

export enum DecryptionActionType {
  decryptConversations = 'decrypt-conversations' ,
  decryptedConversations = 'decrypted-conversations',
  decryptSingleMessage = 'decrypt-single-message',
  decryptedSingleMessage = 'decrypted-single-message'
};

type DecryptConversationsParams = {
  conversations: Conversation[];
  receiverPrivateKeyBase64: string;
  decryptionEmail: string;
};

export type DecryptSingleMessageParams = Omit<DecryptConversationsParams, 'conversations'> & {
  messageToDecrypt: Message & { encrypted_session_base64: string };
};

addEventListener('message', async ({ data }) => {
  try {

    if (!data || !Object.values(DecryptionActionType).includes(data.action))  {
      postMessage({ error: "Invalid action or missing data" });
      return;
    }

    switch (data.action) {
      case DecryptionActionType.decryptConversations:
        const decryptData : DecryptConversationsParams = {
          conversations: data.conversations,
          receiverPrivateKeyBase64: data.privateKey,
          decryptionEmail: data?.email
        }
        const decryptedConversations = await decryptConversations(decryptData);
        postMessage({ action: 'decrypted-conversations', conversations: decryptedConversations });
        break;

      default:
        postMessage({ error: "Invalid action" });
    }

  } catch (error) {
    postMessage({ error });
  }
});

// Decrypt messages in each conversation asynchronously
async function decryptConversations(data:  DecryptConversationsParams) {
  console.log(data, "hello")
  const decryptedConversations = await Promise.all(
    data.conversations.map(async (conversation: Conversation) => {

      if (!conversation.messages ) return conversation; // Skip if no messages
      //console.log(conversation, "hello conve")
      const decryptedMessages = await Promise.all(
        conversation.messages.map(async (msg) => {

          if (!conversation.encrypted_session_base64) {
            throw new Error('Something wrong')
          }
          try {
            const decryptionData: MessageDecryptionData = {
              encryptedMessageBase64: msg.content,
              encryptedSessionKeyBase64: conversation.encrypted_session_base64, // Session key
              receiverPrivateKeyBase64: data.receiverPrivateKeyBase64, // Private key
              receiverEmail: data.decryptionEmail}
            const decryptedContent = await MessageEncryptDecrypt.decryptMessage(decryptionData);

            return { ...msg, content: decryptedContent }; // Return decrypted message
          } catch (error) {
            console.error("Decryption error for message:", msg.id, error);
            return { ...msg, content: "Error decrypting message" }; // Handle errors gracefully
          }
        })
      );

      return { ...conversation, messages: decryptedMessages };
    })
  );
  return decryptedConversations;
}

