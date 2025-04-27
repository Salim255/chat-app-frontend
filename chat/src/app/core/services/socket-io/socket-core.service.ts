import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { io, Socket } from "socket.io-client";
import { environment } from "src/environments/environment";


export enum ConnectionStatus {
  Online = 'online',
  Offline = 'offline',
}

@Injectable({ providedIn: 'root' })
export class SocketCoreService {
  private socket: Socket | null = null;
  private readonly ENV = environment;

  private readonly connectionStatusSubject = new BehaviorSubject<ConnectionStatus>(ConnectionStatus.Offline);
  readonly connectionStatus$ = this.connectionStatusSubject.asObservable();
  constructor(){}

  initialize(userId: number): void {
    if (this.socket?.connected) return;

    this.socket = io(`${this.ENV.socketUrl}`, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket?.on('connect', () => {
      console.log(`✅ Connected as User: ${userId}`);
      this.connectionStatusSubject.next(ConnectionStatus.Online);
      this.socket?.emit('register-user', userId);
    });

    this.socket?.on('disconnect', () => {
      console.log(`❌ Disconnected`);
      this.connectionStatusSubject.next(ConnectionStatus.Offline);
    });
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}
