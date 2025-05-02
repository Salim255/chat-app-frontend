import { Conversation } from 'src/app/features/active-conversation/models/active-conversation.model';
import { MessageEncryptDecrypt } from '../services/encryption/message-encrypt-decrypt-';
import { Message } from '../../features/messages/model/message.model';

/// <reference lib="webworker" />

export type ReceivedMessage = Message & { encrypted_session_base64: string };
export enum DecryptionActionType {
  DecryptConversations = 'decrypt-conversations',
  DecryptedConversations = 'decrypted-conversations',
  DecryptSingleMessage = 'decrypt-single-message',
  DecryptedSingleMessage = 'decrypted-single-message',
}
export type DecryptConversationsParams = {
  conversations: Conversation[];
  receiverPrivateKeyBase64: string;
  decryptionEmail: string;
};
export type DecryptSingleMessageParams = Omit<DecryptConversationsParams, 'conversations'> & {
  messageToDecrypt: Message & { encrypted_session_base64: string };
};

addEventListener('message', async ({ data }) => {
  if (!data || !Object.values(DecryptionActionType).includes(data.action)) {
    postMessage({ error: 'Invalid action or missing data' });
    return;
  }

  try {
    switch (data.action) {
      case DecryptionActionType.DecryptConversations:
        await handleDecryptConversations(data);
        break;
      default:
        postError(`Unsupported action: ${data.action}`);
        close();
        break;
    }
  } catch (error) {
    postError(`Unhandled error: ${error}`);
    close();
  } finally {
    // Always terminate to prevent lingering processes
    close();
  }
});

// Handles decryption of conversations.
async function handleDecryptConversations(data: any){
  const params: DecryptConversationsParams = {
    conversations: data.conversations,
    receiverPrivateKeyBase64: data.privateKey,
    decryptionEmail: data?.email,
  };

  const result = await decryptConversations(params);

  postMessage({
    action: DecryptionActionType.DecryptedConversations,
    conversations: result,
  });
}

// Decrypt messages in each conversation asynchronously
async function decryptConversations(data: DecryptConversationsParams) {
  const decryptedConversations = [];
  for (const conversation of data.conversations) {
    if (!conversation.messages) {
      decryptedConversations.push(conversation);
      continue;
    }

    if (!conversation.encrypted_session_base64) {
      throw new Error('Something wrong');
    }

    // Precompute decryption session
    const session = {
      encryptedSessionKeyBase64: conversation.encrypted_session_base64,
      receiverPrivateKeyBase64: data.receiverPrivateKeyBase64,
      receiverEmail: data.decryptionEmail,
    };

    // Decrypt all messages in a single pass //
    const decryptedMessages = await Promise.all(
      conversation.messages.map(async (msg) => decryptSingleMessage(session, msg))
    );

    decryptedConversations.push({ ...conversation, messages: decryptedMessages });
  }
  return decryptedConversations;
}

// Decrypts a single message, handling errors gracefully.
async function decryptSingleMessage(
  session: { encryptedSessionKeyBase64: string; receiverPrivateKeyBase64: string; receiverEmail: string },
  msg: Message
): Promise<Message> {
  try {
    const decryptedContent = await MessageEncryptDecrypt.decryptMessage({
      ...session,
      encryptedMessageBase64: msg.content,
    });
    return { ...msg, content: decryptedContent };
  } catch (error) {
    console.error(`[Worker] Decryption failed for message ID: ${msg.id}`, error);
    return { ...msg, content: 'Error decrypting message' };
  }
}

// Posts error messages back to the main thread.
function postError(error: string | Error) {
  const message = error instanceof Error ? error.message : error;
  console.error('[Worker] Error:', message);
  postMessage({ error: message });
}
