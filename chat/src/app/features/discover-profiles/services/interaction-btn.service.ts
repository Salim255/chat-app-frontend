import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SwipeDirection } from "../pages/discover/discover.page";

@Injectable({
  providedIn: 'root'
})

export class InteractionBtnService {
  private actionDirectionSource = new BehaviorSubject<SwipeDirection | null>(null)
  constructor(){}

  setActionDirection(action: SwipeDirection | null) {
    this.actionDirectionSource.next(action)
  }

  get getActionDirection() {
      return this.actionDirectionSource.asObservable();
  }
}
