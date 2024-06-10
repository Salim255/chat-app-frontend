import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SocketIoService {
  private ENV = environment;
  private socket!: Socket;
  private nsSocket: any;
  private activeNamespaceSocket: any;
  private activeNamespace: any;
  private comingTypingSource = new BehaviorSubject < any > (null) ;

  constructor() {

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

  get comingTypingEvent () {
     return this.comingTypingSource.asObservable();
  }

  joinConversation (activeConversation: any) {
     this.socket.emit('joinedConversation', activeConversation);

     this.socket.on('joinedNamespace', (data) => {
      // Establish active Namespace connection
      this.establishNamespaceConnection (data)

      // Connect to current namespace
      this.currentNamespacedConnectionListener ()

      // Listen to partner coming typing
      this.partnerTyping();
     })
  }

  establishNamespaceConnection (data: any) {
    this.activeNamespace = data.namespace;
    this.activeNamespaceSocket = io(`http://localhost:4003${data.namespace}`,  {
      transports: ['websocket', 'polling'],
      withCredentials: true // Ensure credentials are sent with the request
    });
  }
  currentNamespacedConnectionListener () {
    this.activeNamespaceSocket.on('connect', ()  =>  {
      console.log('We connected with success to the name space');

    })
  }

  partnerTyping() {
    this.activeNamespaceSocket.on('typingServer', (data:any)  =>  {
      this.comingTypingSource.next(data)
    })
  }
}
