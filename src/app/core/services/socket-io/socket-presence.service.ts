import { Injectable } from "@angular/core";
import { SocketCoreService } from "./socket-core.service";
import { Socket } from "socket.io-client";
import { SocketRoomService } from "./socket-room.service";
import { BehaviorSubject, Observable } from "rxjs";

export type RandomUserConnectionStatus = {
  status: 'online'| 'offline';
  userId: number
}
@Injectable({ providedIn: 'root' })
export class SocketPresenceService {
  private socket: Socket | null = null;
  private randomUserConnectionStatusSubject = new BehaviorSubject< RandomUserConnectionStatus| null>(null);

  constructor(
    private socketRoomService: SocketRoomService,
    private socketCore: SocketCoreService) {
    this.initializePresenceListener();
    console.log('Hello from Presence')
  }

  initializePresenceListener():void{
    this.socket = this.socketCore.getSocket();
    this.randomUserGoesOnline();
    this.randomUserGoesOffline();
    this.sendPing();
  }

  sendPing(): void {
    this.socket?.emit('ping', { time: new Date() });
  }

  randomUserGoesOffline(): void{
    this.socket?.on('user-offline', (updatedUser: RandomUserConnectionStatus) => {
      if(!updatedUser) return;
      //console.log( updatedUser, 'Hello from random user goes offline')
      this.setRandomUserConnectionStatus(updatedUser);
    });
  }

  randomUserGoesOnline():void {
    this.socket?.on('user-online', (updatedUser: RandomUserConnectionStatus) => {
      if (!updatedUser) return;
      this.setRandomUserConnectionStatus(updatedUser);
    });
  }

  setRandomUserConnectionStatus(updatedUser: RandomUserConnectionStatus): void {
    this.randomUserConnectionStatusSubject.next(updatedUser);
  }

  get getRandomUserConnectionStatus(): Observable<RandomUserConnectionStatus | null> {
    return this.randomUserConnectionStatusSubject.asObservable();
  }

}
