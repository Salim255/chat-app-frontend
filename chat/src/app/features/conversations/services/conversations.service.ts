import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, from, map, Observable, switchMap, tap } from "rxjs";
import { Conversation } from "../../active-conversation/models/active-conversation.model";
import { Preferences } from "@capacitor/preferences";
import { Message } from "../../active-conversation/interfaces/message.interface";
import { WorkerService } from "src/app/core/workers/worker.service";
import { DecryptionActionType } from "src/app/core/workers/decrypt.worker";
import { GetAuthData } from "src/app/shared/utils/get-auth-data";


export type WorkerMessage = {
  action: DecryptionActionType;
  email: string;
  privateKey: string; // User's private key
  conversations: Conversation []; // Array of Conversation objects
}

@Injectable({
  providedIn: 'root'
})

export class ConversationService {
  private ENV = environment;
  private conversationsMap = new Map<string, Conversation>();
  private conversationsSource = new BehaviorSubject< Conversation [] | null> (null);
  private worker: Worker | null = null;

  constructor(private http: HttpClient, private workerService: WorkerService) {
    this.worker = this.workerService.getWorker();
    this.setConversations(null);
    this.conversationsMap.clear();
  }

  /** Fetch conversations from the server and decrypt them if necessary */
  fetchConversations (): Observable < Conversation [] | null > {
    return from(GetAuthData.getAuthData()).pipe(
      switchMap((storedData ) => {
        if(!storedData) throw new Error("There is no auth data");

        const decryptionData = {
          email: storedData._email,
          privateKey: storedData._privateKey
        }

        return this.http.get<{ data: Conversation [] }>(`${this.ENV.apiUrl}/chats`)
        .pipe(

          map( response => response.data || null ),

          tap ( (incomingConversations) => {

            if (!incomingConversations || !this.worker) {
               if (!incomingConversations) {
                  this.conversationsMap.clear();
               }
            };

            const existingConversations = this.conversationsSource.value;
            let conversationsToDecrypt = incomingConversations;
            if (existingConversations && existingConversations.length > 0) {
              // Store existing conversation IDs in a Set for O(1) lookup
              const existingIds = new Set(existingConversations.map(conv => conv.id));
              conversationsToDecrypt = incomingConversations.filter(conv => !existingIds.has(conv.id));

              if (conversationsToDecrypt.length === 0) return; // No new conversations
            }

            this.decryptAndAddConversation(
              conversationsToDecrypt,
              existingConversations ?? [],
              decryptionData
            )
            }
          )
        )
      }),
    )
  }

  /** Update messages when the conversation partner joins */
  updatedActiveConversationMessagesToReadWithPartnerJoin(updatedConversation: Conversation) {
    if (!updatedConversation || !updatedConversation.id || !updatedConversation.messages) {
      console.error('Invalid conversation update data');
      return;
    }

    // Get the current list of conversations
    const currentConversations = this.conversationsSource.value;
    if (!currentConversations) return;

    // Find the conversation to update
    const updatedConversations = currentConversations.map(conv => {
      if (conv.id === updatedConversation.id) {
        // Ensure messages are not null
        const newMessages = updatedConversation.messages ?? [];
        // Replace messages & update last_message
        const updatedConv = {
          ...conv,
          messages: newMessages,
          no_read_messages: 0,
          last_message:  newMessages.length > 0
            ?  newMessages[ newMessages.length - 1]
            : conv.last_message
        };

        // Update the map
        this.conversationsMap.set( updatedConversation.id + '', updatedConv);
        return updatedConv;
      }
      return conv;
    });
    // Emit updated conversations
    this.conversationsSource.next(updatedConversations);
  }

  /** Update conversation with new message */
  updateConversationWithNewMessage(message: Message, actionTypeReceive = false) {
    if (message ) {

    const conversationId = message.chat_id.toString();
    const conversation = this.conversationsMap.get(conversationId);

    if (!conversation) return

      // Create a shallow copy of the conversation to avoid mutation
      const updatedConversation = { ...conversation };

      // Update the messages array with the new message
      updatedConversation.messages = [...(updatedConversation.messages || []), message];

      // Update the last message of the conversation
      updatedConversation.last_message = message;

      if(actionTypeReceive){
        // If the message is received, increment the unread message count
        updatedConversation.no_read_messages = (updatedConversation.no_read_messages || 0) + 1;
      } else {
        // If the change is due to a sent message, reset the unread message count
        updatedConversation.no_read_messages = 0;
      }
      // Set the updated conversation back into the Map
      this.conversationsMap.set(conversationId, updatedConversation);

      // Reflect the change in the UI array (this will trigger UI updates)
      this.setConversations(Array.from(this.conversationsMap.values()));
    }
  }

  updatedActiveConversationMessagesToDeliveredWithPartnerRejoinRoom(activeChat: Conversation) {
    if (!activeChat.id || !activeChat.messages ) return
        // 1. Update the messages in the active conversation (in conversationsMap)
      const conversationId = activeChat.id.toString(); // Ensure it's a string
      const conversation = this.conversationsMap.get(conversationId);

      if (!conversation) return; // If the conversation doesn't exist, exit early

      // Create a shallow copy of the conversation to avoid mutation
      const updatedConversation = { ...conversation };

      // Replace the messages in the conversation with updated activeChat.messages
      updatedConversation.messages = [...activeChat.messages];

      // Set the updated conversation back into the Map
      this.conversationsMap.set(conversationId, updatedConversation);
      // Reflect the change in the UI array (this will trigger UI updates)
      this.setConversations(Array.from(this.conversationsMap.values()));

  }
  /** Set conversations in the BehaviorSubject */
  setConversations (chats: Conversation[] | null) {
    this.conversationsSource.next(chats);
  }
  /** Get conversations as observable */
  get getConversations () {
    return this.conversationsSource.asObservable()
  }

  /** Initialize the conversation map from the array */
  private initializeConversationsMap(conversations: Conversation[]) {
    this.conversationsMap.clear();
    conversations.forEach(convo => {
      if (convo.id) {
        this.conversationsMap.set(convo.id.toString(), convo);
      }
    });
  }

  /** Decrypt conversations using a worker */
  private decryptAndAddConversation (
    conversationsToDecrypt: Conversation [],
    existingConversations: Conversation[] ,
    decryptionData: any)
    {

    if (!this.worker) return;

    const workerMessageData: WorkerMessage =
    {
      action: DecryptionActionType.decryptConversations,
      ...decryptionData,
      conversations:  conversationsToDecrypt
    }

    this.worker.postMessage(workerMessageData);

    // Listen for the worker's response and update conversations
    this.worker.onmessage = (event: MessageEvent) => {
      const decryptedData = event.data;

      // Now update the conversations with decrypted data
      if (decryptedData && decryptedData.conversations) {
        this.setConversations(existingConversations ?
          [...existingConversations, ...decryptedData.conversations]
          : decryptedData.conversations);
        this.initializeConversationsMap(this.conversationsSource.value || []);
      }
    };
  }
}
