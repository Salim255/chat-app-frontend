import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { PartnerConnectionStatus } from "src/app/core/services/socket-io/socket-room.service";
import { Partner } from "src/app/shared/interfaces/partner.interface";

@Injectable({providedIn: 'root'})

export class ActiveConversationPartnerService {
  partnerInfoSource = new BehaviorSubject<Partner | null>(null);
  partnerRoomStatusSource = new BehaviorSubject<PartnerConnectionStatus | null>(null);

  constructor(){}

  // Here we set conversation's partner information
  setPartnerInfo(data: Partner | null): void {
    //this.receiverPublicKey = data?.public_key ?? null;
    this.partnerInfoSource.next(data);
  }

  setPartnerInRoomStatus(status: PartnerConnectionStatus | null): void {
    this.partnerRoomStatusSource.next(status);
  }

  get partnerInRoomStatus(): PartnerConnectionStatus | null {
    return this.partnerRoomStatusSource.value;
  }

  get partnerInfo(): Partner | null {
    return this.partnerInfoSource.value;
  }

  get getPartnerInfo(): Observable<Partner| null> {
    return this.partnerInfoSource.asObservable();
  }

  get getPartnerConnectionStatus(): Observable<PartnerConnectionStatus | null> {
    return this.partnerRoomStatusSource.asObservable();
  }


}
