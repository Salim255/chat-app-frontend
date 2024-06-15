import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable} from 'rxjs';
import { ConversationService } from '../conversation/conversation.service';

@Injectable({
  providedIn: 'root'
})

export class SocketIoService {
  private ENV = environment;
  private socket!: Socket;
  private nsSocket: any;
  private activeNamespaceSocket: any;
  private activeNamespace: any;
  private comingTypingSource = new BehaviorSubject < boolean > (false) ;
  private comingMessageSource = new BehaviorSubject <any> (null);

  constructor(private conversationService: ConversationService) {

    this.socket = io('http://localhost:4003',  {
      transports: ['websocket', 'polling'],
      withCredentials: true // Ensure credentials are sent with the request
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket.on('Welcome', (data) => {
        console.log(data);
      })
    })
  }



  userIsTyping () {
    this.activeNamespaceSocket.emit('typing');
  }

  userStopTyping () {
    this.activeNamespaceSocket.emit('stopTyping');
  }

  get comingTypingEvent () {
     return this.comingTypingSource.asObservable();
  }

  get comingMessage () {
    return this.comingMessageSource.asObservable();
  }

  joinConversation (activeConversation: any) {
      this.socket.emit('joinedConversation', activeConversation);

      this.socket.on('joinedNamespace', (data) => {
      // Establish active Namespace connection
      this.establishNamespaceConnection(data)

      // Connect to current namespace
      this.currentNamespacedConnectionListener()

      // Listen to partner coming typing
      this.partnerTyping();

      // Listen to user stop typing
      this.partnerStopTyping();

      // Listen to sent message by receiver
      this.activeNamespaceSocket.on('emittingSentMessage', (data: any) => {

        this.comingMessageSource.next(data);
        console.log(data, "Hello data");

        // Update message status to delivered
        let deliveredObs: Observable <any>;
        deliveredObs = this.conversationService.updateMessagesStatus(data.chatId, 'delivered');
        deliveredObs.subscribe({
          error: (err) => {
            console.log(err);
          },
          next: (response) => {

            console.log("Hello from update message", response);

            // fetch current chat
            let chatObs: Observable <any> ;
            chatObs = this.conversationService.fetchChatByUsers(data.partnerId);
            chatObs.subscribe()
          }
        });
      });

     });

  }

  establishNamespaceConnection (data: any) {
    this.activeNamespace = data.namespace;
    this.activeNamespaceSocket = io(`http://localhost:4003${data.namespace}`,  {
      transports: ['websocket', 'polling'],
      withCredentials: true // Ensure credentials are sent with the request
    });

    // Update messages status to read emitter
    //this.activeNamespaceSocket.emit('setMessagesStatusToRead', { data })

  }
  currentNamespacedConnectionListener () {
    this.activeNamespaceSocket.on('connect', ()  =>  {
      console.log('We connected with success to the name space');
    })
  }

  partnerTyping() {
    this.activeNamespaceSocket.on('typingServer', (data:any)  =>  {
      this.comingTypingSource.next(true)
    })
  }

  partnerStopTyping() {
    this.activeNamespaceSocket.on('stopTypingServer', (data: any) => {
       this.comingTypingSource.next(false)
    })
  }

  sentMessageEmitter(partnerId: any, chatId: number) {
    this.activeNamespaceSocket.emit('sentMessage', { message: 'Sending message', partnerId, chatId});
  }


}
