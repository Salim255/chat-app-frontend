import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable} from 'rxjs';
import { ConversationService } from '../conversation/conversation.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class SocketIoService {

  private socket!: Socket;
  userId: any;
  private receivedMessageEventSource = new BehaviorSubject< any > (null) ;
  private comingTypingSource = new BehaviorSubject < any > (null) ;
  private deliveredEventSource = new BehaviorSubject< any > (null) ;

  constructor(private conversationService: ConversationService, private authService: AuthService) {

    this.authService.userId.subscribe( data =>{
      this.userId = data;
      if (this.userId) {
        this.userConnected(this.userId)
      }
    });

    // Establish connection
    this.socket = io('http://localhost:4003',  {
      transports: ['websocket', 'polling'],
      withCredentials: true // Ensure credentials are sent with the request
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');


      this.socket.on('Welcome', (data) => {
        console.log(data, 'welcome');
      })

    //
    this.onMessageSent();

    //
    this.onNewMessage()

    // Listen to coming typing event
    this.onTypingListener();

    // Listen to delivered message receiver side
    this.onMessageDelivered();

    // OnMessageDeliveredSenderSide
    this.OnMessageDeliveredSenderSide()

    // Listen to message read
    this.onMessageRead()

    //
    this.onDisplayReadMessage()

    //
    this.onDisplayMessageReadSenderSide()

    //
    this.onMarkComingMessagesAsDelivered()

    })
  }

  get getMessageDeliveredToReceiver() {
    return this.deliveredEventSource.asObservable()
  }

  get getComingTypingEvent () {
    return this.comingTypingSource.asObservable();
 }

  get getComingMessage () {
    return this.receivedMessageEventSource.asObservable();
  }

  onTyping(toUserId: number, status: boolean){
    this.socket.emit('user_typing', { toUserId, status })
  }

  sendMessage(chatId: string, fromUserId: string, toUserId: string, message: string) {
    this.socket.emit('send_message', { chatId, fromUserId, toUserId, message });
  }

  onMessageSent() {
    this.socket.on('message_sent', (data) => {
      //console.log(data, "Hello Data, We need to treat this message 🚨🚨🚨");
    });
  }

  userConnected(userId: number) {
    this.socket.emit('user_connected', userId);
  }

  onTypingListener() {
    this.socket.on('typing_message', (data) => {
      console.log(data);
      this.comingTypingSource.next(data.status);
    })
  }
  onNewMessage() {
    this.socket.on('new_message', (data) => {
      console.log(data, "Hello Data, We need to treat this message 🚨🚨🚨 1");
      // Dealing with delivered message
       this.socket.emit('delivered_message',data);
       // fetch conversations
       this.fetchConversations()
    })
  }

  onMarkComingMessagesAsDelivered() {
    this.socket.on('mark_coming_messages_as_delivered', (data) => {
      console.log(data, "🏝️🏝️🏝️🌋🌋🌋🏜️🏜️");
      this.markMessagesAsDeliveredOnceUserConnected()

    })
  }
  onMessageDelivered() {
    //console.log("Hello from message delivered");
    this.socket.on('message_delivered_with_modify_fetch_messages', (data) => {
      // Run the code that modify sent messages to delivered
      let setToDelivered: Observable <any> ;
      setToDelivered = this.conversationService.updateMessagesStatus(data.chatId, 'delivered');

      setToDelivered.subscribe({
        error: (err) => {
          console.log("Error", err);
        },
        next: (res) => {
          // fetch conversations
          this.fetchConversations();

          // Update the current chat
          this.fetchCurrentConversation(data.chatId)

          //
          this.deliveredEventSource.next(data)
        }
      })
    })
  }

  OnMessageDeliveredSenderSide() {
    //message_delivered_with_fetch_messages
     //console.log("Hello from message delivered");
     this.socket.on('message_delivered_with_fetch_messages', (data) => {
      // Update the current chat
      this.fetchCurrentConversation(data.chatId)

    })
  }

  readMessage(chatId: number, toUserId: number, fromUserId: number) {
    this.socket.emit('read_message', { chatId , toUserId, fromUserId });
  }

  onMessageRead() {
    this.socket.on('message_read', (data) => {
         // Run the code that modify sent messages to read
         let setToDelivered: Observable <any> ;
         setToDelivered = this.conversationService.updateMessagesStatus(data.chatId, 'read');

         setToDelivered.subscribe({
           error: () => {
           },
           next: () => {
            console.log(data, "Fuck you ⛱️⛱️⛱️⛱️");

             // fetch conversations
             this.fetchConversations();

             // fromUserId
             this.fetchCurrentConversation(data.chatId)

             //
             this.socket.emit('display_message_read', data);

           }
         })
    })
  }

  onDisplayReadMessage() {
    this.socket.on('display_message_read', (data) => {

    })
  }

  onDisplayMessageReadSenderSide () {
    this?.socket.on('display_read_message', (data )=> {
      this.fetchCurrentConversation(data.chatId)
    })
  }

  fetchConversations () {
    let chatsObs: Observable <any> ;
    chatsObs = this.conversationService.fetchConversations();
    chatsObs.subscribe({
      error: (err) => {
        console.log(err);

      },
      next: (res) => {
        console.log(res);

      }
    });
  }

fetchCurrentConversation ( chatId: number) {
  let activeChatObs: Observable <any>;
  activeChatObs = this.conversationService.fetchChatByChatId(chatId);

 activeChatObs.subscribe({
   error: (err) =>{
     console.log('====================================');
     console.log(err);
     console.log('====================================');
   },
   next: (res) => {
     console.log(res);

   }
 })
  }


  markMessagesAsDeliveredOnceUserConnected () {
    if (this.userId) {
      let deliveredMessagesObs: Observable <any>;
      deliveredMessagesObs = this.conversationService.markMessagesAsDeliveredOnceUserConnected();
      deliveredMessagesObs.subscribe({
        error: (err) => {
          console.log(err);

        },
        next: (res) => {
          console.log(res);
        }
      })
    }
  }
}
