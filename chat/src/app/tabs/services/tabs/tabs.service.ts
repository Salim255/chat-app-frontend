import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type displayTap = 'show' | 'hide';
export type tapSide = 'left' | 'right';
export type SelectedTab = 'account' | 'conversations' | 'matches' | 'discover';
export interface TapEventData {
  clientId: number;
  tapSide: tapSide;
}

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  private hideTapStatusSource = new BehaviorSubject<displayTap>('show');
  private tapEventSource = new BehaviorSubject<any>(null);
  private pageChangerSource = new BehaviorSubject<SelectedTab>('discover');

  constructor() {}

  selectedTab(selectedTab: SelectedTab) {
    console.log('hello from service tabs', selectedTab);
    this.pageChangerSource.next(selectedTab);
  }

  get getNextPage() {
    return this.pageChangerSource.asObservable();
  }
  setTapEventSource(data: TapEventData) {
    this.tapEventSource.next(data);
  }

  setTapHidingStatus(status: displayTap) {
    this.hideTapStatusSource.next(status);
  }

  get getHidingTapStatus() {
    return this.hideTapStatusSource.asObservable();
  }

  get getTapEventType() {
    return this.tapEventSource.asObservable();
  }
}
