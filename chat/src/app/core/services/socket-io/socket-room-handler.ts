import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Message } from "src/app/features/active-conversation/interfaces/message.interface";
import { JoinRomData } from "./socket-io.service";

@Injectable(
  {
    providedIn: 'root'
  }
)

export class SocketRoomHandler {
   private updatedMessagesToReadAfterPartnerJoinedRoomSubject = new BehaviorSubject<Message[] | null>(null);

   constructor(){}

  handleRoomEvent(socket: any) {
    socket.on('partner-joined-room', (updatedMessagesToRead: Message[]) => {
      if (updatedMessagesToRead) {
        this.setUpdatedMessagesToReadAfterPartnerJoinedRoom(updatedMessagesToRead);
      }
    });
  }

  setUpdatedMessagesToReadAfterPartnerJoinedRoom(messages: Message[] | null) {
      this.updatedMessagesToReadAfterPartnerJoinedRoomSubject.next(messages);
    }

  get getUpdatedMessagesToReadAfterPartnerJoinedRoom() {
    return this.updatedMessagesToReadAfterPartnerJoinedRoomSubject.asObservable();
  }

  handleJoinRoomEmit(socket:  any, usersData: JoinRomData){
     // Trigger join-room event
     socket?.emit('join-room', usersData)
  }

  handleLeaveRoomEmit(socket: any, roomId: string , userId: number){
    socket?.emit('leave-room', { roomId, userId})
  }

}
