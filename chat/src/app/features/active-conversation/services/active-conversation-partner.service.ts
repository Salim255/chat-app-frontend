import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { PartnerConnectionStatus } from "src/app/core/services/socket-io/socket-room.service";
import { UserInChatDto } from "../../conversations/interfaces/conversations.dto";

@Injectable({providedIn: 'root'})

export class ActiveConversationPartnerService {
  partnerInfoSource = new BehaviorSubject< UserInChatDto | null>(null);
  partnerRoomStatusSource = new BehaviorSubject<PartnerConnectionStatus | null>(null);

  constructor(){}

  // Here we set conversation's partner information
  setPartnerInfo(data:  UserInChatDto | null): void {
    //this.receiverPublicKey = data?.public_key ?? null;
    this.partnerInfoSource.next(data);
  }

  setPartnerInRoomStatus(status: PartnerConnectionStatus | null): void {
    this.partnerRoomStatusSource.next(status);
  }

  get partnerInRoomStatus(): PartnerConnectionStatus | null {
    return this.partnerRoomStatusSource.value;
  }

  get partnerInfo(): UserInChatDto | null {
    return this.partnerInfoSource.value;
  }

  get getPartnerInfo(): Observable<UserInChatDto| null> {
    return this.partnerInfoSource.asObservable();
  }

  get getPartnerConnectionStatus(): Observable<PartnerConnectionStatus | null> {
    return this.partnerRoomStatusSource.asObservable();
  }
}
