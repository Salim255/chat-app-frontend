import { Injectable } from "@angular/core";
import { SocketCoreService } from "./socket-core.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SocketPresenceService {
  constructor(private socketCore: SocketCoreService) {}

  listenForUserStatusChanges(): Observable<{ userId: string; status: string }> {
    return new Observable(observer => {
      const socket = this.socketCore.getSocket();
      if (!socket) return;

      const listener = (status: { userId: string; status: string }) => observer.next(status);
      socket.on('user_status_changed', listener);

      return () => socket.off('user_status_changed', listener);
    });
  }

  sendPing(): void {
    const socket = this.socketCore.getSocket();
    socket?.emit('ping', { time: new Date() });
  }
}
