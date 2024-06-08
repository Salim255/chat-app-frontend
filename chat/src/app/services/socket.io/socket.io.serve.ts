import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SocketIoService {
  private ENV = environment;
  private socket!: Socket;
  private nsSocket: any;
  private activeNamespaceSocket: any;
  private activeNamespace: any;

  constructor() {}

  connect ()  {

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
    console.log('====================================');
    console.log("Hello from typing...");
    console.log('====================================');
    this.activeNamespaceSocket.emit('typing');

  }

  joinConversation (activeConversation: any) {
     this.socket.emit('joinedConversation', activeConversation);
     this.socket.on('joinedNamespace', (data) => {
      this.activeNamespace = data.namespace;
      this.activeNamespaceSocket = io(`http://localhost:4003${data.namespace}`,  {
        transports: ['websocket', 'polling'],
        withCredentials: true // Ensure credentials are sent with the request
      });
      this.activeNamespaceSocket.on('connect', ()  =>  {
        console.log('We connected with success to the name space');
      })
     })
  }
}
