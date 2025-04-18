import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { MessageEncryptDecrypt } from '../services/encryption/message-encrypt-decrypt-';
import { Message } from 'src/app/features/active-conversation/interfaces/message.interface';

//import { DecryptionActionType } from "src/app/features/conversations/services/conversations.service";

/// <reference lib="webworker" />

export type ReceivedMessage = Message & { encrypted_session_base64: string };

export enum DecryptionActionType {
  decryptConversations = 'decrypt-conversations',
  decryptedConversations = 'decrypted-conversations',
  decryptSingleMessage = 'decrypt-single-message',
  decryptedSingleMessage = 'decrypted-single-message',
}

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
    if (!data || !Object.values(DecryptionActionType).includes(data.action)) {
      postMessage({ error: 'Invalid action or missing data' });
      return;
    }
    console.log(data, 'hello data from worker');
    switch (data.action) {
      case DecryptionActionType.decryptConversations:
        const decryptData: DecryptConversationsParams = {
          conversations: data.conversations,
          receiverPrivateKeyBase64: data.privateKey,
          decryptionEmail: data?.email,
        };
        const decryptedConversations = await decryptConversations(decryptData);

        postMessage({ action: 'decrypted-conversations', conversations: decryptedConversations });
        close();
        break;

      default:
        postMessage({ error: 'Invalid action' });
        close();
    }
  } catch (error) {
    console.log(error, 'hello eroore');
    postMessage({ error });
    close();
  }
});

// Decrypt messages in each conversation asynchronously
async function decryptConversations(data: DecryptConversationsParams) {
  const decryptedConversations = [];
  console.log('Hello from decrypting...');
  for (const conversation of data.conversations) {
    if (!conversation.messages) {
      decryptedConversations.push(conversation);
      continue;
    }

    if (!conversation.encrypted_session_base64) {
      throw new Error('Something wrong');
    }

    // Precompute decryption session
    const decryptionDataBase = {
      encryptedSessionKeyBase64: conversation.encrypted_session_base64,
      receiverPrivateKeyBase64: data.receiverPrivateKeyBase64,
      receiverEmail: data.decryptionEmail,
    };

    // Decrypt all messages in a single pass //
    const decryptedMessages = await Promise.all(
      conversation.messages.map(async (msg) => {
        try {
          const decryptedContent = await MessageEncryptDecrypt.decryptMessage({
            ...decryptionDataBase,
            encryptedMessageBase64: msg.content,
          });

          return { ...msg, content: decryptedContent };
        } catch (error) {
          console.error('Decryption error for message:', msg.id, error);
          return { ...msg, content: 'Error decrypting message' };
        }
      })
    );

    decryptedConversations.push({ ...conversation, messages: decryptedMessages });
  }
  console.log('Well, decrypted 😍😍😍😍', decryptedConversations);
  return decryptedConversations;
}
