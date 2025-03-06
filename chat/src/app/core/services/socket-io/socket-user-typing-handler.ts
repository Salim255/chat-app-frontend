import { Injectable } from "@angular/core";

export type TypingData = {
  roomId: string;
  toUserId: number;
  typingStatus: 'typing' | 'stop-typing';
}

@Injectable({
  providedIn: 'root'
})

export class SocketUserTypingHandler {
  constructor(){}

  handleTypingListeners(socket: any, data: TypingData) {
    socket?.emit('user-stop-typing', data)
  }

  handleTypingEmitters(socket: any, data: TypingData){
    socket?.emit('user-typing',  data )
  }
}
