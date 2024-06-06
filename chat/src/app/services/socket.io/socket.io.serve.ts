import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SocketIoService {
  private ENV = environment;
  private socket!: Socket;

  constructor() {}

  connect ()  {
    this.socket = io('http://localhost:4003');
    this.socket.on('connect', () => {
      console.log('Connected to server');
    })
  }
}
