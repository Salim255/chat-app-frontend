import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Foreigner } from "src/app/models/foreigner.model";

@Injectable({
  providedIn: 'root'
})

export class ProfileViewerService {
  private  profileToDisplaySource = new BehaviorSubject <Foreigner | null>(null) ;

  constructor(){}

  setProfileToDisplay (profile: Foreigner) {
    this.profileToDisplaySource.next(profile);
 }
 get getProfileToDisplay() {
  return this.profileToDisplaySource.asObservable();
}

}
