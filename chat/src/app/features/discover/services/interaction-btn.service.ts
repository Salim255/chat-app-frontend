import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SwipeDirection } from '../discover.page';

@Injectable({
  providedIn: 'root',
})
export class InteractionBtnService {
  private actionDirectionSource = new BehaviorSubject<SwipeDirection | null>(null);
  constructor() {}

  setActionDirection(action: SwipeDirection | null): void {
    this.actionDirectionSource.next(action);
  }

  get getActionDirection(): Observable<SwipeDirection | null> {
    return this.actionDirectionSource.asObservable();
  }
}
