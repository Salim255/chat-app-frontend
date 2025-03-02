import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

type InterActionStatus = 'enable' | 'disable' ;

@Injectable({
  providedIn: "root"
})

export class InteractionButtonsService {
  private interactionBtnsStatusSource = new BehaviorSubject< InterActionStatus | null> (null)
  constructor(){}

  toggleInteractionBtns( status: InterActionStatus | null) {
      this.interactionBtnsStatusSource.next(status)
  }

  get getInteractionBtnsStatus() {
    return this.interactionBtnsStatusSource.asObservable();
  }
}
