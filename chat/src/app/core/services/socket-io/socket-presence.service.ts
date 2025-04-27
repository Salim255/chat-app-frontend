import { Injectable } from "@angular/core";
import { SocketCoreService } from "./socket-core.service";
import { Member } from "src/app/shared/interfaces/member.interface";
import { Socket } from "socket.io-client";
import { SocketRoomService } from "./socket-room.service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SocketPresenceService {
  private socket: Socket | null = null;
  private randomUserConnectionStatusSubject = new BehaviorSubject<Member | null>(null);

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
    this.socket?.on('user-offline', (updatedUser: Member) => {

      if (updatedUser) {
        console.log( updatedUser, 'Hello from random user goes offline')
       this.setRandomUserConnectionStatus(updatedUser);
      }
    });
  }

  randomUserGoesOnline():void {
    this.socket?.on('user-online', (updatedUser: any) => {
      console.log( updatedUser, 'Hello from random user goes online')
      if (updatedUser) {
        this.setRandomUserConnectionStatus(updatedUser);
      }
    });
  }

  setRandomUserConnectionStatus(updatedUser: Member | null): void {
    this.randomUserConnectionStatusSubject.next(updatedUser);
  }

  get getRandomUserConnectionStatus(): Observable<Member | null> {
    return this.randomUserConnectionStatusSubject.asObservable();
  }

}
