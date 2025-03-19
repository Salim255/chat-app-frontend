import { Conversation } from "src/app/features/active-conversation/models/active-conversation.model";
import { MessageEncryptDecrypt } from "../services/encryption/message-encrypt-decrypt-";
/// <reference lib="webworker" />

type DecryptConversationsParams = {
  conversations: Conversation[];
  receiverPrivateKeyBase64: string;
  decryptionEmail: string;
};

addEventListener('message', async ({ data }) => {
  try {

    if (!data || data.action !== 'decrypt-conversations') {
      postMessage({ error: "Invalid action or missing data" });
      return;
    }

    switch (data.action) {
      case 'decrypt-conversations':
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

            const decryptedContent = await MessageEncryptDecrypt.decryptMessage(
              msg.content,
              conversation.encrypted_session_base64, // Session key
              data.receiverPrivateKeyBase64, // Private key
              data.decryptionEmail
            );
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
