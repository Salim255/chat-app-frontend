import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Makes it a singleton
})
export class WorkerService {
  createDecryptWorker(): Worker | null{
    if (typeof Worker !== undefined){
      // Create a new worker from the decrypt.worker file
      return new Worker(new URL('./decrypt.worker', import.meta.url), { type: 'module' });
    } else {
      // Log a warning if the environment does not support Web Workers
      console.warn('Web Workers are not supported in this environment.');
      return null;
    }
  }
}
