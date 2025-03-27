import { Injectable, signal } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class LoadingSpinnerService {
  private spinnerSource = new BehaviorSubject<boolean>(false);
  private isVisibleSpinner = signal<boolean>(false);

  constructor () {}

  get getSpinnerStatus() {
    return  this.spinnerSource.asObservable();
  }

  showSpinner() {
    if(this.isVisibleSpinner()) return;
    this.spinnerSource.next(true);
    this.isVisibleSpinner.set(true);
  }

  hideSpinner() {
    if(!this.isVisibleSpinner()) return
    this.spinnerSource.next(false);
    this.isVisibleSpinner.set(false);
  }

}
