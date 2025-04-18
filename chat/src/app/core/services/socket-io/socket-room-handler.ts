import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from 'src/app/features/active-conversation/interfaces/message.interface';
import { JoinRomData } from './socket-io.service';
import {
  ActiveConversationService,
  PartnerRoomStatus,
} from 'src/app/features/active-conversation/services/active-conversation.service';

@Injectable({
  providedIn: 'root',
})
export class SocketRoomHandler {
  private updatedMessagesToReadAfterPartnerJoinedRoomSubject = new BehaviorSubject<
    Message[] | null
  >(null);

  constructor(private activeConversationService: ActiveConversationService) {}

  handleRoomEvent(socket: any) {
    socket.on('partner-joined-room', (updatedMessagesToRead: Message[]) => {
      this.activeConversationService.setPartnerInRoomStatus(PartnerRoomStatus.IN_ROOM);
      if (updatedMessagesToRead && updatedMessagesToRead.length > 0) {
        // Get the active conversation
        this.setUpdatedMessagesToReadAfterPartnerJoinedRoom(updatedMessagesToRead);
      }
    });

    socket.on('partner-left-room', (data: any) => {
      this.activeConversationService.setPartnerInRoomStatus(PartnerRoomStatus.CONNECTED);
    });
  }

  setUpdatedMessagesToReadAfterPartnerJoinedRoom(messages: Message[] | null) {
    this.updatedMessagesToReadAfterPartnerJoinedRoomSubject.next(messages);
  }

  get getUpdatedMessagesToReadAfterPartnerJoinedRoom() {
    return this.updatedMessagesToReadAfterPartnerJoinedRoomSubject.asObservable();
  }

  handleJoinRoomEmit(socket: any, usersData: JoinRomData) {
    // Trigger join-room event
    socket?.emit('join-room', usersData);
  }

  handleLeaveRoomEmit(socket: any, roomId: string, userId: number) {
    socket?.emit('leave-room', { roomId, userId });
  }
}
