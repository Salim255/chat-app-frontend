import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class LoadingSpinnerService {
  private spinnerSource = new BehaviorSubject<boolean>(false);

  constructor () {}

  get getSpinnerStatus() {
    return  this.spinnerSource.asObservable();
  }

  showSpinner() {
    this.spinnerSource.next(true)
  }

   hideSpinner() {
    this.spinnerSource.next(false)
  }

}
