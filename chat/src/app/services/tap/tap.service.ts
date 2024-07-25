import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type tapSide = 'left' | 'right';
export interface TapEventData {
  clientId: number,
  tapSide: tapSide
}

@Injectable({
  providedIn: 'root'
})

export class TapService {
  private hideTapStatusSource = new BehaviorSubject <boolean>(false);
  private tapEventSource = new BehaviorSubject <any>(null);

  constructor() {}

  setTapEventSource(data: TapEventData) {
    this.tapEventSource.next(data)
  }

  setTapHidingStatus(status: boolean){
      this.hideTapStatusSource.next(status)
  }

  get getHidingTapStatus() {
    return  this.hideTapStatusSource.asObservable();
  }

  get getTapEventType() {
    return this.tapEventSource.asObservable()
  }

}
