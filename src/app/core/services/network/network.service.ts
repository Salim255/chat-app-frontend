import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private networkStatusSource = new BehaviorSubject<boolean>(true);

  constructor() {
    this.initializeNetworkListener();
  }

  private initializeNetworkListener() {
    Network.addListener('networkStatusChange', (status) => {
      this.networkStatusSource.next(status.connected);
    });

    // Check the initial network status
    this.checkInitialNetworkStatus();
  }

  private async checkInitialNetworkStatus() {
    const status = await Network.getStatus();
    this.networkStatusSource.next(status.connected);
  }

  getNetworkStatus() {
    return this.networkStatusSource.asObservable();
  }
}
