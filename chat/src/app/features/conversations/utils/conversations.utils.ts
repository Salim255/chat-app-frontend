import { Conversation } from '../models/conversation.model';

export function sortConversations(conversations: Conversation[]): Conversation[] {
  return conversations.sort((a, b) =>
    new Date(b.last_message?.updated_at ?? 0).getTime() -
    new Date(a.last_message?.updated_at ?? 0).getTime()
  );
}

export function initializeConversationsMap(
  conversations: Conversation[],
  ): Map<string, Conversation> {
  const map = new Map<string, Conversation>();
  conversations.forEach(conversation => {
    if (conversation.id) {
      map.set(conversation.id.toString(), conversation);
    }
  });
  return map;
}
