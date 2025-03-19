import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Makes it a singleton
})
export class WorkerService {
  private worker: Worker | null = null;

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('./decrypt.worker', import.meta.url),
        { type: 'module' }
      );
      console.log('Worker initialized:', this.worker);
    } else {
      console.warn('Web Workers are not supported in this environment.');
    }
  }

  getWorker(): Worker | null {
    return this.worker;
  }
}
