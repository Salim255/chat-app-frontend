import { Conversation } from "src/app/features/active-conversation/models/active-conversation.model";
import { MessageEncryptDecrypt } from "../services/encryption/message-encrypt-decrypt-";
/// <reference lib="webworker" />


addEventListener('message', async ({ data }) => {

  try {
    if (!data || data.action !== 'decrypt') {
      postMessage({ error: "Invalid action or missing data" });
      return;
    }

    let conversations = data.conversations; // Array of Conversation objects
    let receiverPrivateKeyBase64 = data.privateKey; // User's private key
    let decryptionEmail = data.email; // Optional

    if (!decryptionEmail || !receiverPrivateKeyBase64) {
      postMessage({ error: "Invalid data: Missing conversations or private key" });
      return;
    }

    // Decrypt messages in each conversation asynchronously
    const decryptedConversations = await Promise.all(
      conversations.map(async (conversation: Conversation) => {

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
                receiverPrivateKeyBase64, // Private key
                decryptionEmail
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

    postMessage({ action: 'decrypted', conversations: decryptedConversations });

  } catch (error) {
    postMessage({ error });
  }
});
