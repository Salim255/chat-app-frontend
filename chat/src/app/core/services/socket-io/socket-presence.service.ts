import { Injectable } from "@angular/core";
import { SocketCoreService } from "./socket-core.service";
import { Member } from "src/app/shared/interfaces/member.interface";
import { Socket } from "socket.io-client";
import { SocketRoomService } from "./socket-room.service";

@Injectable({ providedIn: 'root' })
export class SocketPresenceService {
  private socket: Socket | null = null;
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
       // this.setPartnerConnectionStatus(updatedUser);
      }
    });
  }

  randomUserGoesOnline():void {
    this.socket?.on('user-online', (updatedUser: any) => {
      console.log( updatedUser, 'Hello from random user goes online')
      if (updatedUser) {
       // this.setPartnerConnectionStatus(updatedUser);
      }
    });
  }
}
