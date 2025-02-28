import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type displayTap =  'show' | 'hide';
export type tapSide = 'left' | 'right';
export interface TapEventData {
  clientId: number,
  tapSide: tapSide
}

@Injectable({
  providedIn: 'root'
})

export class TapService {
  private hideTapStatusSource = new BehaviorSubject <displayTap>('show');
  private tapEventSource = new BehaviorSubject <any>(null);

  constructor() {}

  setTapEventSource(data: TapEventData) {
    this.tapEventSource.next(data)
  }

  setTapHidingStatus(status: displayTap){
      this.hideTapStatusSource.next(status)
  }

  get getHidingTapStatus() {
    return  this.hideTapStatusSource.asObservable();
  }

  get getTapEventType() {
    return this.tapEventSource.asObservable()
  }

}
